import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma"
import { TutorTypes, UpdateTutorProfileInput } from "../../types/tutor";
import { Role } from "../../types/role";


export const TutorService = {
    // async test() {
    //     return "Tutor service is working"
    // }

    async createTutorProfile(payload: TutorTypes) {
        console.log("--> payload from tutor profile", payload);

        // 1️⃣ Check if this user already has a profile
        const existingProfile = await prisma.tutorProfile.findUnique({
            where: { userId: payload.userId }
        });

        if (existingProfile) {
            throw new AppError(400, "You already have a tutor profile. You cannot create another one.");
        }

        const data = {
            name: payload.name,
            bio: payload.bio,
            hourlyRate: payload.hourlyRate,
            experienceYears: payload.experienceYears,
            rating: payload.rating || null,
            userId: payload.userId
        };

        console.log("DATA to be added", data);

        return await prisma.tutorProfile.create({ data });
    }
    ,


    //get by id
    async getTutorProfileById(id: string) {
        const result = await prisma.tutorProfile.findUnique({
            where: {
                id: id
            },
        })
        return result;
    },

    async getTutorProfile() {
        const result = await prisma.tutorProfile.findFirstOrThrow({
            include: {
                categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        console.log("your profile ", result)
        return {
            ...result,
            categories: result.categories.map(tc => tc.category)
        };
    },


    //get all tutors
    async getAllTutors() {
        const result = await prisma.tutorProfile.findMany({
            include: {
                categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        return {
            totalTutors: result.length,
            // categories: result.map(tc => tc.categories),
            tutors: result,
        }
    },


    //update tutor profile
    async updateProfile(payload: UpdateTutorProfileInput) {
        const { tutorProfileId, name, bio, hourlyRate, experienceYears, rating, categoryIds } = payload;

        // 1️⃣ Update basic info
        const updatedProfile = await prisma.tutorProfile.update({
            where: { id: tutorProfileId },
            data: {
                name,
                bio,
                hourlyRate,
                experienceYears,
                rating: rating ?? null
            }
        });

        // 2️⃣ Update categories if provided
        if (categoryIds && categoryIds.length > 0) {
            // Delete existing categories
            await prisma.tutorCategory.deleteMany({
                where: { tutorProfileId }
            });

            // Add new categories
            const categoriesData = categoryIds.map(categoryId => ({
                tutorProfileId,
                categoryId
            }));

            await prisma.tutorCategory.createMany({ data: categoriesData });
        }

        // 3️⃣ Return updated profile with categories
        return prisma.tutorProfile.findUnique({
            where: { id: tutorProfileId },
            include: { categories: { include: { category: true } } }
        });
    },


    //updgrade to tutor
    async upgradeToTutor(id: string) {
        //todo check if the user is already a tutor
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        console.log("--user ", user)

        if (!user) {
            throw new AppError(404, "User not found");
        }

        if (user.role === Role.TUTOR) {
            throw new AppError(400, "User is already a tutor");
        }

        //TODO NOW JUST UPGRATE TO TUTOR
        const result = await prisma.user.update({
            where: { id: id },
            data: { role: Role.TUTOR }
        })

        console.log("RESUKKKKK", result)
        return result;

    }
}