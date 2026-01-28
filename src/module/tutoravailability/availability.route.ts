import express from 'express';
import { TutorAvailabilityController } from './availability.controller';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';


const router = express.Router();


//test
// router.get("/", TutorCategoryController.getTest);

//create
router.post("/", authMiddleware(Role.TUTOR), TutorAvailabilityController.createSlots);

// router.get("/:tutorProfileId/available", TutorAvailabilityController.getAvailableSlots);



export const TutorAvailabilityRouter = router;


