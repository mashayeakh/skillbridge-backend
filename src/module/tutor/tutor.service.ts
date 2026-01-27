import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma"
import { TutorTypes } from "../../types/tutor";


export const TutorService = {
    // async test() {
    //     return "Tutor service is working"
    // }

    async createTutorProfile(payload: TutorTypes) {
        console.log("--> paylaod from tutor profile", payload)
        return await prisma.tutorProfile.create({ data: payload });
    },


    //get by id
    async getTutorProfileById(id: string) {
        const result = await prisma.tutorProfile.findUnique({
            where: {
                id: id
            },
        })
        return result;
    },

    async getTutorProfile() {
        const result = await prisma.tutorProfile.findFirstOrThrow({
            include: {
                categories: {
                    include: {
                        category: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });
        console.log("your profile ", result)
        return {
            ...result,
            categories: result.categories.map(tc => tc.category)
        };
    },

    async updateTutorProfile(id: string, data: Partial<TutorTypes>) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: {
                id: id
            }
        })
        if (!tutor) throw new AppError(404, "tutor not found")

        //update
        const result = await prisma.tutorProfile.update({
            where: {
                id: tutor.id
            },
            data: {
                ...data
            }
        })

        return result


        // console.log("REsule ", result)


        // console.log("tutor", tutor)
    }
}