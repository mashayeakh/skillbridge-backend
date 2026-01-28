import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { StudentService } from './student.service';
import { success } from 'better-auth/*';



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
    ),

    leaveReview: asyncHandler(
        async (req: Request, res: Response) => {
            const studentId = req.user?.id;
            if (!studentId) throw new Error("Unauthorized");

            const { bookingId, rating, comment } = req.body;

            const data = {
                bookingId,
                rating,
                comment
            }

            const review = await StudentService.leaveReview(studentId, data);
            res.status(201).json({
                success: true,
                message: "Review submitted successfully",
                data: review
            });
        }
    ),

    viewOwnProfile: asyncHandler(
        async (req: Request, res: Response) => {
            const studenId = req.user?.id;

            console.log("STD", studenId)

            if (!studenId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            res.status(200).json({
                success: true,
                message: "student profile fetched successfully",
                data: await StudentService.getOwnProfile(studenId as string)
            })
        }
    ),

    updateOwnProfile: asyncHandler(
        async (req: Request, res: Response) => {
            const studenId = req.user?.id;

            console.log("STD", studenId)

            if (!studenId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            res.status(200).json({
                success: true,
                message: "student profile updated successfully",
                data: await StudentService.updateOwnProfile(studenId as string, req.body)
            })
        }
    ),

    deleteOwnProfile: asyncHandler(
        async (req: Request, res: Response) => {
            const studenId = req.user?.id;

            console.log("STD", studenId)

            if (!studenId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            res.status(200).json({
                success: true,
                message: "student profile deleted successfully",
                data: await StudentService.deleteOwnProfile(studenId as string)
            })
        }
    ),


}