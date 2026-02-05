import express from "express";
import { TutorCategoryController } from "./tutorCategory.controller";

const router = express.Router();

//test
router.get(
    "/",
    TutorCategoryController.getTest
);

//create
router.post(
    "/",
    TutorCategoryController.createCategory
);

export const TutorCategoryRouter = router;
