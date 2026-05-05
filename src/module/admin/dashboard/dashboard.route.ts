import { Router } from "express";

import { authMiddleware } from "../../../middleware/auth";
import { AdminDasbhoardController } from "./dashboard.controller";
import { Role } from "../../../types/role";

const router = Router();

router.get(
    "/",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getPlatformAnalytics
);

router.get(
    "/users",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getUsers
);

router.get(
    "/verification-summary",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.verificationSummary
);

router.patch(
    "/:id/status",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.updateStatus
);

router.patch(
    "/:id/role",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.updateRole
);

router.get(
    "/export",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.exportUsers
);

router.get(
    "/revenue-stats",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getRevenueStats
);

router.get(
    "/growth-stats",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getGrowthStats
);

router.get(
    "/category-stats",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getCategoryStats
);

router.get(
    "/verification-requests",
    authMiddleware(Role.ADMIN),
    AdminDasbhoardController.getVerificationRequests
);

export const AdminDashboardRouter = router;
