import { CreateAvailabilityInput } from "../../types/slots";
import { AppError } from './../../error/appErrors';
import { prisma } from "../../lib/prisma"

export const TutorAvailabilitySevice = {
    async createAvailability(data: CreateAvailabilityInput) {
        const { startTime, endTime, tutorProfileId } = data;

        if (new Date(startTime) >= new Date(endTime)) {
            throw new AppError(406, "End time must be after start time");
        }

        // Check if tutor profile exists
        const tutor = await prisma.tutorProfile.findUnique({
            where: { id: tutorProfileId }
        });
        if (!tutor) throw new AppError(404, "Tutor profile not found");

        // Check for overlapping slots
        const overlapping = await prisma.tutorAvailability.findFirst({
            where: {
                tutorProfileId,
                startTime: { lt: endTime },
                endTime: { gt: startTime }
            }
        });
        if (overlapping) throw new AppError(406, "Slot overlaps with an existing availability");

        // Create availability slot
        const result = await prisma.tutorAvailability.create({
            data: { tutorProfileId, startTime, endTime }
        });

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
    },

    //! update availability
    async updateAvailabilitySlot(
        slotId: string,
        isBooked: boolean,
        tutorUserId: string
    ) {
        // check slot exists and belongs to this tutor
        const slot = await prisma.tutorAvailability.findFirst({
            where: {
                id: slotId,
                tutorProfile: {
                    userId: tutorUserId,
                },
            },
        });

        if (!slot) {
            throw new AppError(
                404,
                "Availability slot not found or not authorized"
            );
        }

        return prisma.tutorAvailability.update({
            where: { id: slotId },
            data: { isBooked },
        });
    },
}