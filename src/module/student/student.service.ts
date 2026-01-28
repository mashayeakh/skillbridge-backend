import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma";

enum BookingStatus {
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    COMPLETED = "COMPLETED"
}



type BookingPayload = {
    studentId: string,
    tutorProfileId: string,
    startTime: Date,
    endTime: Date,
    price: number,
    bookingStatus: BookingStatus
}
export const StudentService = {


    async studentBooking(payload: BookingPayload, studentId: string) {
        const { tutorProfileId, startTime, endTime, bookingStatus, price } = payload;

        console.log("------ payload", payload)

        if (!tutorProfileId || !startTime || !endTime || !bookingStatus || !price) {
            throw new AppError(400, "Missing required fields");
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            throw new AppError(406, "End time must be after start time");
        }

        // Check if tutor exists
        const tutor = await prisma.tutorProfile.findUnique({
            where: { id: tutorProfileId }
        });
        if (!tutor) throw new AppError(404, "Tutor not found");

        // Check for overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                tutorProfileId: tutorProfileId,
                startTime: { lt: end },
                endTime: { gt: start }
            }
        });

        if (overlappingBooking) {
            throw new AppError(406, "This time slot is already booked");
        }

        // Create booking
        const booking = await prisma.booking.create({
            data: {
                studentId,
                tutorProfileId: tutorProfileId,
                startTime: start,
                endTime: end,
                status: bookingStatus,
                price: price
            }
        });

        // console.log("******************Booking", booking)

        return booking;
    },

    //! manage student profile

    // view own profile
    async getOwnProfile(studentId: string) {
        if (!studentId) {
            throw new AppError(401, "Unauthorized");
        }

        const found = await prisma.user.findUnique({
            where: { id: studentId }
        });

        if (!found) {
            throw new AppError(404, "Student not found");
        }

        if (found.role !== "STUDENT") {
            throw new AppError(403, "Only students can access this profile");
        }

        return found;
    },


    // update own profile
    async updateOwnProfile(
        studentId: string,
        payload: { name?: string; phone?: string }
    ) {
        if (!studentId) {
            throw new AppError(401, "Unauthorized");
        }

        const { name, phone } = payload;

        if (!name && !phone) {
            throw new AppError(400, "Nothing to update");
        }

        if (name !== undefined && name.trim().length < 2) {
            throw new AppError(400, "Name must be at least 2 characters long");
        }

        if (phone !== undefined && phone.trim().length < 10) {
            throw new AppError(400, "Invalid phone number");
        }

        const existingStudent = await prisma.user.findUnique({
            where: { id: studentId }
        });

        if (!existingStudent) {
            throw new AppError(404, "Student not found");
        }

        if (existingStudent.role !== "STUDENT") {
            throw new AppError(403, "Only students can update this profile");
        }

        const updatedStudent = await prisma.user.update({
            where: { id: studentId },
            data: {
                ...(name && { name }),
                ...(phone && { phone })
            }
        });

        return updatedStudent;
    },



    // delete own profile
    async deleteOwnProfile(studentId: string) {
        if (!studentId) {
            throw new AppError(401, "Unauthorized");
        }

        const existingStudent = await prisma.user.findUnique({
            where: { id: studentId }
        });

        if (!existingStudent) {
            throw new AppError(404, "Student not found");
        }

        if (existingStudent.role !== "STUDENT") {
            throw new AppError(403, "Only students can delete their account");
        }

        const deletedStudent = await prisma.user.delete({
            where: { id: studentId }
        });

        return deletedStudent;
    }

    //change password


}