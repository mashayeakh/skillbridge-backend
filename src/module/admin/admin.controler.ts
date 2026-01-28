import { asyncHandler } from "../../utils/asyncHandler";
import { AdminService } from "./admin.service";
import { Request } from 'express';
import { Response } from 'express';

export const AdminController = {
    viewAllUsers: asyncHandler(async (req: Request, res: Response) => {
        const users = await AdminService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "All users retrieved successfully",
            data: users
        });
    })
};
