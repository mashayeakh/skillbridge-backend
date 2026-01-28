import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { TutorService } from './tutor.service';
import { prisma } from '../../lib/prisma';
import { Role } from '../../types/role';


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
    createTutorProfile: asyncHandler(
        async (req: Request, res: Response) => {
            const userId = req.user?.id;

            // 1️⃣ Check if token is present
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized❌" });
            }

            // 2️⃣ Check role
            if (req.user?.role !== Role.TUTOR) {
                return res.status(403).json({ success: false, message: "Forbidden: you must be a tutor" });
            }

            const payload = req.body;
            const completePayload = { ...payload, userId };

            try {
                const createdProfile = await TutorService.createTutorProfile(completePayload);

                res.status(201).json({
                    success: true,
                    message: "Tutor profile created successfully",
                    data: createdProfile
                });
            } catch (error: any) {
                // Catch unique constraint / custom AppError
                res.status(400).json({
                    success: false,
                    message: error.message || "Could not create profile",
                    requestInfo: {
                        method: req.method,
                        path: req.originalUrl,
                        time: new Date().toLocaleString()
                    }
                });
            }
        }
    )

    ,

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
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized❌" });
            }

            // Find the tutor profile of the logged-in tutor
            const tutorProfile = await prisma.tutorProfile.findUnique({
                where: { userId },
                include: { categories: true }
            });

            if (!tutorProfile) {
                return res.status(404).json({ success: false, message: "Tutor profile not found" });
            }

            // Call service with tutorProfile.id
            const updatedProfile = await TutorService.updateProfile({
                tutorProfileId: tutorProfile.id,
                ...req.body
            });

            res.status(200).json({
                success: true,
                message: "Your profile updated successfully",
                data: updatedProfile
            });
        }
    ),


    getAllTutors: asyncHandler(
        async (req: Request, res: Response) => {
            res.status(200).json({
                success: true,
                message: "All tutors retrieved",
                data: await TutorService.getAllTutors()
            })
        }
    ),

    upgradeToTutor: asyncHandler(
        async (req: Request, res: Response) => {

            const id = req.user?.id;
            console.log("---id ", id)

            if (!id) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const result = await TutorService.upgradeToTutor(id);

            res.status(200).json({
                success: true,
                message: "User upgraded to tutor",
                data: result
            }
            )
        }
    )
}