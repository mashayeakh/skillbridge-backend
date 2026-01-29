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

    //create category
    createCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const payload = req.body;
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: await AdminService.createCategory(payload),
            });
        }
    ),

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


};
