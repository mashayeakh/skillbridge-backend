import { BookingStatus } from "../../../../prisma/generated/prisma/browser";
import { EnumBookingStatusFilter } from "../../../../prisma/generated/prisma/commonInputTypes";
import { prisma } from "../../../lib/prisma";




export const StudentDashboardService = {

    async getDashboardSummary(studentId: string) {
        // Total bookings
        const totalBookings = await prisma.booking.count({
            where: { studentId },
        });

        // Upcoming bookings
        const upcomingBookings = await prisma.booking.count({
            where: { studentId, startTime: { gt: new Date() } },
        });

        // Completed bookings
        const completedBookings = await prisma.booking.count({
            where: { studentId, status: "COMPLETED" },
        });

        // Cancelled bookings
        const cancelledBookings = await prisma.booking.count({
            where: { studentId, status: "CANCELLED" },
        });

        // Get all bookings for additional calculations
        const allBookings = await prisma.booking.findMany({
            where: { studentId },
            select: {
                startTime: true,
                endTime: true,
                price: true,
                tutorProfile: {
                    select: {
                        id: true,
                        categories: true, // assuming you have subject field in TutorProfile
                    },
                },
                review: {
                    select: { rating: true },
                },
            },
        });

        let totalHours = 0;
        let totalSpent = 0;
        let ratingSum = 0;
        let ratingCount = 0;
        const tutorCountMap: Record<string, number> = {};
        const subjectCountMap: Record<string, number> = {};

        allBookings.forEach((b) => {
            const duration = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1000 * 60 * 60); // hours
            totalHours += duration;
            totalSpent += b.price;

            if (b.review?.rating) {
                ratingSum += b.review.rating;
                ratingCount += 1;
            }

            if (b.tutorProfile?.id) {
                tutorCountMap[b.tutorProfile.id] = (tutorCountMap[b.tutorProfile.id] || 0) + 1;
            }

            if (b.tutorProfile?.categories) {
                b.tutorProfile.categories.forEach((category) => {
                    subjectCountMap[category.id] = (subjectCountMap[category.id] || 0) + 1;
                });
            }
        });

        const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;

        const favoriteTutorId = Object.entries(tutorCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        const favoriteSubject = Object.entries(subjectCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        return {
            totalBookings,
            upcomingBookings,
            completedBookings,
            cancelledBookings,
            totalHours,
            totalSpent,
            averageRating,
            favoriteTutorId,
            favoriteSubject,
        };
    },

    //upcoming sessions
    async getUpcomingBookings(studentId: string, { limit = 5, startDate, endDate }: { limit?: number; startDate?: string; endDate?: string }) {
        return prisma.booking.findMany({
            where: {
                studentId,
                startTime: {
                    gt: startDate ? new Date(startDate) : new Date(),
                    lte: endDate ? new Date(endDate) : undefined,
                },
            },
            orderBy: { startTime: "asc" },
            take: Number(limit),
            include: {
                tutorProfile: {
                    select: {
                        id: true,
                        hourlyRate: true,
                        user: { select: { name: true, image: true } },
                    },
                },
            },
        });
    },

    // Recent Bookings History
    async getRecentBookings(studentId: string, options: { page?: number; limit?: number; status?: string; dateRange?: string }
    ) {
        const { page = 1, limit = 10, status, dateRange } = options;
        const skip = (page - 1) * limit;

        return prisma.booking.findMany({
            where: {
                studentId,
                status: status as EnumBookingStatusFilter<"Booking"> | BookingStatus | undefined,
                createdAt: dateRange
                    ? { gte: new Date(dateRange) }
                    : undefined,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: Number(limit),
            include: {
                tutorProfile: {
                    select: {
                        categories: true,
                        user: { select: { name: true } },
                    },
                },
                review: true,
            },
        });
    }

}