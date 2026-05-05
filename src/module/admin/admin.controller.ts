import { AppError } from "../../error/appErrors";
import { accountStatus } from "../../types/accStatus";
import { asyncHandler } from "../../utils/asyncHandler";
import { AdminService } from "./admin.service";
import { Request, Response } from 'express';

export const AdminController = {
    viewAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "All users retrieved successfully",
            data: users
        });
    }),


    //update status
    updateUserStatus: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            throw new AppError(400, "Status is required");
        }

        const updatedUser = await AdminService.updateUser_Status(id as string, status);

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: updatedUser,
        });
    }),

    //ban user
    banUser: asyncHandler(
        async (req: Request, res: Response) => {
            console.log("***🔥 Admin hit")
            const adminId = req?.user?.id;
            console.log("Admin id", adminId);

            const { userId } = req.params;
            console.log("User id", userId);

            const result = await AdminService.updateUserStatus(
                adminId as string,
                userId as string,
                accountStatus.BANNED
            )

            res.status(200).json({
                success: true,
                message: "User banned successfully",
                data: result,
            })
        }
    ),

    unbanUser: asyncHandler(
        async (req: Request, res: Response) => {
            const adminId = req.user?.id;
            const { userId } = req.params;

            const result = await AdminService.updateUserStatus(
                adminId as string,
                userId as string,
                accountStatus.ACTIVE
            )

            res.status(200).json({
                success: true,
                message: "User unbanned successfully",
                data: result,
            });
        }
    ),

    //view all bookings
    getAllBookings: asyncHandler(async (_req: Request, res: Response) => {
        const bookings = await AdminService.getAllBookings();

        res.status(200).json({
            success: true,
            message: "All bookings retrieved successfully",
            data: bookings,
        });
    }),

    //create category
    createCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const payload = req.body;
            const result = await AdminService.createCategory(payload);
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: result,
            });
        }
    ),

    //see all categories
    getAllCategories: asyncHandler(
        async (req: Request, res: Response) => {
            const result = await AdminService.getAllCategories()
            if (result.length === 0) {
                res.status(200).json({
                    success: true,
                    message: "No categories found",
                    // count: result.length,
                    data: result
                })
            }
            res.status(200).json({
                success: true,
                message: "Categories fetched successfully",
                count: result.length,
                data: result
            })
        }
    ),

    //update category
    updateCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;

            const updated = await AdminService.updateCategory(id as string, req.body);

            res.status(200).json({
                success: true,
                message: "Category updated successfully",
                data: updated,
            });
        }
    ),

    //deactivate category
    deactivateCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;

            const result = await AdminService.deactivateCategory(id as string);

            res.status(200).json({
                success: true,
                message: "Category deactivated successfully",
                data: result,
            });
        }
    ),

    //hard delete category
    deleteCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            await AdminService.deleteCategory(id as string);
            res.status(200).json({
                success: true,
                message: "Category deleted permanently",
            });
        }
    ),

    //! user management

    // 1. Get all users
    getAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    }),

    // 2. Get single user by ID
    getStudent: asyncHandler(
        async (req: Request, res: Response) => {
            const { userId } = req.params;
            const student = await AdminService.getStudentDetails(userId as string);

            if (!student) return res.status(404).json({ message: "Student not found" });

            res.status(200).json({
                success: true,
                message: "Student details retrieved successfully",
                data: student
            });
        }
    ),

    getTutor: asyncHandler(
        async (req: Request, res: Response) => {
            const { userId } = req.params;
            const tutor = await AdminService.getTutorDetails(userId as string);

            if (!tutor) return res.status(404).json({ message: "Tutor not found" });

            res.status(200).json({
                success: true,
                message: "tutor details retrieved successfully",
                data: tutor
            });
        }
    ),

    // // 3. Update user info (name, email, phone)
    // updateUser: asyncHandler(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const { name, email, phone } = req.body;
    //     const updatedUser = await AdminService.updateUserInfo(id as string, { name, email, phone });
    //     res.status(200).json({ success: true, data: updatedUser });
    // }),

    // // 4. Change user role
    // changeUserRole: asyncHandler(async (req: Request, res: Response) => {
    //     const { id } = req.params;
    //     const { role } = req.body;
    //     const updatedUser = await AdminService.updateUserRole(id as string, role);
    //     res.status(200).json({ success: true, data: updatedUser });
    // }),

    // 5. Soft delete user (set status to INACTIVE)
    deleteUser: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const deletedUser = await AdminService.softDeleteUser(id as string);
        res.status(200).json({
            success: true,
            message: "User has been set to INACTIVE",
            data: deletedUser,
        });
    }),
};

