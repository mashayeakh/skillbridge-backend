import express from 'express';
import { BookingController } from './bookings.controller';


const router = express.Router();

//test
// router.get("/", CategoriesController.getTest);

//get all
// router.get("/", TutorController.getTest);

//create
router.post("/", BookingController.createBooking);


export const BookingRouter = router;


