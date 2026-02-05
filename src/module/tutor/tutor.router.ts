import express from "express";
import { TutorController } from "./tutor.controller";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../types/role";

const router = express.Router();

//! update tutor profile
router.patch(
    "/profile",
    authMiddleware(Role.TUTOR),
    TutorController.createTutorProfile
);

router.get(
    "/me",
    authMiddleware(Role.TUTOR),
    TutorController.getYourProfile
);

router.get(
    "/top-tutors",
    TutorController.viewTopTutors
);

router.get(
    "/all",
    TutorController.getAllTutors
);

router.put(
    "/profile",
    authMiddleware(Role.TUTOR),
    TutorController.updateYourProfile
);

router.post(
    "/upgrade",
    authMiddleware(),
    TutorController.upgradeToTutor
);

router.get(
    "/:id",
    TutorController.getProfileById
);

export const TutorRouter = router;
