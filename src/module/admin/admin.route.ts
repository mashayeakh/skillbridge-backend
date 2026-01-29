import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../types/role";
import { AdminController } from "./admin.controller";

const router = express.Router();

router.get(
    "/users",
    authMiddleware(Role.ADMIN),
    AdminController.viewAllUsers
);

router.post(
    "/categories",
    authMiddleware(Role.ADMIN),
    AdminController.createCategory
);

router.get(
    "/categories",
    authMiddleware(Role.ADMIN),
    AdminController.getAllCategories
);

router.patch(
    "/categories/:id",
    authMiddleware(Role.ADMIN),
    AdminController.updateCategory
);

router.patch(
    "/categories/:id/deactivate",
    authMiddleware(Role.ADMIN),
    AdminController.deactivateCategory
);

router.delete(
    "/categories/:id",
    authMiddleware(Role.ADMIN),
    AdminController.deleteCategory
);




export const AdminRouter = router;
