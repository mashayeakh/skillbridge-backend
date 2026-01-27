import { CreateAvailabilityInput } from "../../types/slots";
import { AppError } from './../../error/appErrors';
import { prisma } from "../../lib/prisma"

export const TutorAvailabilitySevice = {
    async createAvaility(data: CreateAvailabilityInput) {


        const { startTime, endTime, tutorProfileId } = data;

        if (new Date(startTime) >= new Date(endTime)) {
            throw new AppError(406, "End time must be after start time");
        }

        // tutor exist
        const tutor = await prisma.tutorProfile.findUnique({
            where: {
                id: tutorProfileId
            }
        })

        if (!tutor) throw new AppError(404, "Tutor not exist")

        const overLappingSlot = await prisma.tutorAvailability.findFirst({
            where: {
                tutorProfileId,
                startTime: {
                    lt: endTime,
                },
                endTime: {
                    gt: startTime,
                },
            },
        });



        if (overLappingSlot) throw new AppError(406, "Availability slot overlaps with an existing slot");

        //create
        const result = await prisma.tutorAvailability.create({
            data: {
                tutorProfileId,
                startTime,
                endTime
            }
        });

        console.log("REE ", result)

        return result;

    },
    //tutro availability
    async getTutorAvailability(tutorProfileId: string) {
        return prisma.tutorAvailability.findMany({
            where: { tutorProfileId },
            orderBy: { startTime: "asc" }
        });
    },

    //available slots
    async getAvailableSlots(tutorProfileId: string) {
        return prisma.tutorAvailability.findMany({
            where: {
                tutorProfileId,
                isBooked: false
            },
            orderBy: { startTime: "asc" }
        });
    }

}