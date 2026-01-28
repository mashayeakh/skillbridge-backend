import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../types/role";
import { AdminController } from "./admin.controler";

const router = express.Router();

router.get("/users", authMiddleware(Role.ADMIN), AdminController.viewAllUsers);

export const AdminRouter = router;
