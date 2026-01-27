import { prisma } from "../../lib/prisma"
import { TutorTypes } from "../../types/tutor";


export const TutorService = {
    // async test() {
    //     return "Tutor service is working"
    // }

    async createTutorProfile(payload: TutorTypes) {
        console.log("--> paylaod from tutor profile", payload)
        return await prisma.tutorProfile.create({ data: payload });
    }
}