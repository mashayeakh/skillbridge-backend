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

        console.log("******************Booking", booking)

        return booking;
    }


    //get student bookings
     
}