import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';
import { StudentController } from './student.controller';
import { auth } from '../../lib/auth';


const router = express.Router();

router.post("/booking", authMiddleware(Role.STUDENT), StudentController.studnentBooking);

// router.post("/session-review", authMiddleware(Role.STUDENT), StudentController.leaveReview);

router.post("/reviews", authMiddleware(Role.STUDENT), StudentController.leaveReview);

router.get("/profile", authMiddleware(Role.STUDENT), StudentController.viewOwnProfile);

router.put("/update-profile", authMiddleware(Role.STUDENT), StudentController.updateOwnProfile);

router.put("/delete-profile", authMiddleware(Role.STUDENT), StudentController.deleteOwnProfile);



export const StudentRouter = router;


