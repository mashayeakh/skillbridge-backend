import express from 'express';
import { TutorAvailabilityController } from './availability.controller';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';


const router = express.Router();


//test
// router.get("/", TutorCategoryController.getTest);

//!create
router.post("/", authMiddleware(Role.TUTOR), TutorAvailabilityController.createSlots);

//! get available slots by tutor profile id
router.get("/:id", authMiddleware(Role.TUTOR), TutorAvailabilityController.getAvailableSlots);


//!update availability slot
router.patch("/slot/:id", authMiddleware(Role.TUTOR), TutorAvailabilityController.updateAvailability
);


// router.get("/:tutorProfileId/available", TutorAvailabilityController.getAvailableSlots);



export const TutorAvailabilityRouter = router;


