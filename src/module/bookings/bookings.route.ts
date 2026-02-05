import express from "express";
import { BookingController } from "./bookings.controller";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../types/role";
import { auth } from "../../lib/auth";

const router = express.Router();

//!create
router.post(
    "/",
    authMiddleware(Role.STUDENT),
    BookingController.createBooking
);

//!my bookings
router.get(
    "/my-bookings",
    authMiddleware(Role.STUDENT),
    BookingController.getMyBookings
);

//!get booking details by id
router.get(
    "/:id",
    authMiddleware(Role.STUDENT),
    BookingController.getBookingById
);

// all bookings
router.get(
    "/",
    authMiddleware(Role.STUDENT),
    BookingController.getAllBookings
);

//bookings by student id
router.get(
    "/student/:studentId",
    BookingController.getBookingsByStudentId
);

//bookings by tutor profile id
router.get(
    "/tutor/:tutorProfileId",
    BookingController.getBookingsByTutorProfileId
);

//upcoming bookings
router.get(
    "/upcoming",
    BookingController.getUpcomingBookings
);

export const BookingRouter = router;
