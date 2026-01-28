import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { StudentService } from './student.service';



export const StudentController = {
    //student booking
    studnentBooking: asyncHandler(
        async (req: Request, res: Response) => {
            console.log("HIT THE student controller")
            const studId = req.user?.id;

            console.log("STD", studId)

            if (!studId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            res.status(200).json({
                success: true,
                message: "booking successful",
                data: await StudentService.studentBooking(req.body, studId as string)
            })
        }
    )

}