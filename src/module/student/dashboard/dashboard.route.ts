import express from 'express';
import { authMiddleware } from '../../../middleware/auth';
import { StudentDashboardController } from './dashboard.controller';
import { Role } from '../../../types/role';



const router = express.Router();


//create
// router.post("/", authMiddleware(Role.TUTOR), TutorAvailabilityController.createSlots);

//dashboard summary
router.get("/", authMiddleware(Role.STUDENT), StudentDashboardController.dashboardSummary);

//upcoming bookings
router.get("/bookings/upcoming", authMiddleware(Role.STUDENT), StudentDashboardController.getUpcomingBookings 
);

//recent bookings
router.get("/bookings/recent", authMiddleware(Role.STUDENT), StudentDashboardController.recentBookings
);


export const StudentDashboardRouter = router;


