import { prisma } from "../../lib/prisma";

export const AdminService = {
    async getAllUsers() {
        // fetch all users and include their tutor profile if they have one
        const users = await prisma.user.findMany({
            include: {
                tutorProfile: {
                    include: {
                        categories: {
                            include: {
                                category: true
                            }
                        },
                        availabilities: true,
                        bookings: true
                    }
                },
                studentBookings: true
            }
        });

        return users;
    }
};
