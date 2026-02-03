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
        user: process.env.EMAIL_USER, // Fixed typo: was Email_USER
        pass: process.env.EMAIL_PASS, // Fixed typo: was Email_PASS
    },
});

export const auth = betterAuth({
    // Database adapter
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    // 🔥 CRITICAL: Add your frontend origin here
    trustedOrigins: [
        process.env.APP_URL!,
        "http://localhost:3000" // Add your local development URL
    ],

    // 🔥 CRITICAL: Cookie configuration for cross-origin
    cookie: {
        name: "auth-session", // Optional: custom cookie name
        sameSite: "none", // Required for cross-origin
        secure: true, // Required for HTTPS
        httpOnly: true, // Security best practice
        path: "/", // Accessible on all paths
        domain: ".vercel.app", // Use wildcard domain for Vercel
        // OR use specific domain if needed:
        // domain: "skillbridgebackend-zeta.vercel.app",
    },

    // 🔥 CRITICAL: Session configuration
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // Update every 24 hours
    },

    // User fields
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

    // Authentication methods
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },

    emailVerification: {
        sendOnSignUp: true,
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
                — Skill bridge Team
            </p>
    
            </div>
        </div>
        `,
                });
                console.log("msg sent", info.messageId)
            } catch (error) {
                console.error(error)
            }
        },
    },

    socialProviders: {
        google: {
            prompt: "select_account consent",
            accessType: "offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

    // 🔥 OPTIONAL but recommended: Add CORS configuration
    cors: {
        origin: ["http://localhost:3000", process.env.APP_URL!],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    },

    // ✅ Keep your existing hooks
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

                    console.log("-----Checking user status for email sign-in", user);

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

                console.log("-----Post-session check for banned user", user);

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