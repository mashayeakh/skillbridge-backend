import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppError } from "../../../error/appErrors";
import { prisma } from "../../../lib/prisma";
import { StudentDashboardService } from "./dashboard.service";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";




export const StudentDashboardController = {

    dashboardSummary: asyncHandler(async (req: Request, res: Response) => {
        // console.log("🔥 Availability Controller Hit");
        if (!req.user) {
            throw new AppError(401, "Unauthorized access: User not found",);
        }
        const studentId = req.user.id; // Make sure your auth middleware sets req.user
        const data = await StudentDashboardService.getDashboardSummary(studentId);

        console.log("DATA ----", data)

        res.status(200).json({
            success: true,
            message: "Dashboard summary retrieved",
            data: data
        });
    }),

    //upccming bookings
    getUpcomingBookings: asyncHandler(
        async (req: Request, res: Response) => {

            if (!req.user) {
                throw new AppError(401, "Unauthorized access: User not found");
            }
            const studentId = req.user.id;
            const bookings = await StudentDashboardService.getUpcomingBookings(
                studentId,
                req.query
            );
            res.status(200).json({
                success: true,
                count: bookings.length,
                message: "Upcoming bookings retrieved",
                data: bookings
            });
        }
    ),

    //recent bookings
    recentBookings: asyncHandler(
        async (req: Request, res: Response) => {

            if (!req.user) {
                throw new AppError(401, "Unauthorized access: User not found");
            }
            const studentId = req?.user.id;

            const data = await StudentDashboardService.getRecentBookings(
                studentId,
                req.query
            );
            res.status(200).json({
                success: true,
                count: data.length,
                message: "Recent bookings retrieved",
                data: data
            });
        }
    ),

    //pending Reviews
    pendingReviews: asyncHandler(
        async (req: Request, res: Response) => {

            if (!req.user) {
                throw new AppError(401, "Unauthorized access: User not found");
            }

            const studentId = req?.user.id;

            const data = await StudentDashboardService.getPendingReviews(studentId);
            res.status(200).json({
                success: true,
                count: data.length,
                message: "Pending reviews retrieved",
                data: data
            });
        }
    ),

    //learning progress
    learningProgress: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(401, "Unauthorized");
        }

        const data = await StudentDashboardService.getLearningProgress(req.user.id);

        res.status(200).json({
            success: true,
            message: "Learning progress retrieved",
            data,
        });
    }),

    //financial summary
    financialSummary: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(401, "Unauthorized");
        }

        const data = await StudentDashboardService.getFinancialSummary(req.user.id);

        res.status(200).json({
            success: true,
            message: "Financial summary retrieved",
            data,
        });
    }),

    //booking stats
    bookingStats: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) throw new AppError(401, "Unauthorized");

        const data = await StudentDashboardService.getBookingStats(req.user.id);

        res.status(200).json({
            success: true,
            message: "Booking statistics retrieved",
            data,
        });
    }),

    //quick stats
    quickActions: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) throw new AppError(401, "Unauthorized");

        const data = await StudentDashboardService.getQuickActions(req.user.id);

        res.status(200).json({
            success: true,
            message: "Quick actions retrieved",
            data,
        });
    }),

    //search & Filter bookings
    searchBookings: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) throw new AppError(401, "Unauthorized");

        const data = await StudentDashboardService.searchBookings(
            req.user.id,
            req.query
        );

        res.status(200).json({
            success: true,
            count: data.length,
            data,
        });
    }),

    //export bookings
    exportBookings: asyncHandler(async (req: Request, res: Response) => {
        if (!req.user) {
            throw new AppError(401, "Unauthorized");
        }

        const { format = "csv", dateFrom, dateTo } = req.query as any;

        const bookings = await StudentDashboardService.getBookingsForExport(
            req.user.id,
            { dateFrom, dateTo }
        );

        if (!bookings.length) {
            throw new AppError(404, "No bookings found");
        }

        // ================= CSV =================
        if (format === "csv") {
            const fields = [
                "id",
                "status",
                "price",
                "startTime",
                "endTime",
                "tutor",
                "subject",
            ];

            const data = bookings.map(b => ({
                id: b.id,
                status: b.status,
                price: b.price,
                startTime: b.startTime,
                endTime: b.endTime,
                tutor: b.tutorProfile.user.name,
                subject: b.tutorProfile.categories,
            }));

            const parser = new Parser({ fields });
            const csv = parser.parse(data);

            res.header("Content-Type", "text/csv");
            res.attachment("bookings.csv");
            return res.send(csv);
        }

        // ================= PDF =================
        if (format === "pdf") {
            const doc = new PDFDocument({ margin: 40 });
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=bookings.pdf"
            );

            doc.pipe(res);

            doc.fontSize(18).text("Booking History", { align: "center" });
            doc.moveDown();

            bookings.forEach((b, i) => {
                doc
                    .fontSize(12)
                    .text(`${i + 1}. Tutor: ${b.tutorProfile.user.name}`)
                    .text(`   Subject: ${b.tutorProfile.categories}`)
                    .text(`   Status: ${b.status}`)
                    .text(`   Price: $${b.price}`)
                    .text(`   Time: ${b.startTime?.toISOString() || "N/A"} → ${b.endTime?.toISOString() || "N/A"}`)
                    .moveDown();
            });

            doc.end();
            return;
        }

        throw new AppError(400, "Invalid export format");
    }
    )

};




