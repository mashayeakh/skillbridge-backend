import express from 'express';
import { TutorController } from './tutor.controller';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';


const router = express.Router();

//test
// router.get("/", CategoriesController.getTest);

//get all
// router.get("/", TutorController.getTest);
router.post("/", authMiddleware(Role.TUTOR), TutorController.createTutorProfile);

router.get("/me", authMiddleware(Role.TUTOR), TutorController.getYourProfile);

router.get("/top-tutors", TutorController.viewTopTutors);

router.get("/all", TutorController.getAllTutors);

router.put("/pro", authMiddleware(Role.TUTOR), TutorController.updateYourProfile);

router.post("/upgrade", authMiddleware(), TutorController.upgradeToTutor);

// ⚠️ ALWAYS LAST
router.get("/profile/:id", TutorController.getProfileById);




export const TutorRouter = router;


