import express from 'express';
import { authMiddleware } from '../../middleware/auth';
import { Role } from '../../types/role';
import { StudentController } from './student.controller';


const router = express.Router();

router.post("/booking", authMiddleware(Role.STUDENT), StudentController.studnentBooking);


export const StudentRouter = router;


