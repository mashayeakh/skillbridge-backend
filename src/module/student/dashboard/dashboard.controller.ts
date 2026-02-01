import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppError } from "../../../error/appErrors";
import { prisma } from "../../../lib/prisma";
import { StudentDashboardService } from "./dashboard.service";



export const StudentDashboardController = {

    dashboardSummary: asyncHandler(async (req: Request, res: Response) => {
        // console.log("🔥 Availability Controller Hit");
        if (!req.user) {
            throw new AppError(401, "Unauthorized access: User not found",);
        }
        const studentId = req.user.id; // Make sure your auth middleware sets req.user
        const data = await StudentDashboardService.getDashboardSummary(studentId);

        console.log("DATA ----", data)

        res.status(200).json({
            success: true,
            message: "Dashboard summary retrieved",
            data: data
        });
    }),

    //upccming bookings
    getUpcomingBookings: asyncHandler(
        async (req: Request, res: Response) => {

            if (!req.user) {
                throw new AppError(401, "Unauthorized access: User not found");
            }
            const studentId = req.user.id;
            const bookings = await StudentDashboardService.getUpcomingBookings(
                studentId,
                req.query
            );
            res.status(200).json({
                success: true,
                count: bookings.length,
                message: "Upcoming bookings retrieved",
                data: bookings
            });
        }
    ),

    //recent bookings
    recentBookings: asyncHandler(
        async (req: Request, res: Response) => {

            if (!req.user) {
                throw new AppError(401, "Unauthorized access: User not found");
            }
            const studentId = req?.user.id;

            const data = await StudentDashboardService.getRecentBookings(
                studentId,
                req.query
            );
            res.status(200).json({
                success: true,
                count: data.length,
                message: "Recent bookings retrieved",
                data: data
            });

        }
    ),

    
}


