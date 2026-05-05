import { prisma } from "../src/lib/prisma";

async function main() {
  const bookings = await prisma.booking.findMany({
    include: {
      student: { select: { name: true } },
      tutorProfile: { select: { name: true, userId: true } },
    },
  });

  console.log("Total bookings in DB:", bookings.length);
  bookings.forEach((b) => {
    console.log(`Booking ID: ${b.id}`);
    console.log(`  Student: ${b.student.name} (ID: ${b.studentId})`);
    console.log(`  Tutor Profile: ${b.tutorProfile.name} (ID: ${b.tutorProfileId}, UserID: ${b.tutorProfile.userId})`);
    console.log(`  Status: ${b.status}`);
    console.log("-------------------");
  });

  const tutors = await prisma.tutorProfile.findMany();
  console.log("\nAll Tutor Profiles:");
  tutors.forEach(t => {
    console.log(`- ${t.name} (ID: ${t.id}, UserID: ${t.userId})`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
