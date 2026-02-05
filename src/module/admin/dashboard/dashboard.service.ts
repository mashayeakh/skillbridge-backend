import { prisma } from "../../../lib/prisma";

export const AdminDashboardService = {

    async getPlatformAnalytics() {
        // USER METRICS
        const totalUsers = await prisma.user.count();

        const studentsCount = await prisma.user.count({
            where: { role: "STUDENT" },
        });

        const tutorsCount = await prisma.user.count({
            where: { role: "TUTOR" },
        });

        // BOOKING METRICS
        const totalBookings = await prisma.booking.count();

        const confirmedBookings = await prisma.booking.count({
            where: { status: "CONFIRMED" },
        });

        const cancelledBookings = await prisma.booking.count({
            where: { status: "CANCELLED" },
        });

        const completedBookings = await prisma.booking.count({
            where: { status: "COMPLETED" },
        });

        // REVENUE METRICS
        const revenueAgg = await prisma.booking.aggregate({
            where: { status: "COMPLETED" },
            _sum: { price: true },
            _avg: { price: true },
        });

        const totalRevenue = revenueAgg._sum.price || 0;
        const averageBookingPrice = revenueAgg._avg.price || 0;

        // PLATFORM HEALTH
        const activeUsers = await prisma.user.count({
            where: {
                studentBookings: {
                    some: {},
                },
            },
        });

        const completionRate =
            totalBookings === 0
                ? 0
                : (completedBookings / totalBookings) * 100;

        return {
            users: {
                total: totalUsers,
                students: studentsCount,
                tutors: tutorsCount,
            },
            bookings: {
                total: totalBookings,
                confirmed: confirmedBookings,
                cancelled: cancelledBookings,
                completed: completedBookings,
            },
            revenue: {
                totalRevenue,
                averageBookingPrice,
            },
            platformHealth: {
                activeUsers,
                completionRate: Number(completionRate.toFixed(2)),
            },
        };
    },

    async getAllUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                studentBookings: {
                    select: { id: true },
                },
                tutorProfile: {
                    select: { id: true },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // User verification statistics
    async getVerificationSummary() {
        const [verified, unverified] = await Promise.all([
            prisma.user.count({ where: { emailVerified: true } }),
            prisma.user.count({ where: { emailVerified: false } }),
        ]);

        return {
            verified,
            pending: unverified,
        };
    },

    // Update user account status
    async updateUserStatus(userId: string, status: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { status },
        });
    },

    // Update user role
    async updateUserRole(userId: string, role: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    },

    // Export users for reports / CSV
    async exportUsers() {
        return prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
            },
        });
    },

};
