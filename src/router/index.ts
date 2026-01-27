import { Router } from "express";
import { CategoriesRouter } from './../module/categories/categories.router';

const route = Router();

//test
route.use("/test", CategoriesRouter);


export default route;