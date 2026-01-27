import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { TutorService } from './tutor.service';


export const TutorController = {

    // getTest: asyncHandler(
    //     async (req: Request, res: Response) => {
    //         res.status(200).json({
    //             success: true,
    //             data: await TutorService.test()
    //         })
    //     }
    // )

    //create tutor profile
    createCategory: asyncHandler(
        async (req: Request, res: Response) => {
            const payload = req.body;
            console.log("-- controller paylaod", payload)
            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: await TutorService.createTutorProfile(payload)
            });
        }
    ),

}