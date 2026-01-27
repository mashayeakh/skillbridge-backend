import express from 'express';
import { TutorController } from './tutor.controller';


const router = express.Router();

//test
// router.get("/", CategoriesController.getTest);

//get all
// router.get("/", TutorController.getTest);

//create
router.post("/", TutorController.createCategory);






export const TutorRouter = router;


