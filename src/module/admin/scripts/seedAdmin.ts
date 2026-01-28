import { AppError } from "../../../error/appErrors";
import { prisma } from "../../../lib/prisma";
import { Role } from "../../../types/role";

async function seedAdmin() {

    try {
        //create an admin user with predefined credentials
        const adminUser = {
            name: "Elon Musk",
            email: "elonmusk@tesla.com",
            password: "elonmusk123",
            role: Role.ADMIN,
            emailVerified: true,
        }

        //check if admin user already exists or not
        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: adminUser.email
            }
        })

        if (existingAdmin) throw new AppError(400, "Admin user already exists");

        console.log("***** admin about to be seeding now")
        //we will go with using api (http://localhost:5000/api/auth/sign-up/email) from better auth
        const url = "http://localhost:3000/api/auth/sign-up/email"
        console.log("*** URL hit ", url)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:3000"
            },
            body: JSON.stringify(adminUser)
        });

        const responseBody = await response.json();
        console.log("Response Body:", responseBody);

        if (response.ok) {
            console.log("Admin user seeded successfully");
            //update the email Verification.
            const updateUser = await prisma.user.update({
                where: {
                    email: adminUser.email,
                },
                //update the data (email verification = true)
                data: {
                    emailVerified: true,
                }
            });
            console.log("*******Email verified as well. ", updateUser);
        } else {
            console.log("*******Failed to seed admin user");
        }
    } catch (error: any) {
        console.error("******* Error seeding admin user:", error.message);
    }

}

seedAdmin()