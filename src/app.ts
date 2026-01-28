import express from "express";
import { prisma } from "./lib/prisma"; // make sure this exists
import cors from "cors";
import { CategoriesRouter } from './module/categories/categories.router';
import route from './router/index';
import { globalError } from './middleware/globalErrorHandler';
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth';


export const app = express();

app.all("/api/auth/*splat", toNodeHandler(auth));




// Middleware
app.use(express.json());

//cors
app.use(cors({
    //set origin
    origin: process.env.APP_URL || "http://localhost:4000",// client side url
    credentials: true,
}))

// Root route
app.get("/", (req, res) => {
    res.send("Hello Backend!");
});


app.use("/api", route);

//global err handler
app.use(globalError)
