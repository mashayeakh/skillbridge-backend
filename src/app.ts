import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import route from "./router";
import { globalError } from "./middleware/globalErrorHandler";

export const app = express();

// 1. CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4000",
    "https://skillbridgefrontend-delta.vercel.app",
    "https://skillbridgefrontend-5fzzlpwp5-mashayeakhs-projects.vercel.app",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/skillbridgefrontend.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*-mashayeakhs-projects\.vercel\.app$/.test(origin);

            if (isAllowed) {
                callback(null, true);
            } else {
                console.log(`CORS blocked origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie", "X-Requested-With"],
        exposedHeaders: ["Set-Cookie"],
    })
);

// 2. Body parser
app.use(express.json());

// 3. Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 4. Better Auth routes - Let Better Auth handle ALL auth routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// 5. Other routes
app.use("/api", route);

// 6. Root
app.get("/", (req, res) => {
    res.send("Hello Backend!");
});

// 7. Global error
app.use(globalError);