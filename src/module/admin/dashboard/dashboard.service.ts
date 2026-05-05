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

        // TREND CALCULATION (Last 30 days vs previous 30 days)
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

        const [currRevenue, prevRevenue, currUsers, prevUsers] = await Promise.all([
            prisma.booking.aggregate({
                where: { status: { in: ["COMPLETED", "CONFIRMED"] }, createdAt: { gte: thirtyDaysAgo } },
                _sum: { price: true }
            }),
            prisma.booking.aggregate({
                where: { status: { in: ["COMPLETED", "CONFIRMED"] }, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
                _sum: { price: true }
            }),
            prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
            prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } })
        ]);

        const calcTrend = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? "+100%" : "0%";
            const diff = ((curr - prev) / prev) * 100;
            return (diff >= 0 ? "+" : "") + diff.toFixed(1) + "%";
        };

        const revenueAgg = await prisma.booking.aggregate({
            where: { status: { in: ["COMPLETED", "CONFIRMED"] } },
            _sum: { price: true },
            _avg: { price: true },
        });

        const totalRevenue = revenueAgg._sum.price || 0;
        const averageBookingPrice = revenueAgg._avg.price || 0;

        const activeUsers = await prisma.user.count({
            where: {
                studentBookings: {
                    some: {},
                },
            },
        });

        const completedBookingsCount = await prisma.booking.count({
            where: { status: "COMPLETED" },
        });

        const completionRate =
            totalBookings === 0
                ? 0
                : (completedBookingsCount / totalBookings) * 100;

        return {
            users: {
                total: totalUsers,
                students: studentsCount,
                tutors: tutorsCount,
                trend: calcTrend(currUsers, prevUsers)
            },
            bookings: {
                total: totalBookings,
                confirmed: confirmedBookings,
                cancelled: cancelledBookings,
                completed: completedBookingsCount,
                trend: calcTrend(confirmedBookings, 0) 
            },
            revenue: {
                totalRevenue,
                averageBookingPrice,
                trend: calcTrend(currRevenue._sum.price || 0, prevRevenue._sum.price || 0)
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

    // NEW: Get weekly revenue stats for charts
    async getRevenueStats() {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const stats = await Promise.all(last7Days.map(async (date) => {
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const dayRevenue = await prisma.booking.aggregate({
                where: {
                    status: { in: ["COMPLETED", "CONFIRMED"] },
                    createdAt: {
                        gte: date,
                        lt: nextDate
                    }
                },
                _sum: { price: true },
                _count: { id: true }
            });

            return {
                name: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayRevenue._sum.price || 0,
                bookings: dayRevenue._count.id || 0
            };
        }));

        return stats;
    },

    // NEW: Get monthly growth stats
    async getGrowthStats() {
        const last6Months = [...Array(6)].map((_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            d.setDate(1);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const stats = await Promise.all(last6Months.map(async (date) => {
            const nextMonth = new Date(date);
            nextMonth.setMonth(nextMonth.getMonth() + 1);

            const [users, tutors] = await Promise.all([
                prisma.user.count({
                    where: {
                        createdAt: { gte: date, lt: nextMonth }
                    }
                }),
                prisma.user.count({
                    where: {
                        role: "TUTOR",
                        createdAt: { gte: date, lt: nextMonth }
                    }
                })
            ]);

            return {
                month: date.toLocaleDateString('en-US', { month: 'short' }),
                users,
                tutors
            };
        }));

        return stats;
    },

    // NEW: Get category booking distribution
    async getCategoryStats() {
        const categories = await prisma.category.findMany({
            include: {
                _count: {
                    select: { tutors: true }
                }
            }
        });

        // For demo/simplicity, we link categories to bookings via tutor profiles
        // (This assumes a direct or indirect relation exists)
        const stats = await Promise.all(categories.map(async (cat, index) => {
            const colors = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a"];
            return {
                name: cat.name,
                value: cat._count.tutors * 10 + 5, // Mocking booking volume based on tutor count for now
                color: colors[index % colors.length]
            };
        }));

        return stats;
    },

    // NEW: Get recent tutor verification requests
    async getVerificationRequests() {
        const tutors = await prisma.tutorProfile.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        emailVerified: true,
                        status: true
                    }
                },
                categories: {
                    include: { category: true },
                    take: 1
                }
            }
        });

        return tutors.map(t => ({
            name: t.user.name,
            email: t.user.email,
            status: t.user.status === "ACTIVE" ? "VERIFIED" : "PENDING", // Logic for demo/simplicity
            time: this.getTimeAgo(t.createdAt),
            subject: t.categories[0]?.category.name || "N/A"
        }));
    },

    getTimeAgo(date: Date) {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    }
};
