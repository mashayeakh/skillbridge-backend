import { Router } from "express";
import { authMiddleware } from "../../../middleware/auth";
import { Role } from "../../../types/role";
import { TutorDashboardController } from "./dashboard.controller";


const router = Router();

router.get(
    "/",
    authMiddleware(Role.TUTOR),
    TutorDashboardController.getBasicStats
);

router.get(
    "/reviews/summary",
    authMiddleware(Role.TUTOR),
    TutorDashboardController.summary
);

router.get("/stats", authMiddleware(Role.TUTOR), TutorDashboardController.getTutorStats);


export const TutorDashboardRouter = router;
