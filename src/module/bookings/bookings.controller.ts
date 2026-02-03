import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { BookingService, createBookingSchema } from './bookings.service';
import { BookingStatus } from '../../../prisma/generated/prisma/enums';
import { z } from "zod";
import { AppError } from '../../error/appErrors';




export const BookingController = {
    //create Booking
    createBooking: asyncHandler(
        async (req: Request, res: Response) => {
            // validate body
            const body = createBookingSchema.parse(req.body);

            const payload = {
                ...body,
                startTime: new Date(body.startTime),
                endTime: new Date(body.endTime),
            };

            const booking = await BookingService.createBooking(payload);

            res.status(201).json({
                success: true,
                message: "Booking created successfully",
                data: booking,
            });
        }),

        //!Get std bookings
    getMyBookings: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user?.id) {
            throw new AppError(401, "Unauthorized");
        }

        const bookings = await BookingService.getStudentBookings(req.user.id);

        res.status(200).json({
            success: true,
            message: "Student bookings retrieved successfully",
            data: bookings,
        });
    }),

    //get all bookings
    getAllBookings: asyncHandler(
        async (req: Request, res: Response) => {
            const bookings = await BookingService.getAllBookings();

            res.status(200).json({
                success: true,
                data: bookings,
            });
        }
    ),

    //by id
    getBookingById: asyncHandler(
        async (req: Request, res: Response) => {
            const { id } = req.params;

            const booking = await BookingService.getBookingById(id as string);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: "Booking not found",
                });
            }

            res.status(200).json({
                success: true,
                data: booking,
            });
        }
    ),

    //by student id
    getBookingsByStudentId: asyncHandler(
        async (req: Request, res: Response) => {
            const { studentId } = req.params;
            const bookings = await BookingService.getBookingsByStudent(studentId as string);

            res.status(200).json({
                success: true,
                data: await BookingService.getBookingsByStudent(studentId as string)
            });
        }
    ),

    //by tutor profile id
    getBookingsByTutorProfileId: asyncHandler(
        async (req: Request, res: Response) => {
            const { tutorProfileId } = req.params;
            const bookings = await BookingService.getBookingsByTutorProfile(tutorProfileId as string);
            res.status(200).json({
                success: true,
                data: bookings
            });
        }
    ),

    //by tutor profile id
    getUpcomingBookings: asyncHandler(
        async (req: Request, res: Response) => {
            // const date = new Date();
            const upcomingBookings = await BookingService.getUpcomingBookings();
            res.status(200).json({
                success: true,
                data: upcomingBookings
            });
        }
    ),

}