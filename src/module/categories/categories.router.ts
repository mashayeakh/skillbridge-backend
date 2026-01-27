import express from 'express';
import { CategoriesController } from './categories.controller';


const router = express.Router();

//test
// router.get("/", CategoriesController.getTest);

//get all
router.get("/", CategoriesController.getAllCategories);

//create
router.post("/", CategoriesController.createCategory);






export const CategoriesRouter = router;


