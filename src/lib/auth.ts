import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.Email_USER,
        pass: process.env.Email_PASS,
    },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],

    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "STUDENT",
                required: false,
            },
            phone: {
                type: "string",
                required: false,
            },
            status: {
                type: "string",
                defaultValue: "ACTIVE",
                required: false,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true,
    },
    emailVerification: {
        // send the vefification email on sign up only
        sendOnSignUp: true,
        //after being verified, auto signin the user
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url, token }, request) => {

            try {
                console.log({ user, url, token })
                const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

                const info = await transporter.sendMail({
                    from: `"Skill bridge" <${process.env.EMAIL_USER}>`,
                    to: user.email!,
                    subject: "Verify your email address",
                    html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 6px;">
            
            <h2 style="color: #111827; margin-bottom: 10px;">
                Welcome to Skill bridge 👋
            </h2>
    
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                Hi ${user.name || "there"},
            </p>
    
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
                Thanks for creating an account. Please confirm your email address by clicking the button below.
            </p>
    
            <div style="text-align: center; margin: 30px 0;">
                <a 
                href="${verificationUrl}"
                style="
                    background-color: #2563eb;
                    color: #ffffff;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 4px;
                    font-size: 14px;
                    display: inline-block;
                "
                >
                Verify Email
                </a>
            </div>
    
            <p style="color: #6b7280; font-size: 13px; line-height: 1.6;">
                If the button doesn’t work, copy and paste this link into your browser:
            </p>
    
            <p style="word-break: break-all; font-size: 12px; color: #2563eb;">
                ${verificationUrl}
            </p>
    
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
    
            <p style="color: #9ca3af; font-size: 12px;">
                If you didn’t create this account, you can safely ignore this email.
            </p>
    
            <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                — Prisma Blog Team
            </p>
    
            </div>
        </div>
        `,
                });
                console.log("msg sent", info.messageId)
            } catch (error) {
                console.error(
                    error
                )
            }



        },
    },
});