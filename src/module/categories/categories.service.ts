import { prisma } from "../../lib/prisma";
import { CategoryCreatePayload, CategoryTypes } from "../../types/category";

export const CategoriesService = {
    //test 
    async test() {
        return "Categories Service is working!!"
    },

    // async createCategory(payload: CategoryCreatePayload) {
    //     // console.log("**Payload", payload);
    //     const result = await prisma.category.create({ data: payload });

    //     // console.log("**Result ", result)
    //     return result;
    // },

    // async getAllCategories() {
    //     return await prisma.category.findMany();
    // },
}