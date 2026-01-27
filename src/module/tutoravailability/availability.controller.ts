import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response } from "express";
import { TutorAvailabilitySevice } from './availability.service';
import { AppError } from '../../error/appErrors';


export const TutorAvailabilityController = {

    createSlots: asyncHandler(
        async (req: Request, res: Response) => {

            console.log("🔥 AVAILABILITY CONTROLLER HIT");


            const { tutorProfileId, startTime, endTime } = req.body;

            if (!tutorProfileId || !startTime || !endTime) {
                throw new AppError(400, "Missing required fields");
            }
            const data = {
                tutorProfileId: tutorProfileId,
                startTime: new Date(startTime),
                endTime: new Date(endTime)
            }

            console.log("DATA ", data)

            console.log(typeof startTime, typeof endTime);


            res.status(200).json({
                success: true,
                data: await TutorAvailabilitySevice.createAvaility(data)
            })
        }
    ),
    //get tutor availability
    getAvailableSlots: asyncHandler(
        async (req: Request, res: Response) => {
            const slots = await TutorAvailabilitySevice.getAvailableSlots(req.params.tutorProfileId as string);

            res.status(200).json({
                success: true,
                data: slots
            })
        }
    )

}