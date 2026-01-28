import { AppError } from "../../error/appErrors";
import { prisma } from "../../lib/prisma"
import { BookingInput } from "../../types/booking";


export const BookingService = {
    async createBooking(payload: BookingInput) {
        console.log("--> payload from booking", payload)
        const tutor = await prisma.user.findUnique({
            where: { id: "e7d0a83d-23c9-4ced-8c50-713d4e4e4a53" },
        });

        const student = await prisma.user.findUnique({
            where: { id: "K2XHqEOP0UTXaGMwdaRm7L2RbMU9bEDY" },
        });

        console.log({ tutor, student });
        // return await prisma.booking.create({ data: payload })
    },

}