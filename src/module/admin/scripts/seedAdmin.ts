import "dotenv/config";
import { prisma } from "../../../lib/prisma";
import { auth } from "../../../lib/auth";


async function main() {
    process.env.NODE_ENV = "seeding";
    console.log("***  Seeding Admin User...  ***");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@admin.com";
    const adminPassword = process.env.ADMIN_PASS || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Admin";


    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingUser) {
        console.log(`*** Creating new admin user: ${adminEmail} ***`);
        try {
            await auth.api.signUpEmail({
                body: {
                    email: adminEmail,
                    password: adminPassword,
                    name: adminName,
                },
            });
            console.log("*** User created sucessfully ***.");
        } catch (error: any) {
            console.error("***Error creating admin account: ", error.message, "***");
        }
    } else {
        console.log(
            `*** User ${adminEmail} already exists. Updating to ADMIN role...`,
        );
    }

    //! ensure user has admin role and is verified in the database
    await prisma.user.update({
        where: { email: adminEmail },
        data: {
            role: "ADMIN",
            // isActive: true,
            status: "ACTIVE",
            emailVerified: true,
            name: adminName,
        },
    });

    console.log(`*** User ${adminEmail} is now an ADMIN ***`);
}

main()
    .catch((e) => {
        console.error("*** Error seeding admin user ***", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });