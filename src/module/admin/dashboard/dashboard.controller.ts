import { Request, Response } from "express";
import { AdminDashboardService } from "./dashboard.service";
import { asyncHandler } from "../../../utils/asyncHandler";

export const AdminDasbhoardController = {

    getPlatformAnalytics: asyncHandler(
        async (req: Request, res: Response) => {
            const data = await AdminDashboardService.getPlatformAnalytics();
            res.status(200).json({
                success: true,
                data,
            });
        }
    ),

    getUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminDashboardService.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    }),

    // GET /api/admin/users/verification-summary
    verificationSummary: asyncHandler(async (req: Request, res: Response) => {
        const data = await AdminDashboardService.getVerificationSummary();

        res.status(200).json({
            success: true,
            data,
        });
    }),

    // PATCH /api/admin/users/:id/status
    updateStatus: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { status } = req.body;

        const user = await AdminDashboardService.updateUserStatus(id as string, status);

        res.status(200).json({
            success: true,
            message: "User status updated",
            data: user,
        });
    }),

    // PATCH /api/admin/users/:id/role
    updateRole: asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const { role } = req.body;

        const user = await AdminDashboardService.updateUserRole(id as string, role);

        res.status(200).json({
            success: true,
            message: "User role updated",
            data: user,
        });
    }),

    // GET /api/admin/users/export
    exportUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminDashboardService.exportUsers();

        res.status(200).json({
            success: true,
            data: users,
        });
    }),


};
