import { prisma } from "../../../lib/prisma";

export const TutorDashboardService = {
    async getSimpleStats(id: string) {
        console.log("USE ID ", id)
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId: id },
            include: {
                categories: true,
                bookings: true,
            },
        });

        console.log(tutor)

        if (!tutor) {
            throw new Error("Tutor profile not found");
        }

        return {
            tutorName: tutor.name,
            hourlyRate: tutor.hourlyRate,
            experienceYears: tutor.experienceYears,
            rating: tutor.rating ?? 0,
            totalCategories: tutor.categories.length,
            totalBookings: tutor.bookings.length,
        };
    },

    async getReviewSummary(tutorProfileId: string) {
        const reviews = await prisma.review.findMany({
            where: { booking: { tutorProfileId } },
        });

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach(r => {
            distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
        });

        return distribution;
    },

    async getTutorStats(userId: string) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId },
            include: {
                bookings: true, // to calculate conversion
            },
        });

        if (!tutor) {
            throw new Error("Tutor profile not found");
        }

        const totalBookings = tutor.bookings.length;
        const confirmedBookings = tutor.bookings.filter(
            (b) => b.status.toLowerCase() === "confirmed"
        ).length;

        const conversionRate =
            totalBookings === 0 ? 0 : Math.round((confirmedBookings / totalBookings) * 100);

        return {
            averageRating: tutor.rating ?? 0,
            conversionRate,
        };
    },
};
