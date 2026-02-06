import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    //  Add all possible frontend URLs
    trustedOrigins: [
        "http://localhost:3000",
        "https://skillbridgefrontend-delta.vercel.app",
        "https://skillbridgefrontend-5fzzlpwp5-mashayeakhs-projects.vercel.app",
        "https://skillbridgefrontend-*.vercel.app",
        "https://*-mashayeakhs-projects.vercel.app",
    ],

    //  Cookie configuration for production
    cookie: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Update every 24 hours
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },

    advanced: {
        cookiePrefix: "skillbridge",
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: true,
            baseDomain: ".vercel.app"
        },
        disableCSRFCheck: false,
    },

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
        autoSignIn: true,
        requireEmailVerification: false,
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, token }, request) => {
            try {
                // 🔥 FIXED: Use correct environment variable
                const frontendUrl = process.env.NODE_ENV === "production"
                    ? process.env.PROD_APP_URL
                    : process.env.APP_URL;

                const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

                await transporter.sendMail({
                    from: `"Skill Bridge" <${process.env.EMAIL_USER}>`,
                    to: user.email!,
                    subject: "Verify your email address",
                    html: `
                        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
                            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 6px;">
                                <h2 style="color: #111827; margin-bottom: 10px;">
                                    Welcome to Skill Bridge 👋
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
                                    If the button doesn't work, copy and paste this link into your browser:
                                </p>
                                <p style="word-break: break-all; font-size: 12px; color: #2563eb;">
                                    ${verificationUrl}
                                </p>
                                <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
                                <p style="color: #9ca3af; font-size: 12px;">
                                    If you didn't create this account, you can safely ignore this email.
                                </p>
                                <p style="color: #9ca3af; font-size: 12px; margin-top: 10px;">
                                    — Skill Bridge Team
                                </p>
                            </div>
                        </div>
                    `,
                });
            } catch (error) {
                console.error("Email sending error:", error);
            }
        },
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.Google_Client_ID as string,
            clientSecret: process.env.Google_Client_Secret as string,
        },
    },

    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            const isSignInPath = ctx.path === "/sign-in/email" ||
                ctx.path === "/sign-in/social" ||
                ctx.path.startsWith("/callback");

            if (isSignInPath) {
                if (ctx.path === "/sign-in/email" && ctx.body?.email) {
                    const user = await prisma.user.findUnique({
                        where: { email: ctx.body.email as string },
                        select: { id: true, status: true },
                    });

                    if (user && user.status === "BANNED") {
                        throw new APIError("FORBIDDEN", {
                            message: "Your account has been banned. Please contact support.",
                        });
                    }
                }
            }
        }),

        after: createAuthMiddleware(async (ctx) => {
            if (ctx.context.newSession) {
                const user = await prisma.user.findUnique({
                    where: { id: ctx.context.newSession.user.id },
                    select: { status: true },
                });

                if (user && user.status === "BANNED") {
                    await prisma.session.delete({
                        where: { id: ctx.context.newSession.session.id },
                    });

                    throw new APIError("FORBIDDEN", {
                        message: "Your account has been banned. Please contact support.",
                    });
                }
            }
        }),
    },
});