import { app } from "./app";
import { prisma } from "./lib/prisma";
import { seedAdmin } from "./module/admin/scripts/seedAdmin";

const port = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log("👍 DB Connected");

        // Seed admin on startup
        await seedAdmin();

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("👎 Connection failed", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

// Always call main
main();

export default app;