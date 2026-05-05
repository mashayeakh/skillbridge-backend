import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function debug() {
    const tutorUserId = "zRJEIySdu9wuZ7FyqdMSNLjAnWb8jnHl";
    console.log("Checking bookings for User:", tutorUserId);

    const user = await prisma.user.findUnique({
        where: { id: tutorUserId },
        include: { tutorProfile: true }
    });

    console.log("User found:", !!user);
    console.log("Name:", user?.name);
    console.log("Tutor Profile ID:", user?.tutorProfile?.id);

    const asTutor = await prisma.booking.findMany({
        where: { tutorProfileId: user?.tutorProfile?.id },
        include: { student: true }
    });

    console.log("Bookings where they are the TUTOR:", asTutor.length);
    asTutor.forEach(b => console.log(`- Booking ${b.id}: Student ${b.student.name}, Start: ${b.startTime}`));
}

debug().catch(console.error).finally(() => prisma.$disconnect());
