import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { StudentService } from './student.service';
import { success } from 'better-auth/*';
import { BookingService } from '../bookings/bookings.service';
import { AppError } from '../../error/appErrors';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';



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

    //session /api/auth/session", 
    sessionStd: asyncHandler(async (req: Request, res: Response) => {
        const session = await auth.api.getSession({ headers: req.headers });

        if (!session) {
            return res.status(200).json(null);
        }

        const userId = session.user.id;
        const role = session.user.role;

        let bookings: any[] = [];
        let upcomingSessions: any[] = [];
        let totalBookings = 0;
        let upcomingCount = 0;

        // =======================
        // STUDENT
        // =======================
        if (role === "STUDENT") {
            bookings = await prisma.booking.findMany({
                where: { studentId: userId },
                include: {
                    tutorProfile: {
                        select: {
                            id: true,
                            name: true,
                            bio: true,
                            hourlyRate: true,
                            rating: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            });

            upcomingSessions = await prisma.booking.findMany({
                where: {
                    studentId: userId,
                    status: "CONFIRMED",
                    OR: [
                        { startTime: { gte: new Date() } },
                        { startTime: null },
                    ],
                },
                include: {
                    tutorProfile: {
                        select: { id: true, name: true },
                    },
                },
                orderBy: { startTime: "asc" },
                take: 3,
            });

            totalBookings = await prisma.booking.count({
                where: { studentId: userId },
            });

            upcomingCount = await prisma.booking.count({
                where: {
                    studentId: userId,
                    status: "CONFIRMED",
                    OR: [
                        { startTime: { gte: new Date() } },
                        { startTime: null },
                    ],
                },
            });
        }

        // =======================
        // TUTOR
        // =======================
        if (role === "TUTOR") {
            const tutorProfile = await prisma.tutorProfile.findFirst({
                where: { userId },
            });

            if (tutorProfile) {
                bookings = await prisma.booking.findMany({
                    where: { tutorProfileId: tutorProfile.id },
                    include: {
                        student: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                phone: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                });

                upcomingSessions = await prisma.booking.findMany({
                    where: {
                        tutorProfileId: tutorProfile.id,
                        status: "CONFIRMED",
                        OR: [
                            { startTime: { gte: new Date() } },
                            { startTime: null },
                        ],
                    },
                    include: {
                        student: {
                            select: { id: true, name: true },
                        },
                    },
                    orderBy: { startTime: "asc" },
                    take: 3,
                });

                totalBookings = await prisma.booking.count({
                    where: { tutorProfileId: tutorProfile.id },
                });

                upcomingCount = await prisma.booking.count({
                    where: {
                        tutorProfileId: tutorProfile.id,
                        status: "CONFIRMED",
                        OR: [
                            { startTime: { gte: new Date() } },
                            { startTime: null },
                        ],
                    },
                });
            }
        }

        // =======================
        // FORMAT BOOKINGS
        // =======================
        const formattedBookings = bookings.map((booking) => ({
            id: booking.id,
            status: booking.status,
            price: booking.price,
            startTime: booking.startTime,
            endTime: booking.endTime,
            createdAt: booking.createdAt,
            ...(role === "STUDENT"
                ? {
                    tutor: booking.tutorProfile
                        ? {
                            id: booking.tutorProfile.id,
                            name: booking.tutorProfile.name,
                            subject: booking.tutorProfile.bio
                                ? booking.tutorProfile.bio
                                    .split(" ")
                                    .slice(0, 3)
                                    .join(" ") + "..."
                                : "N/A",
                            rate: booking.tutorProfile.hourlyRate,
                        }
                        : null,
                }
                : {
                    student: booking.student
                        ? {
                            id: booking.student.id,
                            name: booking.student.name,
                            email: booking.student.email,
                            phone: booking.student.phone,
                        }
                        : null,
                }),
        }));

        const formattedUpcoming = upcomingSessions.map((b) => ({
            id: b.id,
            startTime: b.startTime,
            endTime: b.endTime,
            status: b.status,
            ...(role === "STUDENT"
                ? { tutorName: b.tutorProfile?.name }
                : { studentName: b.student?.name }),
        }));

        const enhancedSession = {
            ...session,
            stats: {
                totalBookings,
                upcomingCount,
                completedCount: totalBookings - upcomingCount,
                totalEarned: bookings.reduce(
                    (sum, b) => sum + (b.price || 0),
                    0
                ),
            },
            recentBookings: formattedBookings,
            upcomingSessions: formattedUpcoming,
            user: {
                ...session.user,
                joinedDate: session.user.createdAt
                    ? new Date(session.user.createdAt).toLocaleDateString()
                    : "N/A",
            },
        };

        return res.status(200).json(enhancedSession);
    })


}