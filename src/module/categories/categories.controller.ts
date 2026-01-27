import { Request, Response } from "express";
import { CategoriesService } from "./categories.service";

export const CategoriesController = {
    async getTest(req: Request, res: Response) {
        const result = await CategoriesService.test();
        console.log("RE", result)
        res.status(200).json({
            success: true,
            data: result
        });
    }
}