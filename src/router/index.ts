import { Router } from "express";
import { CategoriesRouter } from './../module/categories/categories.router';
import { TutorRouter } from './../module/tutor/tutor.router';
import { TutorCategoryRouter } from '../module/tutorCategory/tutorCategory.router';
import { TutorAvailabilityRouter } from './../module/tutoravailability/availability.route';
import { BookingRouter } from './../module/bookings/bookings.route';
import { StudentRouter } from "../module/student/student.route";
import { AdminRouter } from "../module/admin/admin.route";
import { PublicRouter } from "../module/public/public.route";
import { StudentDashboardRouter } from "../module/student/dashboard/dashboard.route";
import { TutorDashboardRouter } from "../module/tutor/dashboard/dashboard.route";
import { AdminDashboardRouter } from "../module/admin/dashboard/dashboard.route";
import { BlogRouter } from "../module/blog/blog.router";

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
route.use("/bookings", BookingRouter)

//student
route.use("/student", StudentRouter);

//admin
route.use("/admin", AdminRouter);

//public 
route.use("/public", PublicRouter);

//student dashboard - 
route.use("/student/dashboard", StudentDashboardRouter);

// tutor dashboard -
route.use("/tutor/dashboard/overall", TutorDashboardRouter);

//admin dashboard - 
route.use("/admin/dashboard", AdminDashboardRouter);

//blog
route.use("/blog", BlogRouter);

export default route;