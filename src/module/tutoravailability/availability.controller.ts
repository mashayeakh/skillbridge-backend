import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response } from "express";
import { TutorAvailabilitySevice } from './availability.service';
import { AppError } from '../../error/appErrors';
import { prisma } from '../../lib/prisma';


export const TutorAvailabilityController = {


    //!create avalability slots
    createSlots: asyncHandler(async (req: Request, res: Response) => {
        console.log("🔥 Availability Controller Hit");

        const userId = req.user?.id;
        if (!userId) throw new AppError(401, "Unauthorized❌");

        // Get tutor profile for logged-in user
        const tutorProfile = await prisma.tutorProfile.findUnique({
            where: { userId }
        });
        if (!tutorProfile) throw new AppError(404, "Tutor profile not found");

        const { startTime, endTime } = req.body;
        if (!startTime || !endTime) {
            throw new AppError(400, "Missing required fields");
        }

        const data = {
            tutorProfileId: tutorProfile.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        };

        const created = await TutorAvailabilitySevice.createAvailability(data);

        res.status(201).json({
            success: true,
            message: "Availability slot created",
            data: created
        });
    }),

    //!get tutor available slots
    getAvailableSlots: asyncHandler(
        async (req: Request, res: Response) => {
            const slots = await TutorAvailabilitySevice.getAvailableSlots(req.params.tutorProfileId as string);

            res.status(200).json({
                success: true,
                data: slots
            })
        }
    ),

    //update availability
    updateAvailability: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { isBooked } = req.body;

        if (typeof isBooked !== "boolean") {
            throw new AppError(400, "isBooked must be boolean");
        }

        const updatedSlot =
            await TutorAvailabilitySevice.updateAvailabilitySlot(
                id as string,
                isBooked,
                req.user!.id
            );

        res.status(200).json({
            success: true,
            message: "Availability slot updated successfully",
            data: updatedSlot,
        });
    }),
}