import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma";
import { CategoryCreatePayload, CategoryUpdatePayload } from "../../types/category";
import { Role } from "../../types/role";


export const AdminService = {
    async getAllUsers() {
        // fetch all users and include their tutor profile if they have one
        const users = await prisma.user.findMany({
            include: {
                tutorProfile: {
                    include: {
                        categories: {
                            include: {
                                category: true
                            }
                        },
                        availabilities: true,
                        bookings: true
                    }
                },
                studentBookings: true
            }
        });

        return users;
    },


    //updarte status
    async updateUser_Status(userId: string, status: string) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        console.log("user", user)

        if (!user) {
            throw new AppError(404, "User not found");
        }

        return prisma.user.update({
            where: { id: userId },
            data: { status },
        });
    },

    //!ban / unban user
    async updateUserStatus(adminId: string, targetUserId: string, status: "ACTIVE" | "BANNED") {

        //check target user
        const user = await prisma.user.findUnique({
            where: {
                id: targetUserId
            }
        })
        console.log("**** Target user ", user);

        if (!user) throw new AppError(404, "User not found");


        //prevent self ban
        if (adminId === targetUserId) throw new AppError(400, "You cannot change your own status");

        //prevent banning another admin
        if (user.role === Role.ADMIN) throw new AppError(403, "You cannot ban another admin");

        //prevent redundant action
        if (user.status === status) throw new AppError(400, `User is already ${status.toLowerCase()}`);

        //just update the status
        const result = await prisma.user.update({
            where: {
                id: targetUserId
            },
            data: {
                status
            }
        })

        return result;
    },


    //all bookings
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
                        role: true,
                        status: true,
                    },
                },
                tutorProfile: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                status: true,
                            },
                        },
                    },
                },
                review: true,
            },
        });
    },




    //!manage categories
    //create categorye
    async createCategory(payload: CategoryCreatePayload) {
        const { name, description } = payload;

        // 1️⃣ Required field check
        if (!name || name.trim() === "") {
            throw new AppError(400, "Category name is required");
        }

        // 2️⃣ Normalize name
        const normalizedName = name.trim();

        // 3️⃣ Length validation
        if (normalizedName.length < 2) {
            throw new AppError(400, "Category name must be at least 2 characters long");
        }

        if (normalizedName.length > 50) {
            throw new AppError(400, "Category name cannot exceed 50 characters");
        }

        // 4️⃣ Check for existing category (case-insensitive)
        const existingCategory = await prisma.category.findFirst({
            where: {
                name: {
                    equals: normalizedName,
                    mode: "insensitive",
                },
            },
        });

        if (existingCategory) {
            // If exists but inactive, tell admin clearly
            if (!existingCategory.isActive) {
                throw new AppError(
                    400,
                    "Category already exists but is inactive. Consider reactivating it."
                );
            }

            throw new AppError(409, "Category already exists");
        }

        // 5️⃣ Create category
        return await prisma.category.create({
            data: {
                name: normalizedName,
                description,
            },
        });
    },

    //get all categories
    async getAllCategories(includeInactive = true) {
        return await prisma.category.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { createdAt: "desc" },
        });
    },

    //update category
    async updateCategory(categoryId: string, payload: CategoryUpdatePayload) {
        // 1️⃣ Check existence
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            throw new AppError(404, "Category not found");
        }

        // 2️⃣ Validate name if provided
        if (payload.name) {
            const normalizedName = payload.name.trim();

            if (normalizedName.length < 3) {
                throw new AppError(400, "Category name must be at least 3 characters");
            }

            // 3️⃣ Check uniqueness (exclude self)
            const existing = await prisma.category.findFirst({
                where: {
                    name: {
                        equals: normalizedName,
                        mode: "insensitive",
                    },
                    NOT: { id: categoryId },
                },
            });

            if (existing) {
                throw new AppError(409, "Another category with this name already exists");
            }

            payload.name = normalizedName;
        }

        // 4️⃣ Update
        return await prisma.category.update({
            where: { id: categoryId },
            data: payload,
        });
    },

    //Deactivate category (not deleting)
    async deactivateCategory(categoryId: string) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            throw new AppError(404, "Category not found");
        }

        if (!category.isActive) {
            throw new AppError(400, "Category is already inactive");
        }

        return await prisma.category.update({
            where: { id: categoryId },
            data: { isActive: false },
        });
    },

    //hard delete category
    async deleteCategory(categoryId: string) {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { tutors: true },
        });

        if (!category) {
            throw new AppError(404, "Category not found");
        }

        if (category.tutors.length > 0) {
            throw new AppError(
                400,
                "Cannot delete category because tutors are using it"
            );
        }

        return await prisma.category.delete({
            where: { id: categoryId },
        });
    },

    //!-------------Users Management

    // 1. Get all users                - DONE
    // async getAllUsers() {
    //     return prisma.user.findMany({
    //         include: {
    //             studentBookings: true,
    //             tutorProfile: true,
    //         },
    //     });
    // },

    // 2. Get single user with bookings
    async getStudentDetails(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            include: {
                studentBookings: {
                    include: {
                        tutorProfile: {
                            include: {
                                categories: true,
                                availabilities: true,
                            },
                        },
                    },
                },
                tutorProfile: false, // not needed for student-only view
            },
        });
    },


    async getTutorDetails(userId: string) {
        return prisma.tutorProfile.findUnique({
            where: { id: userId },
            include: {
                bookings: {
                    include: {
                        student: true,
                    },
                },
                categories: true,
                availabilities: true,
            },
        });
    },

    // 3. Update user info
    async updateUserInfo(userId: string, data: { name?: string; email?: string; phone?: string }) {
        return prisma.user.update({
            where: { id: userId },
            data,
        });
    },

    // 4. Change user role
    async updateUserRole(userId: string, role: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    },

    // 5. Soft delete user
    async softDeleteUser(userId: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { status: "INACTIVE" },
        });
    },
};
