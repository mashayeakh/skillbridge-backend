import { Router } from "express";
import { CategoriesRouter } from './../module/categories/categories.router';

const route = Router();

//test
route.use("/category", CategoriesRouter);


export default route;