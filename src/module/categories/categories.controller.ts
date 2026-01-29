import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";
import { asyncHandler } from './../../utils/asyncHandler';

export const CategoriesController = {
    async getTest(req: Request, res: Response) {
        const result = await CategoriesService.test();
        console.log("RE", result)
        res.status(200).json({
            success: true,
            data: result
        });
    },

    // //create category
    // createCategory: asyncHandler(
    //     async (req: Request, res: Response) => {
    //         const payload = req.body;
    //         res.status(201).json({
    //             success: true,
    //             message: "Category created successfully",
    //             data: await CategoriesService.createCategory(payload),
    //         });
    //     }
    // ),

    // getAllCategories: asyncHandler(
    //     async (req: Request, res: Response) => {
    //         const result = await CategoriesService.getAllCategories()
    //         if (result.length === 0) {
    //             res.status(200).json({
    //                 success: true,
    //                 message: "No categories found",
    //                 // count: result.length,
    //                 data: result
    //             })
    //         }
    //         res.status(200).json({
    //             success: true,
    //             message: "Categories fetched successfully",
    //             count: result.length,
    //             data: result
    //         })
    //     }
    // ),



}