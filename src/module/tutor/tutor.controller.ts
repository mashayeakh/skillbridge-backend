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

    //get your profile
    getYourProfile: asyncHandler(
        async (req: Request, res: Response) => {
            res.status(200).json({
                success: true,
                message: "your profle retrieved",
                data: await TutorService.getTutorProfile()
            })
        }
    ),

    //get profile by id
    getProfileById: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;
            res.status(200).json({
                success: true,
                message: "tutor profile by id retrieved",
                data: await TutorService.getTutorProfileById(id as string)
            })
        }

    ),

    //update your profile
    updateYourProfile: asyncHandler(
        async (req: Request, res: Response) => {

            // const { } =

            res.status(200).json({
                success: true,
                message: "You profile updated",
                data: await TutorService.updateTutorProfile(req.params.id as string, req.body)
            })
        }
    )

}