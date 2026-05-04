import { asyncHandler } from './../../utils/asyncHandler';
import { Request, Response } from "express";
import { BlogService } from './blog.service';




export const BlogController = {
    //create Booking
    createBlog: asyncHandler(
        async (req: Request, res: Response) => {


            const blog = await BlogService.createBlog(req.body);

            console.log("created blog in controller", blog);

            res.status(201).json({
                success: true,
                message: "Blog created successfully",
                data: blog,
            });
        }),

        // get all blogs
        getAllBlogs: asyncHandler(async (req: Request, res: Response) => {
            const blogs = await BlogService.getAllBlogs();
            res.status(200).json({
                success: true,
                data: blogs,
            });
        }),

        // get blog by id
        getBlogById: asyncHandler(async (req: Request, res: Response) => {
            const { id } = req.params;
            const blog = await BlogService.getBlogById(id as string);
            res.status(200).json({
                success: true,
                data: blog,
            });
        }),

        // update blog
        updateBlog: asyncHandler(async (req: Request, res: Response) => {
            const { id } = req.params;
            const blog = await BlogService.updateBlog(id as string, req.body);
            res.status(200).json({
                success: true,
                data: blog,
            });
        }),

        // delete blog
        deleteBlog: asyncHandler(async (req: Request, res: Response) => {
            const { id } = req.params;
            const blog = await BlogService.deleteBlog(id as string);
            res.status(200).json({
                success: true,
                data: blog,
            });
        })


}