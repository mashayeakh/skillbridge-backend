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

// backend: assign category to tutor
// router.post(
//     "/tutor/category",
//     authMiddleware(Role.TUTOR),
//     AdminController.createCategory
// );


//ban
router.patch(
    "/users/:userId/ban",
    authMiddleware(Role.ADMIN),
    AdminController.banUser
);

//unban
router.patch(
    "/users/:userId/unban",
    authMiddleware(Role.ADMIN),
    AdminController.unbanUser
);

//view all bookings
router.get(
    "/bookings",
    authMiddleware(Role.ADMIN),
    AdminController.getAllBookings
);


router.get(
    "/categories", authMiddleware(Role.ADMIN),
    AdminController.getAllCategories
);


router.patch(
    "/categories/:id",
    authMiddleware(Role.ADMIN),
    AdminController.updateCategory
);

//update status
router.patch(
    "/users/:id",
    authMiddleware(Role.ADMIN),
    AdminController.updateUserStatus
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


//!user managerment routes
// router.get("/:id", authMiddleware(Role.ADMIN), AdminController.getUser);
router.get("/student/:userId", authMiddleware(Role.ADMIN), AdminController.getStudent);
router.get("/tutor/:userId", authMiddleware(Role.ADMIN), AdminController.getTutor);
// router.patch("/:id", authMiddleware(Role.ADMIN), AdminController.updateUser);
// router.patch("/:id/role", authMiddleware(Role.ADMIN), AdminController.changeUserRole);
// router.delete("/:id", authMiddleware(Role.ADMIN), AdminController.deleteUser);


export const AdminRouter = router;
