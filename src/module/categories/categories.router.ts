import express from 'express';
import { CategoriesController } from './categories.controller';


const router = express.Router();

router.get("/", CategoriesController.getTest);

export const CategoriesRouter = router;


