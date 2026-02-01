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

//pending reviews
router.get("/bookings/pending-reviews",
    authMiddleware(Role.STUDENT), StudentDashboardController.pendingReviews
);

//learning progress
router.get("/analytics/progress", authMiddleware(Role.STUDENT), StudentDashboardController.learningProgress
);

//financial summary
router.get(
    "/financial/summary",
    authMiddleware(Role.STUDENT),
    StudentDashboardController.financialSummary
);


//bookings stats
router.get(
    "/analytics/booking-stats",
    authMiddleware(Role.STUDENT),
    StudentDashboardController.bookingStats
);


//quick stats
router.get(
    "/quick-actions",
    authMiddleware(Role.STUDENT),
    StudentDashboardController.quickActions
);


//search & Filter bookings
router.get(
    "/bookings/search",
    authMiddleware(Role.STUDENT),
    StudentDashboardController.searchBookings
);


router.get(
    "/bookings/export",
    authMiddleware(Role.STUDENT),
    StudentDashboardController.exportBookings
);




export const StudentDashboardRouter = router;


