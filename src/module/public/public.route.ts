import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router();

// Browse tutors with filters
// Example: /api/public/tutors?categoryId=xxx&minRating=4&maxPrice=50&search=math
router.get("/tutors", PublicController.browseTutors);

// Get detailed tutor profile
router.get("/tutors/:id", PublicController.getTutorDetail);

//!get all categories
router.get("/categories", PublicController.getAllCategories);


// Featured tutors for landing page
router.get("/tutors/featured", PublicController.featuredTutors);



export const PublicRouter = router;
