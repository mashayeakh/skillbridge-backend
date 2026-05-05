import { prisma } from "../src/lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true }
  });

  console.log("All Users:");
  users.forEach(u => {
    console.log(`- ${u.name} (ID: ${u.id}, Email: ${u.email}, Role: ${u.role})`);
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
