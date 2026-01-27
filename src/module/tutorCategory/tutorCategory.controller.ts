import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response } from "express";
import { TutorCategoryService } from './tutorCategory.service';


export const TutorCategoryController = {

    getTest: asyncHandler(
        async (req: Request, res: Response) => {
            res.status(200).json({
                success: true,
                data: await TutorCategoryService.test()
            })
        }
    )
    ,
    // create tutor profile
    createCategory: asyncHandler(
        async (req: Request, res: Response) => {

            console.log("🚨 TUTOR CATEGORY CONTROLLER HIT");

            const { tutorProfileId, categoryId } = req.body;
            console.log("-- controller paylaod", tutorProfileId, categoryId)
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: await TutorCategoryService.createTutorCategory(tutorProfileId, categoryId)
            });
        }
    ),

}