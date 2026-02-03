import { prisma } from "../../lib/prisma";

export const PublicService = {

    // Get tutors with optional filters
    async browseTutors(filters: {
        categoryId?: string;
        minRating?: number;
        maxPrice?: number;
        search?: string;
    }) {
        const { categoryId, minRating, maxPrice, search } = filters;

        return await prisma.tutorProfile.findMany({
            where: {
                AND: [
                    categoryId ? {
                        categories: {
                            some: { categoryId }
                        }
                    } : {},
                    minRating !== undefined ? {
                        rating: { gte: minRating }
                    } : {},
                    maxPrice !== undefined ? {
                        hourlyRate: { lte: maxPrice }
                    } : {},
                    search ? {
                        name: { contains: search, mode: "insensitive" }
                    } : {},
                ]
            },
            include: {
                user: true,
                categories: { include: { category: true } },
                availabilities: true,
                bookings: true
            }
        });
    },

    // Get tutor by id (detailed profile)
    async getTutorById(tutorId: string) {
        return await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
            include: {
                user: true,
                categories: { include: { category: true } },
                availabilities: true,
                bookings: {
                    include: { review: true }
                }
            }
        });
    },

    // Featured tutors (e.g., highest rating)
    async getFeaturedTutors(limit = 5) {
        return await prisma.tutorProfile.findMany({
            orderBy: { rating: "desc" },
            take: limit,
            include: {
                user: true,
                categories: { include: { category: true } }
            }
        });
    },

    //!get all categories
    async getAllCategories(includeInactive = true) {
        return await prisma.category.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { createdAt: "desc" },
        });
    },

};
