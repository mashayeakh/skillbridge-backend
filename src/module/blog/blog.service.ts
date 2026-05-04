import { prisma } from "../../lib/prisma";
import { IBlog } from "./blogsDto";

export const BlogService = {

    //create blogs
    async createBlog(payload: IBlog) {
        const data = {
            title: payload.title,
            excerpt: payload.excerpt,
            category: payload.category,
            description: payload.description,
            author: payload.author,
            date: new Date(payload.date),
            readTime: payload.readTime,
            image: payload.image,
        }

        // create blog
        const result = await prisma.blog.create({
            data: data,
        })

        console.log("created blog", result);


        return result
    },

    // get all blogs
    async getAllBlogs() {
        return await prisma.blog.findMany();
    },

    // get blog by id
    async getBlogById(id: string) {
        return await prisma.blog.findUnique({
            where: { id },
        });
    },

    // update blog
    async updateBlog(id: string, payload: IBlog) {
        return await prisma.blog.update({
            where: { id },
            data: payload,
        });
    },

    // delete blog
    async deleteBlog(id: string) {
        return await prisma.blog.delete({
            where: { id },
        });
    }

} 