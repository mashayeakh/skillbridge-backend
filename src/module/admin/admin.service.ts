import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma";
import { CategoryCreatePayload, CategoryUpdatePayload } from "../../types/category";


// type CategoryCreatePayload = {
//   name: string;
//   description?: string;
// };


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
        if (normalizedName.length < 3) {
            throw new AppError(400, "Category name must be at least 3 characters long");
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


};
