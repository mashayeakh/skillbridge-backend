import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppError } from "../../../error/appErrors";
import { TutorDashboardService } from "./dashboard.service";
import { getAppUserId } from "../../../helper/services/user/user.helper";

export const TutorDashboardController = {

    getBasicStats: asyncHandler(
        async (req: Request, res: Response) => {

            const userId = req?.user?.id; // This must be the correct app UUID, NOT Better Auth ID

            if (!userId) {
                throw new AppError(401, "User ID is missing or unauthorized");
            }

            const data = await TutorDashboardService.getSimpleStats(userId);

            return res.json({
                success: true,
                data,
            });
        }
    ),

    summary: asyncHandler(async (req: Request, res: Response) => {
        const tutorProfileId = req.user?.id;

        if (!tutorProfileId) {
            throw new AppError(401, "Unauthorized");
        }

        console.log("tutorProfileId", tutorProfileId)

        const data = await TutorDashboardService.getReviewSummary(tutorProfileId);

        res.status(200).json({
            success: true,
            data,
        });
    }),

    getTutorStats: asyncHandler(async (req: Request, res: Response) => {

        const userId = req.user?.id; // your auth middleware should populate req.user
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const stats = await TutorDashboardService.getTutorStats(userId);

        res.status(200).json({ success: true, data: stats });

    }),


};
