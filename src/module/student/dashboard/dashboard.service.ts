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
            if (!b.startTime || !b.endTime) return;
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
    },

    //pending reviews
    async getPendingReviews(studentId: string) {
        return prisma.booking.findMany({
            where: {
                studentId,
                status: "COMPLETED",
                review: null,
            },
            include: {
                tutorProfile: {
                    select: {
                        categories: true,
                        user: { select: { name: true } },
                    },
                },
            },
        });
    },

    //learning progress
    async getLearningProgress(studentId: string) {
        const bookings = await prisma.booking.findMany({
            where: {
                studentId,
                status: "COMPLETED",
            },
            include: {
                tutorProfile: {
                    select: {
                        categories: true,
                    },
                },
            },
        });

        const bySubjectMap: Record<string, any> = {};

        bookings.forEach(b => {
            if (!b.startTime || !b.endTime) return;
            const hours =
                (b.endTime.getTime() - b.startTime.getTime()) / 36e5;

            b.tutorProfile.categories.forEach(category => {
                const subject = category.id;

                if (!bySubjectMap[subject]) {
                    bySubjectMap[subject] = {
                        subject: subject,
                        hours: 0,
                        sessions: 0,
                        proficiency: 0,
                        lastSession: b.endTime,
                    };
                }

                bySubjectMap[subject].hours += hours;
                bySubjectMap[subject].sessions += 1;
                bySubjectMap[subject].lastSession = b.endTime;
            });
        });

        const bySubject = Object.values(bySubjectMap).map(s => ({
            ...s,
            proficiency: Math.min(100, s.sessions * 10),
        }));

        return { bySubject };
    },

    //financial summay
    async getFinancialSummary(studentId: string) {
        const bookings = await prisma.booking.findMany({
            where: {
                studentId,
                status: "COMPLETED",
            },
        });

        const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);
        const averageSessionCost =
            bookings.length ? totalSpent / bookings.length : 0;

        return {
            totalSpent,
            averageSessionCost,
            paymentHistory: bookings.map(b => ({
                date: b.createdAt,
                amount: b.price,
                bookingId: b.id,
                method: "COD",
            })),
        };
    },

    //Booking Statistics
    async getBookingStats(studentId: string) {
        const bookings = await prisma.booking.findMany({
            where: { studentId },
        });

        const byStatus: any = {};
        const byDay: any = {};
        const byHour: any = {};
        let cancelled = 0;

        bookings.forEach(b => {
            if (!b.startTime) return;
            byStatus[b.status] = (byStatus[b.status] || 0) + 1;

            const day = b.startTime.toLocaleDateString("en-US", { weekday: "short" });
            byDay[day] = (byDay[day] || 0) + 1;

            const hour = b.startTime.getHours();
            byHour[hour] = (byHour[hour] || 0) + 1;

            if (b.status === "CANCELLED") cancelled++;
        });

        return {
            byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
            byDayOfWeek: Object.entries(byDay).map(([day, count]) => ({ day, count })),
            byTimeOfDay: Object.entries(byHour).map(([hour, count]) => ({
                hour: Number(hour),
                count,
            })),
            cancellationRate: bookings.length
                ? cancelled / bookings.length
                : 0,
        };
    },

    // quick actions
    async getQuickActions(studentId: string) {
        const [pendingReviews, upcomingToday] = await Promise.all([
            prisma.booking.count({
                where: { studentId, status: "COMPLETED", review: null },
            }),
            prisma.booking.count({
                where: {
                    studentId,
                    startTime: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lte: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
        ]);

        return {
            pendingConfirmations: 0,
            pendingReviews,
            upcomingSessionsToday: upcomingToday,
            outstandingPayments: 0,
            unreadNotifications: 0,
        };
    },


    //Search & Filter Bookings
    async searchBookings(studentId: string, filters: any) {
        return prisma.booking.findMany({
            where: {
                studentId,
                status: filters.status,
                tutorProfileId: filters.tutorId,
                createdAt: {
                    gte: filters.dateFrom && new Date(filters.dateFrom),
                    lte: filters.dateTo && new Date(filters.dateTo),
                },
            },
            include: {
                tutorProfile: {
                    select: {
                        categories: true,
                        user: { select: { name: true } },
                    },
                },
            },
        });
    },

    // export bookings
    async getBookingsForExport(
        studentId: string,
        filters: { dateFrom?: string; dateTo?: string }
    ) {
        return prisma.booking.findMany({
            where: {
                studentId,
                createdAt: {
                    gte: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
                    lte: filters.dateTo ? new Date(filters.dateTo) : undefined,
                },
            },
            include: {
                tutorProfile: {
                    select: {
                        categories: true,
                        user: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
    }








}