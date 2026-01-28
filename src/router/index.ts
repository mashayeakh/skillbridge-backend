import { Router } from "express";
import { CategoriesRouter } from './../module/categories/categories.router';
import { TutorRouter } from './../module/tutor/tutor.router';
import { TutorCategoryRouter } from '../module/tutorCategory/tutorCategory.router';
import { TutorAvailabilityRouter } from './../module/tutoravailability/availability.route';
import { BookingRouter } from './../module/bookings/bookings.route';

const route = Router();

//category
route.use("/category", CategoriesRouter);

//tutor
route.use("/tutor", TutorRouter);

//turtor Category 
route.use("/tutor-category", TutorCategoryRouter);

//tutor avalibality 
route.use("/tutor-availability", TutorAvailabilityRouter);

//booking
route.use("/booking", BookingRouter)


export default route;