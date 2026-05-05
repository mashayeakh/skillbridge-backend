import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from "@prisma/client";
import pg from "pg";

const connectionString = `${process.env.DATABASE_URL}`
const pool = new pg.Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function debug() {
    const userId = "2T4JtldXjFW3WFWXyqcGM6hDGdNMLPza";
    console.log("Checking bookings for User:", userId);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tutorProfile: true }
    });

    console.log("User found:", !!user);
    console.log("Tutor Profile ID:", user?.tutorProfile?.id);

    const asTutor = await prisma.booking.findMany({
        where: { tutorProfile: { userId: userId } },
        include: { student: true }
    });

    console.log("Bookings as Tutor:", asTutor.length);
    asTutor.forEach(b => console.log(`- Booking ${b.id}: Student ${b.student.name}, Start: ${b.startTime}`));

    const asStudent = await prisma.booking.findMany({
        where: { studentId: userId },
        include: { tutorProfile: true }
    });

    console.log("Bookings as Student:", asStudent.length);
    asStudent.forEach(b => console.log(`- Booking ${b.id}: Tutor Profile ${b.tutorProfile.id}, Start: ${b.startTime}`));
}

debug().catch(console.error).finally(() => prisma.$disconnect());
