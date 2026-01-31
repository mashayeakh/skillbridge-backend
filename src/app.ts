import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import route from "./router";
import { globalError } from "./middleware/globalErrorHandler";

export const app = express();

// 1. CORS
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

// 2. Body parser
app.use(express.json());

// 3. Explicit session route FIRST
app.get("/api/auth/session", async (req, res) => {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return res.status(200).json(null);
        return res.status(200).json(session);
    } catch (err) {
        return res.status(500).json({ error: "Failed to get session" });
    } 
});


// 3. Explicit session route FIRST
// app.get("/api/auth/session", async (req, res) => {
//     try {
//         const session = await auth.api.getSession({ headers: req.headers });
//         if (!session) return res.status(200).json(null);

//         // fetch actual user object using session.userId
//         const user = await prisma.user.findUnique({ where: { id: session.session.userId } });

//         return res.status(200).json({ user, token: session.session.token });
//     } catch (err) {
//         return res.status(500).json({ error: "Failed to get session" });
//     }
// });

// 4. Better Auth wildcard AFTER session
app.all("/api/auth/*splat", toNodeHandler(auth));

// 5. Other routes
app.use("/api", route);

// 6. Root
app.get("/", (req, res) => {
    res.send("Hello Backend!");
});

// 7. Global error
app.use(globalError);

