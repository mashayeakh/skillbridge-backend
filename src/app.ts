import express from "express";
import { prisma } from "./lib/prisma"; // make sure this exists

export const app = express();

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
    res.send("Hello Backend!");
});

// TEMP: Test Prisma insert
app.post("/test-prisma", async (req, res) => {
    try {
        const tutor = await prisma.tutorProfile.create({
            data: {
                bio: "I am a test tutor",
                hourlyRate: "20/hr",
                experienceYears: 3,
                userId: "test-user-123",
                categoryId: "test-category-123"
            }
        });

        res.json({
            success: true,
            data: tutor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Prisma insert failed" });
    }
});
