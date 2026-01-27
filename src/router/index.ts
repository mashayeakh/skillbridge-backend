import { Router } from "express";
import { CategoriesRouter } from './../module/categories/categories.router';
import { TutorRouter } from './../module/tutor/tutor.router';

const route = Router();

//category
route.use("/category", CategoriesRouter);

//tutor
route.use("/tutor", TutorRouter);


export default route;