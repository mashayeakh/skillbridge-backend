import { asyncHandler } from "../../utils/asyncHandler";
import { CategoriesService } from "../categories/categories.service";
import { AdminService } from "./admin.service";
import { Request } from 'express';
import { Response } from 'express';

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
