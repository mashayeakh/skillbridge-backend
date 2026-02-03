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


type ReviewPayload = {
    bookingId: string;
    rating: number;
    comment?: string;
};


export const StudentService = {


    async studentBooking(payload: BookingPayload, studentId: string) {
        const { tutorProfileId, bookingStatus, price } = payload;

        console.log("------ payload", payload)

        if (!tutorProfileId || !bookingStatus || !price) {
            throw new AppError(400, "Missing required fields");
        }

        // const start = new Date(startTime);
        // const end = new Date(endTime);

        // if (start >= end) {
        //     throw new AppError(406, "End time must be after start time");
        // }

        // Check if tutor exists
        const tutor = await prisma.tutorProfile.findUnique({
            where: { id: tutorProfileId }
        });
        if (!tutor) throw new AppError(404, "Tutor not found");

        // Check for overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                tutorProfileId: tutorProfileId,
                // startTime: { lt: end },
                // endTime: { gt: start }
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
                // startTime: start,
                // endTime: end,
                status: bookingStatus,
                price: price
            }
        });

        // console.log("******************Booking", booking)

        return booking;
    },

    // leave a review
    async leaveReview(studentId: string, payload: ReviewPayload) {
        //TODO1 validate fields

        const { bookingId, rating, comment } = payload
        if (!bookingId || !rating) throw new AppError(400, " Missing required fields");

        if (rating < 1 || rating > 5) throw new AppError(400, "Rating must be between 1 and 5");


        //TODO2 check booking exists and is completed
        const booking = await prisma.booking.findUnique({
            where: {
                id: bookingId
            }, include: {
                review: true,
                tutorProfile: true,
            }
        })

        console.log("*******Booking ", booking)

        if (!booking) throw new AppError(404, "Booking not found");

        if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.COMPLETED) throw new AppError(400, "You can only review completed sessions");


        //TODO3 only student can leave a review

        if (booking.studentId !== studentId) throw new AppError(403, "You are not allowed to review this booking");

        //TODO4 prevent duplicate review


        if (booking.review) throw new AppError(409, "You have already reviewed this booking");

        //TODO5 create
        const studReview = await prisma.review.create({
            data: {
                bookingId,
                rating,
                comment
            }
        });

        //TODO need to make an update to tutor profile to reflect new rating as well
        const tutorId = booking.tutorProfileId;

        const reviews = await prisma.review.findMany({
            where: {
                booking: {
                    tutorProfileId: tutorId
                }
            }
        })

        //avg rating
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;


        //TODO update tutor profile as well with new avg rating
        await prisma.tutorProfile.update({
            where: { id: tutorId },
            data: { rating: avgRating }
        });

        console.log("***********Review ", studReview)
        return studReview
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

    //change password - done by better auth itselr

    //session 
    


}