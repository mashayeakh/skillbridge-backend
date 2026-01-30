import express from 'express';
import { BookingController } from './bookings.controller';


const router = express.Router();

//create
router.post("/", BookingController.createBooking);

// all bookings
router.get("/", BookingController.getAllBookings);

//bookings by id
router.get("/:id", BookingController.getBookingById);

//bookings by student id
router.get("/student/:studentId", BookingController.getBookingsByStudentId);

//bookings by tutor profile id
router.get("/tutor/:tutorProfileId", BookingController.getBookingsByTutorProfileId);

//upcoming bookings
router.get("/upcoming", BookingController.getUpcomingBookings);


export const BookingRouter = router;


