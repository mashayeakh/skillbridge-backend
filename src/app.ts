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
    "https://skillbridgefrontend-delta.vercel.app",
    "https://skillbridgefrontend-5fzzlpwp5-mashayeakhs-projects.vercel.app", // Add your current frontend
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin
            if (!origin) return callback(null, true);

            // Check if origin matches ANY Vercel URL pattern
            const isAllowed =
                allowedOrigins.includes(origin) ||
                /^https:\/\/skillbridgefrontend.*\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*-mashayeakhs-projects\.vercel\.app$/.test(origin) ||
                /^https:\/\/.*\.vercel\.app$/.test(origin); // Allow ANY Vercel app for testing

            if (isAllowed) {
                callback(null, true);
            } else {
                console.log(`CORS allowed origin: ${origin}`);
                callback(null, true);
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

// 4. Explicit session route FIRST
app.get("/api/auth/session", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return res.status(200).json(null);
        return res.status(200).json(session);
    } catch (err) {
        console.error("Session error:", err);
        return res.status(500).json({ error: "Failed to get session" });
    }
});

// 5. Better Auth wildcard AFTER session
app.all("/api/auth/*", toNodeHandler(auth));

// 6. Other routes
app.use("/api", route);

// 7. Root
app.get("/", (req, res) => {
    res.send("Hello Backend!");
});

// 8. Global error
app.use(globalError);