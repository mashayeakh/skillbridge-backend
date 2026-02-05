import { Request, Response } from "express";

import { AdminDashboardService } from "./dashboard.service";
import { asyncHandler } from "../../../utils/asyncHandler";

export const AdminDasbhoardController = {

    /**
     * GET /api/admin/dashboard/analytics
     * Fetch overall platform analytics for admin dashboard
     */
    getPlatformAnalytics: asyncHandler(
        async (req: Request, res: Response) => {
            const data = await AdminDashboardService.getPlatformAnalytics();

            res.status(200).json({
                success: true,
                data,
            });
        }
    ),

    /**
     * GET /api/admin/users
     * Fetch all users in the system
     */
    getUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminDashboardService.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length, // Total number of users
            data: users,
        });
    }),

    /**
     * GET /api/admin/users/verification-summary
     * Returns verification statistics (verified, pending, rejected, etc.)
     */
    verificationSummary: asyncHandler(async (req: Request, res: Response) => {
        const data = await AdminDashboardService.getVerificationSummary();

        res.status(200).json({
            success: true,
            data,
        });
    }),

    /**
     * PATCH /api/admin/users/:id/status
     * Update a user's account status (active, suspended, blocked, etc.)
     */
    updateStatus: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;     // User ID from URL
        const { status } = req.body;   // New status from request body

        const user = await AdminDashboardService.updateUserStatus(
            id as string,
            status
        );

        res.status(200).json({
            success: true,
            message: "User status updated",
            data: user,
        });
    }),

    /**
     * PATCH /api/admin/users/:id/role
     * Update a user's role (admin, tutor, student, etc.)
     */
    updateRole: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;   // User ID from URL
        const { role } = req.body;   // New role from request body

        const user = await AdminDashboardService.updateUserRole(
            id as string,
            role
        );

        res.status(200).json({
            success: true,
            message: "User role updated",
            data: user,
        });
    }),

    /**
     * GET /api/admin/users/export
     * Export all users (for CSV, Excel, or admin reports)
     */
    exportUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminDashboardService.exportUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    }),

};
