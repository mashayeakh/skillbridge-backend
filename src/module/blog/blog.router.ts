import express from "express";
import { authMiddleware } from "../../middleware/auth";
import { Role } from "../../types/role";
import { auth } from "../../lib/auth";
import { BlogController } from "./blog.controller";

const router = express.Router();

//!create
router.post(
    "/",
    // authMiddleware(Role.ADMIN),
    BlogController.createBlog
);

// get all blogs
router.get(
    "/",
    BlogController.getAllBlogs
);

// get blog by id
router.get(
    "/:id",
    BlogController.getBlogById
);

// update blog
router.patch(
    "/:id",
    // authMiddleware(Role.ADMIN),
    BlogController.updateBlog
);

// delete blog
router.delete(
    "/:id",
    // authMiddleware(Role.ADMIN),
    BlogController.deleteBlog
);



export const BlogRouter = router;
