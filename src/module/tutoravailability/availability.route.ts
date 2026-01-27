import express from 'express';
import { TutorAvailabilityController } from './availability.controller';


const router = express.Router();


//test
// router.get("/", TutorCategoryController.getTest);

//create
router.post("/", TutorAvailabilityController.createSlots);

router.get("/:tutorProfileId/available", TutorAvailabilityController.getAvailableSlots);



export const TutorAvailabilityRouter = router;


