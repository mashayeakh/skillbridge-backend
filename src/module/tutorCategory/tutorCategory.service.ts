import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma"
import { TutorTypes } from "../../types/tutor";


export const TutorCategoryService = {
    async test() {
        return "Tutor category service is working"
    },


    /**
     * 
     * TODO check tutor exist ----1
     * TODO check category exist && isActive=true ----2
     * TODO link with tutor and category ----3
     * 
     */
    async createTutorCategory(tutorProfileId: string, categoryId: string) {
        //*1
        const tutor = await prisma.tutorProfile.findUnique({
            where: {
                id: tutorProfileId
            }
        })

        // console.log("Tutor", tutor)

        if (!tutor) throw new AppError(404, "Tutor not exist")

        //*2
        const category = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if (!category || !category.isActive) throw new AppError(404, "Category not found or inactive")

        //*3
        const tutorCategory = await prisma.tutorCategory.create({
            data: {
                tutorProfileId,
                categoryId
            }
        })

        // console.log("Result ", tutorCategory);
        return tutorCategory;
    },
}