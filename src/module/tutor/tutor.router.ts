import express from 'express';
import { TutorController } from './tutor.controller';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';


const router = express.Router();

//test
// router.get("/", CategoriesController.getTest);

//get all
// router.get("/", TutorController.getTest);

//create
router.post("/", authMiddleware(Role.TUTOR), TutorController.createTutorProfile);


router.get("/", TutorController.getYourProfile);


router.get("/all", TutorController.getAllTutors);

router.get("/:id", TutorController.getProfileById);


router.put("/pro", authMiddleware(Role.TUTOR), TutorController.updateYourProfile);

router.post("/upgrade", authMiddleware(), TutorController.upgradeToTutor);



export const TutorRouter = router;


