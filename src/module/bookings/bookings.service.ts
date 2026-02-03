import z from "zod";
import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma"
import { BookingInput } from "../../types/booking";
import { BookingStatus } from "../../../prisma/generated/prisma/enums";

export const createBookingSchema = z.object({
    // studentId: z.string().uuid(),
    studentId: z.string(),
    tutorProfileId: z.uuid(),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    status: z.enum(BookingStatus),
    price: z.number().positive(),
});

export const BookingService = {
    async createBooking(payload: BookingInput) {
        const { studentId, tutorProfileId, startTime, endTime, price, status } = payload;

        if (endTime <= startTime) {
            throw new AppError(400, "End time must be after start time");
        }

        // check student
        const student = await prisma.user.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new AppError(404, "Student not found");
        }

        // check tutor profile (THIS was missing)
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { id: tutorProfileId },
        });

        if (!tutorProfile) {
            throw new AppError(404, "Tutor profile not found");
        }

        // check overlapping bookings
        const overlappingBooking = await prisma.booking.findFirst({
            where: {
                tutorProfileId,
                status: "CONFIRMED",
                startTime: { lt: endTime },
                endTime: { gt: startTime },
            },
        });

        if (overlappingBooking) {
            throw new AppError(409, "Tutor is already booked for this time slot");
        }

        // create booking
        return await prisma.booking.create({
            data: {
                studentId,
                tutorProfileId,
                startTime,
                endTime,
                price,
                status,
            },
        });
        // console.log("RE E", re)

    },


    //!get users bookings
    async getStudentBookings(studentId: string) {
        const bookings = await prisma.booking.findMany({
            where: {
                studentId,
            },
            include: {
                tutorProfile: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        hourlyRate: true,
                        rating: true,
                        userId: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return bookings;
    },




    // get all bookings
    async getAllBookings() {
        return prisma.booking.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tutorProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                        categories: {
                            include: {
                                category: true,
                            },
                        },
                    },
                },
                review: true,
            },
        });
    },

    //by id
    async getBookingById(id: string) {
        return prisma.booking.findUnique({
            where: { id },
            include: {
                student: true,
                tutorProfile: {
                    include: {
                        user: true,
                        categories: {
                            include: { category: true },
                        },
                    },
                },
                review: true,
            },
        });
    },

    //by student id
    async getBookingsByStudent(studentId: string) {
        return prisma.booking.findMany({
            where: { studentId },
            orderBy: { startTime: "desc" },
            include: {
                tutorProfile: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    },

    //by tutor (profile id)
    async getBookingsByTutorProfile(tutorProfileId: string) {
        return prisma.booking.findMany({
            where: { tutorProfileId },
            orderBy: { startTime: "desc" },
            include: {
                student: true,
            },
        });
    },

    //upcoming bookings - means only confirmed but not completed
    async getUpcomingBookings() {
        return prisma.booking.findMany({
            where: {
                startTime: {
                    gte: new Date(),
                },
                status: "CONFIRMED",
            },
            orderBy: {
                startTime: "asc",
            },
            include: {
                student: true,
                tutorProfile: true,
            },
        });
    }


}