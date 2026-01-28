import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { BookingService } from './bookings.service';


export const BookingController = {
    //create Booking
    createBooking: asyncHandler(
        async (req: Request, res: Response) => {
            const payload = req.body;
            console.log("---> booking controller payload", payload)
            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: await BookingService.createBooking(payload)
            })
        }
    )
}