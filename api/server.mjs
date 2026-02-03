var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express9 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, APIError } from "better-auth/api";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// prisma/generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// model User {\n//     id            String    @id\n//     name          String\n//     email         String\n//     emailVerified Boolean   @default(false)\n//     image         String?\n//     createdAt     DateTime  @default(now())\n//     updatedAt     DateTime  @updatedAt\n//     role          String?   @default("STUDENT")\n//     phone         String?\n//     status        String?   @default("ACTIVE")\n//     sessions      Session[]\n//     accounts      Account[]\n\n//     // Opposite sides of Booking relations\n//     studentBookings Booking[] @relation("StudentBookings")\n//     tutorBookings   Booking[] @relation("TutorBookings")\n\n//     @@unique([email])\n//     @@map("user")\n// }\n\nmodel User {\n  id            String   @id\n  name          String\n  email         String\n  emailVerified Boolean  @default(false)\n  image         String?\n  createdAt     DateTime @default(now())\n  updatedAt     DateTime @updatedAt\n  role          String?  @default("STUDENT")\n  phone         String?\n  status        String?  @default("ACTIVE")\n\n  sessions Session[]\n  accounts Account[]\n\n  studentBookings Booking[]     @relation("StudentBookings")\n  tutorProfile    TutorProfile?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\n// model Booking {\n//     id String @id @default(uuid())\n\n//     studentId String\n//     tutorId   String\n\n//     student User @relation("StudentBookings", fields: [studentId], references: [id])\n//     tutor User @relation("TutorBookings", fields: [tutorId], references: [id])\n\n//     startTime DateTime\n//     endTime   DateTime\n//     status    BookingStatus\n//     price     Float\n\n//     review Review?\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n// }\n\nmodel Booking {\n  id String @id @default(uuid())\n\n  studentId      String\n  tutorProfileId String\n\n  student      User         @relation("StudentBookings", fields: [studentId], references: [id])\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  startTime DateTime?\n  endTime   DateTime?\n  status    BookingStatus\n  price     Float\n\n  review Review?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nenum BookingStatus {\n  CONFIRMED\n  CANCELLED\n  COMPLETED\n}\n\nmodel Category {\n  id          String  @id @default(uuid())\n  name        String  @unique\n  description String?\n  isActive    Boolean @default(true)\n\n  tutors TutorCategory[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Review {\n  id        String  @id @default(uuid())\n  bookingId String  @unique\n  rating    Int\n  comment   String?\n\n  booking Booking @relation(fields: [bookingId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\n// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel TutorAvailability {\n  id             String @id @default(uuid())\n  tutorProfileId String\n\n  startTime DateTime\n  endTime   DateTime\n  isBooked  Boolean  @default(false)\n\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n\n  createdAt DateTime @default(now())\n}\n\nmodel TutorCategory {\n  id             String @id @default(uuid())\n  tutorProfileId String\n  categoryId     String\n\n  //relationship\n  tutorProfile TutorProfile @relation(fields: [tutorProfileId], references: [id])\n  category     Category     @relation(fields: [categoryId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@unique([tutorProfileId, categoryId])\n}\n\n// model TutorProfile {\n//     id              String @id @default(uuid())\n//     name            String\n//     bio             String\n//     hourlyRate      Float\n//     experienceYears Int\n//     rating          Float?\n//     // isVerified      Boolean @default(false)\n\n//     userId String @unique\n//     user   User   @relation(fields: [userId], references: [id])\n\n//     categories     TutorCategory[]\n//     availabilities TutorAvailability[]\n//     bookings       Booking[]           @relation("TutorProfileBookings")\n\n//     createdAt DateTime @default(now())\n//     updatedAt DateTime @updatedAt\n// }\n\nmodel TutorProfile {\n  id              String @id @default(uuid())\n  name            String\n  bio             String\n  hourlyRate      Float\n  experienceYears Int\n  rating          Float?\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  categories     TutorCategory[]\n  availabilities TutorAvailability[]\n  bookings       Booking[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"role","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"status","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"BookingToTutorProfile"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"price","kind":"scalar","type":"Float"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"isActive","kind":"scalar","type":"Boolean"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorAvailability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"startTime","kind":"scalar","type":"DateTime"},{"name":"endTime","kind":"scalar","type":"DateTime"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorAvailabilityToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorProfileId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"hourlyRate","kind":"scalar","type":"Float"},{"name":"experienceYears","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availabilities","kind":"object","type":"TutorAvailability","relationName":"TutorAvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"BookingToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// prisma/generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  BookingScalarFieldEnum: () => BookingScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  TutorAvailabilityScalarFieldEnum: () => TutorAvailabilityScalarFieldEnum,
  TutorCategoryScalarFieldEnum: () => TutorCategoryScalarFieldEnum,
  TutorProfileScalarFieldEnum: () => TutorProfileScalarFieldEnum,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Session: "Session",
  Account: "Account",
  Verification: "Verification",
  Booking: "Booking",
  Category: "Category",
  Review: "Review",
  TutorAvailability: "TutorAvailability",
  TutorCategory: "TutorCategory",
  TutorProfile: "TutorProfile"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  emailVerified: "emailVerified",
  image: "image",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  role: "role",
  phone: "phone",
  status: "status"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var BookingScalarFieldEnum = {
  id: "id",
  studentId: "studentId",
  tutorProfileId: "tutorProfileId",
  startTime: "startTime",
  endTime: "endTime",
  status: "status",
  price: "price",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  isActive: "isActive",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var ReviewScalarFieldEnum = {
  id: "id",
  bookingId: "bookingId",
  rating: "rating",
  comment: "comment",
  createdAt: "createdAt"
};
var TutorAvailabilityScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  startTime: "startTime",
  endTime: "endTime",
  isBooked: "isBooked",
  createdAt: "createdAt"
};
var TutorCategoryScalarFieldEnum = {
  id: "id",
  tutorProfileId: "tutorProfileId",
  categoryId: "categoryId",
  createdAt: "createdAt"
};
var TutorProfileScalarFieldEnum = {
  id: "id",
  name: "name",
  bio: "bio",
  hourlyRate: "hourlyRate",
  experienceYears: "experienceYears",
  rating: "rating",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// prisma/generated/prisma/enums.ts
var BookingStatus = {
  CONFIRMED: "CONFIRMED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED"
};

// prisma/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    // Fixed typo: was Email_USER
    pass: process.env.EMAIL_PASS
    // Fixed typo: was Email_PASS
  }
});
var auth = betterAuth({
  // Database adapter
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  // 🔥 CRITICAL: Add your frontend origin here
  trustedOrigins: [
    process.env.APP_URL,
    "http://localhost:3000"
    // Add your local development URL
  ],
  // 🔥 CRITICAL: Cookie configuration for cross-origin
  cookie: {
    name: "auth-session",
    // Optional: custom cookie name
    sameSite: "none",
    // Required for cross-origin
    secure: true,
    // Required for HTTPS
    httpOnly: true,
    // Security best practice
    path: "/",
    // Accessible on all paths
    domain: ".vercel.app"
    // Use wildcard domain for Vercel
    // OR use specific domain if needed:
    // domain: "skillbridgebackend-zeta.vercel.app",
  },
  // 🔥 CRITICAL: Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    // 7 days
    updateAge: 60 * 60 * 24
    // Update every 24 hours
  },
  // User fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false
      }
    }
  },
  // Authentication methods
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    requireEmailVerification: false
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        console.log({ user, url, token });
        const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: `"Skill bridge" <${process.env.EMAIL_USER}>`,
          to: user.email,
          subject: "Verify your email address",
          html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 6px;">
            
            <h2 style="color: #111827; margin-bottom: 10px;">
                Welcome to Skill bridge \u{1F44B}
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
                \u2014 Skill bridge Team
            </p>
    
            </div>
        </div>
        `
        });
        console.log("msg sent", info.messageId);
      } catch (error) {
        console.error(error);
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  },
  // 🔥 OPTIONAL but recommended: Add CORS configuration
  cors: {
    origin: ["http://localhost:3000", process.env.APP_URL],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  // ✅ Keep your existing hooks
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      const isSignInPath = ctx.path === "/sign-in/email" || ctx.path === "/sign-in/social" || ctx.path.startsWith("/callback");
      if (isSignInPath) {
        if (ctx.path === "/sign-in/email" && ctx.body?.email) {
          const user = await prisma.user.findUnique({
            where: { email: ctx.body.email },
            select: { id: true, status: true }
          });
          console.log("-----Checking user status for email sign-in", user);
          if (user && user.status === "BANNED") {
            throw new APIError("FORBIDDEN", {
              message: "Your account has been banned. Please contact support."
            });
          }
        }
      }
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.newSession) {
        const user = await prisma.user.findUnique({
          where: { id: ctx.context.newSession.user.id },
          select: { status: true }
        });
        console.log("-----Post-session check for banned user", user);
        if (user && user.status === "BANNED") {
          await prisma.session.delete({
            where: { id: ctx.context.newSession.session.id }
          });
          throw new APIError("FORBIDDEN", {
            message: "Your account has been banned. Please contact support."
          });
        }
      }
    })
  }
});

// src/router/index.ts
import { Router as Router4 } from "express";

// src/module/categories/categories.router.ts
import express from "express";
var router = express.Router();
var CategoriesRouter = router;

// src/module/tutor/tutor.router.ts
import express2 from "express";

// src/utils/asyncHandler.ts
var asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// src/error/appErrors.ts
var AppError = class _AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, _AppError);
  }
};

// src/module/tutor/tutor.service.ts
var TutorService = {
  async createTutorProfile(payload) {
    console.log("--> payload from tutor profile", payload);
    const existingProfile = await prisma.tutorProfile.findUnique({
      where: { userId: payload.userId }
    });
    if (existingProfile) {
      throw new AppError(400, "You already have a tutor profile. You cannot create another one.");
    }
    const data = {
      name: payload.name,
      bio: payload.bio,
      hourlyRate: payload.hourlyRate,
      experienceYears: payload.experienceYears,
      rating: payload.rating || null,
      userId: payload.userId
    };
    console.log("DATA to be added", data);
    return await prisma.tutorProfile.create({ data });
  },
  //get by id
  async getTutorProfileById(id) {
    const result = await prisma.tutorProfile.findUnique({
      where: {
        id
      },
      include: {
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    return result;
  },
  // const result = await prisma.tutorProfile.findFirstOrThrow({
  //     include: {
  //         categories: {
  //             include: {
  //                 category: {
  //                     select: {
  //                         id: true,
  //                         name: true
  //                     }
  //                 }
  //             }
  //         }
  //     }
  // });
  // console.log("your profile ", result)
  // return {
  //     ...result,
  //     categories: result.categories.map(tc => tc.category)
  // };
  //your own profile
  async getTutorProfile(userId) {
    const result = await prisma.tutorProfile.findUnique({
      where: { userId },
      // find by userId
      include: {
        categories: {
          // include:
          // {
          //     category: true,
          // }
          select: {
            category: {
              select: {
                name: true,
                isActive: true
              }
            }
          }
        },
        availabilities: {
          select: {
            startTime: true,
            endTime: true,
            isBooked: true
          }
        }
      }
      // optional, if you want categories
    });
    console.log("Your profile:", result);
    return result;
  },
  //get all tutors
  async getAllTutors() {
    const result = await prisma.tutorProfile.findMany({
      include: {
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    return {
      totalTutors: result.length,
      // categories: result.map(tc => tc.categories),
      tutors: result
    };
  },
  //update tutor profile
  async updateProfile(payload) {
    const { tutorProfileId, name, bio, hourlyRate, experienceYears, rating, categoryIds } = payload;
    const updatedProfile = await prisma.tutorProfile.update({
      where: { id: tutorProfileId },
      data: {
        name,
        bio,
        hourlyRate,
        experienceYears,
        rating: rating ?? null
      }
    });
    if (categoryIds && categoryIds.length > 0) {
      await prisma.tutorCategory.deleteMany({
        where: { tutorProfileId }
      });
      const categoriesData = categoryIds.map((categoryId) => ({
        tutorProfileId,
        categoryId
      }));
      await prisma.tutorCategory.createMany({ data: categoriesData });
    }
    return prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId },
      include: { categories: { include: { category: true } } }
    });
  },
  //updgrade to tutor
  async upgradeToTutor(id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    console.log("--user ", user);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    if (user.role === "TUTOR" /* TUTOR */) {
      throw new AppError(400, "User is already a tutor");
    }
    const result = await prisma.user.update({
      where: { id },
      data: { role: "TUTOR" /* TUTOR */ }
    });
    console.log("RESUKKKKK", result);
    return result;
  },
  //top tutors 
  async getTopTutors() {
    const result = await prisma.tutorProfile.findMany({
      where: {
        rating: { not: null },
        experienceYears: { gte: 0 }
      },
      orderBy: [
        { rating: "desc" },
        { experienceYears: "desc" },
        { updatedAt: "desc" }
      ],
      take: 5,
      include: {
        categories: {
          include: {
            category: true
          }
        }
        // user: true, 
      }
    });
    return result;
  }
};

// src/module/tutor/tutor.controller.ts
var TutorController = {
  // getTest: asyncHandler(
  //     async (req: Request, res: Response) => {
  //         res.status(200).json({
  //             success: true,
  //             data: await TutorService.test()
  //         })
  //     }
  // )
  //create tutor profile
  createTutorProfile: asyncHandler(
    async (req, res) => {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized\u274C" });
      }
      if (req.user?.role !== "TUTOR" /* TUTOR */) {
        return res.status(403).json({ success: false, message: "Forbidden: you must be a tutor" });
      }
      const payload = req.body;
      const completePayload = { ...payload, userId };
      try {
        const createdProfile = await TutorService.createTutorProfile(completePayload);
        res.status(201).json({
          success: true,
          message: "Tutor profile created successfully",
          data: createdProfile
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          message: error.message || "Could not create profile",
          requestInfo: {
            method: req.method,
            path: req.originalUrl,
            time: (/* @__PURE__ */ new Date()).toLocaleString()
          }
        });
      }
    }
  ),
  //get your profile
  getYourProfile: asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    console.log("user id ", userId);
    if (!userId) throw new AppError(401, "Unauthorized");
    const profile = await TutorService.getTutorProfile(userId);
    res.status(200).json({
      success: true,
      message: "Your profile retrieved",
      data: profile
    });
  }),
  //get profile by id
  getProfileById: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      res.status(200).json({
        success: true,
        message: "tutor profile by id retrieved",
        data: await TutorService.getTutorProfileById(id)
      });
    }
  ),
  //update your profile
  updateYourProfile: asyncHandler(
    async (req, res) => {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized\u274C" });
      }
      const tutorProfile = await prisma.tutorProfile.findUnique({
        where: { userId },
        include: { categories: true }
      });
      if (!tutorProfile) {
        return res.status(404).json({ success: false, message: "Tutor profile not found" });
      }
      const updatedProfile = await TutorService.updateProfile({
        tutorProfileId: tutorProfile.id,
        ...req.body
      });
      res.status(200).json({
        success: true,
        message: "Your profile updated successfully",
        data: updatedProfile
      });
    }
  ),
  getAllTutors: asyncHandler(
    async (req, res) => {
      res.status(200).json({
        success: true,
        message: "All tutors retrieved",
        data: await TutorService.getAllTutors()
      });
    }
  ),
  upgradeToTutor: asyncHandler(
    async (req, res) => {
      const id = req.user?.id;
      console.log("---id ", id);
      if (!id) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      const result = await TutorService.upgradeToTutor(id);
      res.status(200).json(
        {
          success: true,
          message: "User upgraded to tutor",
          data: result
        }
      );
    }
  ),
  viewTopTutors: asyncHandler(
    async (req, res) => {
      const result = await TutorService.getTopTutors();
      console.log("RE", result);
      res.status(200).json(
        {
          success: true,
          message: "Top tutors retrieved",
          data: await TutorService.getTopTutors()
        }
      );
    }
  )
};

// src/middleware/auth.ts
var authMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      console.log("--Session", session);
      if (!session) {
        return res.status(401).json({ message: "Unauthorized!!!!!!" });
      }
      if (roles.length > 0 && !roles.includes(session.user.role)) {
        return res.status(403).json({ message: "Forbidden: insufficient role" });
      }
      req.user = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        role: session.user.role
      };
      const user = await prisma.user.findUnique({
        where: { id: req.user.id }
      });
      if (!user || user.status === "BANNED") {
        return res.status(403).json({
          message: "Your account has been banned"
        });
      }
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

// src/module/tutor/tutor.router.ts
var router2 = express2.Router();
router2.patch("/profile", authMiddleware("TUTOR" /* TUTOR */), TutorController.createTutorProfile);
router2.get("/me", authMiddleware("TUTOR" /* TUTOR */), TutorController.getYourProfile);
router2.get("/top-tutors", TutorController.viewTopTutors);
router2.get("/all", TutorController.getAllTutors);
router2.put("/profile", authMiddleware("TUTOR" /* TUTOR */), TutorController.updateYourProfile);
router2.post("/upgrade", authMiddleware(), TutorController.upgradeToTutor);
router2.get("/:id", TutorController.getProfileById);
var TutorRouter = router2;

// src/module/tutorCategory/tutorCategory.router.ts
import express3 from "express";

// src/module/tutorCategory/tutorCategory.service.ts
var TutorCategoryService = {
  async test() {
    return "Tutor category service is working";
  },
  /**
   * 
   * TODO check tutor exist ----1
   * TODO check category exist && isActive=true ----2
   * TODO link with tutor and category ----3
   * 
   */
  async createTutorCategory(tutorProfileId, categoryId) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: {
        id: tutorProfileId
      }
    });
    if (!tutor) throw new AppError(404, "Tutor not exist");
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId
      }
    });
    if (!category || !category.isActive) throw new AppError(404, "Category not found or inactive");
    const tutorCategory = await prisma.tutorCategory.create({
      data: {
        tutorProfileId,
        categoryId
      }
    });
    return tutorCategory;
  }
};

// src/module/tutorCategory/tutorCategory.controller.ts
var TutorCategoryController = {
  getTest: asyncHandler(
    async (req, res) => {
      res.status(200).json({
        success: true,
        data: await TutorCategoryService.test()
      });
    }
  ),
  // create tutor profile
  createCategory: asyncHandler(
    async (req, res) => {
      console.log("\u{1F6A8} TUTOR CATEGORY CONTROLLER HIT");
      const { tutorProfileId, categoryId } = req.body;
      console.log("-- controller paylaod", tutorProfileId, categoryId);
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: await TutorCategoryService.createTutorCategory(tutorProfileId, categoryId)
      });
    }
  )
};

// src/module/tutorCategory/tutorCategory.router.ts
var router3 = express3.Router();
router3.get("/", TutorCategoryController.getTest);
router3.post("/", TutorCategoryController.createCategory);
var TutorCategoryRouter = router3;

// src/module/tutoravailability/availability.route.ts
import express4 from "express";

// src/module/tutoravailability/availability.service.ts
var TutorAvailabilitySevice = {
  async createAvailability(data) {
    const { startTime, endTime, tutorProfileId } = data;
    if (new Date(startTime) >= new Date(endTime)) {
      throw new AppError(406, "End time must be after start time");
    }
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId }
    });
    if (!tutor) throw new AppError(404, "Tutor profile not found");
    const overlapping = await prisma.tutorAvailability.findFirst({
      where: {
        tutorProfileId,
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
    if (overlapping) throw new AppError(406, "Slot overlaps with an existing availability");
    const result = await prisma.tutorAvailability.create({
      data: { tutorProfileId, startTime, endTime }
    });
    return result;
  },
  //tutro availability
  async getTutorAvailability(tutorProfileId) {
    return prisma.tutorAvailability.findMany({
      where: { tutorProfileId },
      orderBy: { startTime: "asc" }
    });
  },
  //available slots
  async getAvailableSlots(tutorProfileId) {
    return prisma.tutorAvailability.findMany({
      where: {
        tutorProfileId,
        isBooked: false
      },
      orderBy: { startTime: "asc" }
    });
  },
  //! update availability
  async updateAvailabilitySlot(slotId, isBooked, tutorUserId) {
    const slot = await prisma.tutorAvailability.findFirst({
      where: {
        id: slotId,
        tutorProfile: {
          userId: tutorUserId
        }
      }
    });
    if (!slot) {
      throw new AppError(
        404,
        "Availability slot not found or not authorized"
      );
    }
    return prisma.tutorAvailability.update({
      where: { id: slotId },
      data: { isBooked }
    });
  }
};

// src/module/tutoravailability/availability.controller.ts
var TutorAvailabilityController = {
  //!create avalability slots
  createSlots: asyncHandler(async (req, res) => {
    console.log("\u{1F525} Availability Controller Hit");
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, "Unauthorized\u274C");
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId }
    });
    if (!tutorProfile) throw new AppError(404, "Tutor profile not found");
    const { startTime, endTime } = req.body;
    if (!startTime || !endTime) {
      throw new AppError(400, "Missing required fields");
    }
    const data = {
      tutorProfileId: tutorProfile.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime)
    };
    const created = await TutorAvailabilitySevice.createAvailability(data);
    res.status(201).json({
      success: true,
      message: "Availability slot created",
      data: created
    });
  }),
  //!get tutor available slots
  getAvailableSlots: asyncHandler(
    async (req, res) => {
      const slots = await TutorAvailabilitySevice.getAvailableSlots(req.params.tutorProfileId);
      res.status(200).json({
        success: true,
        data: slots
      });
    }
  ),
  //update availability
  updateAvailability: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isBooked } = req.body;
    if (typeof isBooked !== "boolean") {
      throw new AppError(400, "isBooked must be boolean");
    }
    const updatedSlot = await TutorAvailabilitySevice.updateAvailabilitySlot(
      id,
      isBooked,
      req.user.id
    );
    res.status(200).json({
      success: true,
      message: "Availability slot updated successfully",
      data: updatedSlot
    });
  })
};

// src/module/tutoravailability/availability.route.ts
var router4 = express4.Router();
router4.post("/", authMiddleware("TUTOR" /* TUTOR */), TutorAvailabilityController.createSlots);
router4.get("/:id", authMiddleware("TUTOR" /* TUTOR */), TutorAvailabilityController.getAvailableSlots);
router4.patch(
  "/slot/:id",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorAvailabilityController.updateAvailability
);
var TutorAvailabilityRouter = router4;

// src/module/bookings/bookings.route.ts
import express5 from "express";

// src/module/bookings/bookings.service.ts
import z from "zod";
var createBookingSchema = z.object({
  // studentId: z.string().uuid(),
  studentId: z.string(),
  tutorProfileId: z.uuid(),
  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),
  status: z.enum(BookingStatus),
  price: z.number().positive()
});
var BookingService = {
  async createBooking(payload) {
    const { studentId, tutorProfileId, startTime, endTime, price, status } = payload;
    if (endTime <= startTime) {
      throw new AppError(400, "End time must be after start time");
    }
    const student = await prisma.user.findUnique({
      where: { id: studentId }
    });
    if (!student) {
      throw new AppError(404, "Student not found");
    }
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId }
    });
    if (!tutorProfile) {
      throw new AppError(404, "Tutor profile not found");
    }
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        tutorProfileId,
        status: "CONFIRMED",
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
    if (overlappingBooking) {
      throw new AppError(409, "Tutor is already booked for this time slot");
    }
    return await prisma.booking.create({
      data: {
        studentId,
        tutorProfileId,
        startTime,
        endTime,
        price,
        status
      }
    });
  },
  //!get users bookings
  async getStudentBookings(studentId) {
    const bookings = await prisma.booking.findMany({
      where: {
        studentId
      },
      include: {
        tutorProfile: {
          select: {
            id: true,
            name: true,
            bio: true,
            hourlyRate: true,
            rating: true,
            userId: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return bookings;
  },
  // get all bookings
  async getAllBookings() {
    return prisma.booking.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            categories: {
              include: {
                category: true
              }
            }
          }
        },
        review: true
      }
    });
  },
  //by id
  async getBookingById(id) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        student: true,
        tutorProfile: {
          include: {
            user: true,
            categories: {
              include: { category: true }
            }
          }
        },
        review: true
      }
    });
  },
  //by student id
  async getBookingsByStudent(studentId) {
    return prisma.booking.findMany({
      where: { studentId },
      orderBy: { startTime: "desc" },
      include: {
        tutorProfile: {
          include: {
            user: true
          }
        }
      }
    });
  },
  //by tutor (profile id)
  async getBookingsByTutorProfile(tutorProfileId) {
    return prisma.booking.findMany({
      where: { tutorProfileId },
      orderBy: { startTime: "desc" },
      include: {
        student: true
      }
    });
  },
  //upcoming bookings - means only confirmed but not completed
  async getUpcomingBookings() {
    return prisma.booking.findMany({
      where: {
        startTime: {
          gte: /* @__PURE__ */ new Date()
        },
        status: "CONFIRMED"
      },
      orderBy: {
        startTime: "asc"
      },
      include: {
        student: true,
        tutorProfile: true
      }
    });
  }
};

// src/module/bookings/bookings.controller.ts
var BookingController = {
  //create Booking
  createBooking: asyncHandler(
    async (req, res) => {
      const body = createBookingSchema.parse(req.body);
      const payload = {
        ...body,
        startTime: new Date(body.startTime),
        endTime: new Date(body.endTime)
      };
      const booking = await BookingService.createBooking(payload);
      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: booking
      });
    }
  ),
  //!Get std bookings
  getMyBookings: asyncHandler(async (req, res) => {
    if (!req.user?.id) {
      throw new AppError(401, "Unauthorized");
    }
    const bookings = await BookingService.getStudentBookings(req.user.id);
    res.status(200).json({
      success: true,
      message: "Student bookings retrieved successfully",
      data: bookings
    });
  }),
  //get all bookings
  getAllBookings: asyncHandler(
    async (req, res) => {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json({
        success: true,
        data: bookings
      });
    }
  ),
  //by id
  getBookingById: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      const booking = await BookingService.getBookingById(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found"
        });
      }
      res.status(200).json({
        success: true,
        data: booking
      });
    }
  ),
  //by student id
  getBookingsByStudentId: asyncHandler(
    async (req, res) => {
      const { studentId } = req.params;
      const bookings = await BookingService.getBookingsByStudent(studentId);
      res.status(200).json({
        success: true,
        data: await BookingService.getBookingsByStudent(studentId)
      });
    }
  ),
  //by tutor profile id
  getBookingsByTutorProfileId: asyncHandler(
    async (req, res) => {
      const { tutorProfileId } = req.params;
      const bookings = await BookingService.getBookingsByTutorProfile(tutorProfileId);
      res.status(200).json({
        success: true,
        data: bookings
      });
    }
  ),
  //by tutor profile id
  getUpcomingBookings: asyncHandler(
    async (req, res) => {
      const upcomingBookings = await BookingService.getUpcomingBookings();
      res.status(200).json({
        success: true,
        data: upcomingBookings
      });
    }
  )
};

// src/module/bookings/bookings.route.ts
var router5 = express5.Router();
router5.post("/", authMiddleware("STUDENT" /* STUDENT */), BookingController.createBooking);
router5.get("/my-bookings", authMiddleware("STUDENT" /* STUDENT */), BookingController.getMyBookings);
router5.get("/:id", authMiddleware("STUDENT" /* STUDENT */), BookingController.getBookingById);
router5.get("/", authMiddleware("STUDENT" /* STUDENT */), BookingController.getAllBookings);
router5.get("/student/:studentId", BookingController.getBookingsByStudentId);
router5.get("/tutor/:tutorProfileId", BookingController.getBookingsByTutorProfileId);
router5.get("/upcoming", BookingController.getUpcomingBookings);
var BookingRouter = router5;

// src/module/student/student.route.ts
import express6 from "express";

// src/module/student/student.service.ts
var StudentService = {
  async studentBooking(payload, studentId) {
    const { tutorProfileId, bookingStatus, price } = payload;
    console.log("------ payload", payload);
    if (!tutorProfileId || !bookingStatus || !price) {
      throw new AppError(400, "Missing required fields");
    }
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorProfileId }
    });
    if (!tutor) throw new AppError(404, "Tutor not found");
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        tutorProfileId
        // startTime: { lt: end },
        // endTime: { gt: start }
      }
    });
    if (overlappingBooking) {
      throw new AppError(406, "This time slot is already booked");
    }
    const booking = await prisma.booking.create({
      data: {
        studentId,
        tutorProfileId,
        // startTime: start,
        // endTime: end,
        status: bookingStatus,
        price
      }
    });
    return booking;
  },
  // leave a review
  async leaveReview(studentId, payload) {
    const { bookingId, rating, comment } = payload;
    if (!bookingId || !rating) throw new AppError(400, " Missing required fields");
    if (rating < 1 || rating > 5) throw new AppError(400, "Rating must be between 1 and 5");
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId
      },
      include: {
        review: true,
        tutorProfile: true
      }
    });
    console.log("*******Booking ", booking);
    if (!booking) throw new AppError(404, "Booking not found");
    if (booking.status !== "CONFIRMED" /* CONFIRMED */ && booking.status !== "COMPLETED" /* COMPLETED */) throw new AppError(400, "You can only review completed sessions");
    if (booking.studentId !== studentId) throw new AppError(403, "You are not allowed to review this booking");
    if (booking.review) throw new AppError(409, "You have already reviewed this booking");
    const studReview = await prisma.review.create({
      data: {
        bookingId,
        rating,
        comment
      }
    });
    const tutorId = booking.tutorProfileId;
    const reviews = await prisma.review.findMany({
      where: {
        booking: {
          tutorProfileId: tutorId
        }
      }
    });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await prisma.tutorProfile.update({
      where: { id: tutorId },
      data: { rating: avgRating }
    });
    console.log("***********Review ", studReview);
    return studReview;
  },
  //! manage student profile
  // view own profile
  async getOwnProfile(studentId) {
    if (!studentId) {
      throw new AppError(401, "Unauthorized");
    }
    const found = await prisma.user.findUnique({
      where: { id: studentId }
    });
    if (!found) {
      throw new AppError(404, "Student not found");
    }
    if (found.role !== "STUDENT") {
      throw new AppError(403, "Only students can access this profile");
    }
    return found;
  },
  // update own profile
  async updateOwnProfile(studentId, payload) {
    if (!studentId) {
      throw new AppError(401, "Unauthorized");
    }
    const { name, phone } = payload;
    if (!name && !phone) {
      throw new AppError(400, "Nothing to update");
    }
    if (name !== void 0 && name.trim().length < 2) {
      throw new AppError(400, "Name must be at least 2 characters long");
    }
    if (phone !== void 0 && phone.trim().length < 10) {
      throw new AppError(400, "Invalid phone number");
    }
    const existingStudent = await prisma.user.findUnique({
      where: { id: studentId }
    });
    if (!existingStudent) {
      throw new AppError(404, "Student not found");
    }
    if (existingStudent.role !== "STUDENT") {
      throw new AppError(403, "Only students can update this profile");
    }
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: {
        ...name && { name },
        ...phone && { phone }
      }
    });
    return updatedStudent;
  },
  // delete own profile
  async deleteOwnProfile(studentId) {
    if (!studentId) {
      throw new AppError(401, "Unauthorized");
    }
    const existingStudent = await prisma.user.findUnique({
      where: { id: studentId }
    });
    if (!existingStudent) {
      throw new AppError(404, "Student not found");
    }
    if (existingStudent.role !== "STUDENT") {
      throw new AppError(403, "Only students can delete their account");
    }
    const deletedStudent = await prisma.user.delete({
      where: { id: studentId }
    });
    return deletedStudent;
  }
  //change password - done by better auth itselr
  //session 
};

// src/module/student/student.controller.ts
var StudentController = {
  //student booking
  studnentBooking: asyncHandler(
    async (req, res) => {
      console.log("HIT THE student controller");
      const studId = req.user?.id;
      console.log("STD", studId);
      if (!studId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({
        success: true,
        message: "booking successful",
        data: await StudentService.studentBooking(req.body, studId)
      });
    }
  ),
  leaveReview: asyncHandler(
    async (req, res) => {
      const studentId = req.user?.id;
      if (!studentId) throw new Error("Unauthorized");
      const { bookingId, rating, comment } = req.body;
      const data = {
        bookingId,
        rating,
        comment
      };
      const review = await StudentService.leaveReview(studentId, data);
      res.status(201).json({
        success: true,
        message: "Review submitted successfully",
        data: review
      });
    }
  ),
  viewOwnProfile: asyncHandler(
    async (req, res) => {
      const studenId = req.user?.id;
      console.log("STD", studenId);
      if (!studenId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({
        success: true,
        message: "student profile fetched successfully",
        data: await StudentService.getOwnProfile(studenId)
      });
    }
  ),
  updateOwnProfile: asyncHandler(
    async (req, res) => {
      const studenId = req.user?.id;
      console.log("STD", studenId);
      if (!studenId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({
        success: true,
        message: "student profile updated successfully",
        data: await StudentService.updateOwnProfile(studenId, req.body)
      });
    }
  ),
  deleteOwnProfile: asyncHandler(
    async (req, res) => {
      const studenId = req.user?.id;
      console.log("STD", studenId);
      if (!studenId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      res.status(200).json({
        success: true,
        message: "student profile deleted successfully",
        data: await StudentService.deleteOwnProfile(studenId)
      });
    }
  ),
  //session /api/auth/session", 
  sessionStd: asyncHandler(async (req, res) => {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return res.status(200).json(null);
    }
    const userId = session.user.id;
    const role = session.user.role;
    let bookings = [];
    let upcomingSessions = [];
    let totalBookings = 0;
    let upcomingCount = 0;
    if (role === "STUDENT") {
      bookings = await prisma.booking.findMany({
        where: { studentId: userId },
        include: {
          tutorProfile: {
            select: {
              id: true,
              name: true,
              bio: true,
              hourlyRate: true,
              rating: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      });
      upcomingSessions = await prisma.booking.findMany({
        where: {
          studentId: userId,
          status: "CONFIRMED",
          OR: [
            { startTime: { gte: /* @__PURE__ */ new Date() } },
            { startTime: null }
          ]
        },
        include: {
          tutorProfile: {
            select: { id: true, name: true }
          }
        },
        orderBy: { startTime: "asc" },
        take: 3
      });
      totalBookings = await prisma.booking.count({
        where: { studentId: userId }
      });
      upcomingCount = await prisma.booking.count({
        where: {
          studentId: userId,
          status: "CONFIRMED",
          OR: [
            { startTime: { gte: /* @__PURE__ */ new Date() } },
            { startTime: null }
          ]
        }
      });
    }
    if (role === "TUTOR") {
      const tutorProfile = await prisma.tutorProfile.findFirst({
        where: { userId }
      });
      if (tutorProfile) {
        bookings = await prisma.booking.findMany({
          where: { tutorProfileId: tutorProfile.id },
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          },
          orderBy: { createdAt: "desc" },
          take: 5
        });
        upcomingSessions = await prisma.booking.findMany({
          where: {
            tutorProfileId: tutorProfile.id,
            status: "CONFIRMED",
            OR: [
              { startTime: { gte: /* @__PURE__ */ new Date() } },
              { startTime: null }
            ]
          },
          include: {
            student: {
              select: { id: true, name: true }
            }
          },
          orderBy: { startTime: "asc" },
          take: 3
        });
        totalBookings = await prisma.booking.count({
          where: { tutorProfileId: tutorProfile.id }
        });
        upcomingCount = await prisma.booking.count({
          where: {
            tutorProfileId: tutorProfile.id,
            status: "CONFIRMED",
            OR: [
              { startTime: { gte: /* @__PURE__ */ new Date() } },
              { startTime: null }
            ]
          }
        });
      }
    }
    const formattedBookings = bookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      price: booking.price,
      startTime: booking.startTime,
      endTime: booking.endTime,
      createdAt: booking.createdAt,
      ...role === "STUDENT" ? {
        tutor: booking.tutorProfile ? {
          id: booking.tutorProfile.id,
          name: booking.tutorProfile.name,
          subject: booking.tutorProfile.bio ? booking.tutorProfile.bio.split(" ").slice(0, 3).join(" ") + "..." : "N/A",
          rate: booking.tutorProfile.hourlyRate
        } : null
      } : {
        student: booking.student ? {
          id: booking.student.id,
          name: booking.student.name,
          email: booking.student.email,
          phone: booking.student.phone
        } : null
      }
    }));
    const formattedUpcoming = upcomingSessions.map((b) => ({
      id: b.id,
      startTime: b.startTime,
      endTime: b.endTime,
      status: b.status,
      ...role === "STUDENT" ? { tutorName: b.tutorProfile?.name } : { studentName: b.student?.name }
    }));
    const enhancedSession = {
      ...session,
      stats: {
        totalBookings,
        upcomingCount,
        completedCount: totalBookings - upcomingCount,
        totalEarned: bookings.reduce(
          (sum, b) => sum + (b.price || 0),
          0
        )
      },
      recentBookings: formattedBookings,
      upcomingSessions: formattedUpcoming,
      user: {
        ...session.user,
        joinedDate: session.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "N/A"
      }
    };
    return res.status(200).json(enhancedSession);
  })
};

// src/module/student/student.route.ts
var router6 = express6.Router();
router6.post("/booking", authMiddleware("STUDENT" /* STUDENT */), StudentController.studnentBooking);
router6.post("/reviews", authMiddleware("STUDENT" /* STUDENT */), StudentController.leaveReview);
router6.get("/profile", authMiddleware("STUDENT" /* STUDENT */), StudentController.viewOwnProfile);
router6.put("/update-profile", authMiddleware("STUDENT" /* STUDENT */), StudentController.updateOwnProfile);
router6.put("/delete-profile", authMiddleware("STUDENT" /* STUDENT */), StudentController.deleteOwnProfile);
router6.get("/auth/session", StudentController.sessionStd);
var StudentRouter = router6;

// src/module/admin/admin.route.ts
import express7 from "express";

// src/module/admin/admin.service.ts
var AdminService = {
  async getAllUsers() {
    const users = await prisma.user.findMany({
      include: {
        tutorProfile: {
          include: {
            categories: {
              include: {
                category: true
              }
            },
            availabilities: true,
            bookings: true
          }
        },
        studentBookings: true
      }
    });
    return users;
  },
  //updarte status
  async updateUser_Status(userId, status) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log("user", user);
    if (!user) {
      throw new AppError(404, "User not found");
    }
    return prisma.user.update({
      where: { id: userId },
      data: { status }
    });
  },
  //!ban / unban user
  async updateUserStatus(adminId, targetUserId, status) {
    const user = await prisma.user.findUnique({
      where: {
        id: targetUserId
      }
    });
    console.log("**** Target user ", user);
    if (!user) throw new AppError(404, "User not found");
    if (adminId === targetUserId) throw new AppError(400, "You cannot change your own status");
    if (user.role === "ADMIN" /* ADMIN */) throw new AppError(403, "You cannot ban another admin");
    if (user.status === status) throw new AppError(400, `User is already ${status.toLowerCase()}`);
    const result = await prisma.user.update({
      where: {
        id: targetUserId
      },
      data: {
        status
      }
    });
    return result;
  },
  //all bookings
  async getAllBookings() {
    return prisma.booking.findMany({
      orderBy: {
        createdAt: "desc"
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        },
        tutorProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                status: true
              }
            }
          }
        },
        review: true
      }
    });
  },
  //!manage categories
  //create categorye
  async createCategory(payload) {
    const { name, description } = payload;
    if (!name || name.trim() === "") {
      throw new AppError(400, "Category name is required");
    }
    const normalizedName = name.trim();
    if (normalizedName.length < 3) {
      throw new AppError(400, "Category name must be at least 3 characters long");
    }
    if (normalizedName.length > 50) {
      throw new AppError(400, "Category name cannot exceed 50 characters");
    }
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: normalizedName,
          mode: "insensitive"
        }
      }
    });
    if (existingCategory) {
      if (!existingCategory.isActive) {
        throw new AppError(
          400,
          "Category already exists but is inactive. Consider reactivating it."
        );
      }
      throw new AppError(409, "Category already exists");
    }
    return await prisma.category.create({
      data: {
        name: normalizedName,
        description
      }
    });
  },
  //get all categories
  async getAllCategories(includeInactive = true) {
    return await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: "desc" }
    });
  },
  //update category
  async updateCategory(categoryId, payload) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    if (payload.name) {
      const normalizedName = payload.name.trim();
      if (normalizedName.length < 3) {
        throw new AppError(400, "Category name must be at least 3 characters");
      }
      const existing = await prisma.category.findFirst({
        where: {
          name: {
            equals: normalizedName,
            mode: "insensitive"
          },
          NOT: { id: categoryId }
        }
      });
      if (existing) {
        throw new AppError(409, "Another category with this name already exists");
      }
      payload.name = normalizedName;
    }
    return await prisma.category.update({
      where: { id: categoryId },
      data: payload
    });
  },
  //Deactivate category (not deleting)
  async deactivateCategory(categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    if (!category.isActive) {
      throw new AppError(400, "Category is already inactive");
    }
    return await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false }
    });
  },
  //hard delete category
  async deleteCategory(categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: { tutors: true }
    });
    if (!category) {
      throw new AppError(404, "Category not found");
    }
    if (category.tutors.length > 0) {
      throw new AppError(
        400,
        "Cannot delete category because tutors are using it"
      );
    }
    return await prisma.category.delete({
      where: { id: categoryId }
    });
  },
  //!-------------Users Management
  // 1. Get all users                - DONE
  // async getAllUsers() {
  //     return prisma.user.findMany({
  //         include: {
  //             studentBookings: true,
  //             tutorProfile: true,
  //         },
  //     });
  // },
  // 2. Get single user with bookings
  async getStudentDetails(userId) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentBookings: {
          include: {
            tutorProfile: {
              include: {
                categories: true,
                availabilities: true
              }
            }
          }
        },
        tutorProfile: false
        // not needed for student-only view
      }
    });
  },
  async getTutorDetails(userId) {
    return prisma.tutorProfile.findUnique({
      where: { id: userId },
      include: {
        bookings: {
          include: {
            student: true
          }
        },
        categories: true,
        availabilities: true
      }
    });
  },
  // 3. Update user info
  async updateUserInfo(userId, data) {
    return prisma.user.update({
      where: { id: userId },
      data
    });
  },
  // 4. Change user role
  async updateUserRole(userId, role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role }
    });
  },
  // 5. Soft delete user
  async softDeleteUser(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { status: "INACTIVE" }
    });
  }
};

// src/module/admin/admin.controller.ts
var AdminController = {
  viewAllUsers: asyncHandler(async (req, res) => {
    const users = await AdminService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "All users retrieved successfully",
      data: users
    });
  }),
  //update status
  updateUserStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      throw new AppError(400, "Status is required");
    }
    const updatedUser = await AdminService.updateUser_Status(id, status);
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser
    });
  }),
  //ban user
  banUser: asyncHandler(
    async (req, res) => {
      console.log("***\u{1F525} Admin hit");
      const adminId = req?.user?.id;
      console.log("Admin id", adminId);
      const { userId } = req.params;
      console.log("User id", userId);
      const result = await AdminService.updateUserStatus(
        adminId,
        userId,
        "BANNED" /* BANNED */
      );
      res.status(200).json({
        success: true,
        message: "User banned successfully",
        data: result
      });
    }
  ),
  unbanUser: asyncHandler(
    async (req, res) => {
      const adminId = req.user?.id;
      const { userId } = req.params;
      const result = await AdminService.updateUserStatus(
        adminId,
        userId,
        "ACTIVE" /* ACTIVE */
      );
      res.status(200).json({
        success: true,
        message: "User unbanned successfully",
        data: result
      });
    }
  ),
  //view all bookings
  getAllBookings: asyncHandler(async (_req, res) => {
    const bookings = await AdminService.getAllBookings();
    res.status(200).json({
      success: true,
      message: "All bookings retrieved successfully",
      data: bookings
    });
  }),
  //create category
  createCategory: asyncHandler(
    async (req, res) => {
      const payload = req.body;
      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: await AdminService.createCategory(payload)
      });
    }
  ),
  //see all categories
  getAllCategories: asyncHandler(
    async (req, res) => {
      const result = await AdminService.getAllCategories();
      if (result.length === 0) {
        res.status(200).json({
          success: true,
          message: "No categories found",
          // count: result.length,
          data: result
        });
      }
      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        count: result.length,
        data: result
      });
    }
  ),
  //update category
  updateCategory: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      const updated = await AdminService.updateCategory(id, req.body);
      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updated
      });
    }
  ),
  //deactivate category
  deactivateCategory: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      const result = await AdminService.deactivateCategory(id);
      res.status(200).json({
        success: true,
        message: "Category deactivated successfully",
        data: result
      });
    }
  ),
  //hard delete category
  deleteCategory: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      await AdminService.deleteCategory(id);
      res.status(200).json({
        success: true,
        message: "Category deleted permanently"
      });
    }
  ),
  //! user management
  // 1. Get all users
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await AdminService.getAllUsers();
    res.status(200).json({ success: true, data: users });
  }),
  // 2. Get single user by ID
  getStudent: asyncHandler(
    async (req, res) => {
      const { userId } = req.params;
      const student = await AdminService.getStudentDetails(userId);
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json({
        success: true,
        message: "Student details retrieved successfully",
        data: student
      });
    }
  ),
  getTutor: asyncHandler(
    async (req, res) => {
      const { userId } = req.params;
      const tutor = await AdminService.getTutorDetails(userId);
      if (!tutor) return res.status(404).json({ message: "Tutor not found" });
      res.status(200).json({
        success: true,
        message: "tutor details retrieved successfully",
        data: tutor
      });
    }
  ),
  // // 3. Update user info (name, email, phone)
  // updateUser: asyncHandler(async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const { name, email, phone } = req.body;
  //     const updatedUser = await AdminService.updateUserInfo(id as string, { name, email, phone });
  //     res.status(200).json({ success: true, data: updatedUser });
  // }),
  // // 4. Change user role
  // changeUserRole: asyncHandler(async (req: Request, res: Response) => {
  //     const { id } = req.params;
  //     const { role } = req.body;
  //     const updatedUser = await AdminService.updateUserRole(id as string, role);
  //     res.status(200).json({ success: true, data: updatedUser });
  // }),
  // 5. Soft delete user (set status to INACTIVE)
  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deletedUser = await AdminService.softDeleteUser(id);
    res.status(200).json({
      success: true,
      message: "User has been set to INACTIVE",
      data: deletedUser
    });
  })
};

// src/module/admin/admin.route.ts
var router7 = express7.Router();
router7.get(
  "/users",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.viewAllUsers
);
router7.post(
  "/categories",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.createCategory
);
router7.patch(
  "/users/:userId/ban",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.banUser
);
router7.patch(
  "/users/:userId/unban",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.unbanUser
);
router7.get(
  "/bookings",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.getAllBookings
);
router7.get(
  "/categories",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.getAllCategories
);
router7.patch(
  "/categories/:id",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.updateCategory
);
router7.patch(
  "/users/:id",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.updateUserStatus
);
router7.patch(
  "/categories/:id/deactivate",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.deactivateCategory
);
router7.delete(
  "/categories/:id",
  authMiddleware("ADMIN" /* ADMIN */),
  AdminController.deleteCategory
);
router7.get("/student/:userId", authMiddleware("ADMIN" /* ADMIN */), AdminController.getStudent);
router7.get("/tutor/:userId", authMiddleware("ADMIN" /* ADMIN */), AdminController.getTutor);
var AdminRouter = router7;

// src/module/public/public.route.ts
import { Router } from "express";

// src/module/public/public.service.ts
var PublicService = {
  // Get tutors with optional filters
  async browseTutors(filters) {
    const { categoryId, minRating, maxPrice, search } = filters;
    return await prisma.tutorProfile.findMany({
      where: {
        AND: [
          categoryId ? {
            categories: {
              some: { categoryId }
            }
          } : {},
          minRating !== void 0 ? {
            rating: { gte: minRating }
          } : {},
          maxPrice !== void 0 ? {
            hourlyRate: { lte: maxPrice }
          } : {},
          search ? {
            name: { contains: search, mode: "insensitive" }
          } : {}
        ]
      },
      include: {
        user: true,
        categories: { include: { category: true } },
        availabilities: true,
        bookings: true
      }
    });
  },
  // Get tutor by id (detailed profile)
  async getTutorById(tutorId) {
    return await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      include: {
        user: true,
        categories: { include: { category: true } },
        availabilities: true,
        bookings: {
          include: { review: true }
        }
      }
    });
  },
  // Featured tutors (e.g., highest rating)
  async getFeaturedTutors(limit = 5) {
    return await prisma.tutorProfile.findMany({
      orderBy: { rating: "desc" },
      take: limit,
      include: {
        user: true,
        categories: { include: { category: true } }
      }
    });
  },
  //!get all categories
  async getAllCategories(includeInactive = true) {
    return await prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: "desc" }
    });
  }
};

// src/module/public/public.controller.ts
var PublicController = {
  // 1. Browse tutors with optional query filters
  browseTutors: asyncHandler(
    async (req, res) => {
      const { categoryId, minRating, maxPrice, search } = req.query;
      const tutors = await PublicService.browseTutors({
        categoryId,
        minRating: minRating ? Number(minRating) : void 0,
        maxPrice: maxPrice ? Number(maxPrice) : void 0,
        search
      });
      res.status(200).json({
        success: true,
        data: tutors
      });
    }
  ),
  // 2. Tutor detail by tutor profile id
  getTutorDetail: asyncHandler(
    async (req, res) => {
      const { id } = req.params;
      const tutor = await PublicService.getTutorById(id);
      if (!tutor) {
        return res.status(404).json({
          success: false,
          message: "Tutor not found"
        });
      }
      res.status(200).json({
        success: true,
        data: tutor
      });
    }
  ),
  // 3. Featured tutors
  featuredTutors: asyncHandler(
    async (req, res) => {
      const limit = req.query.limit ? Number(req.query.limit) : void 0;
      const tutors = await PublicService.getFeaturedTutors(limit);
      res.status(200).json({
        success: true,
        data: tutors
      });
    }
  ),
  //!gt all categories
  //see all categories
  getAllCategories: asyncHandler(
    async (req, res) => {
      const result = await PublicService.getAllCategories();
      if (result.length === 0) {
        res.status(200).json({
          success: true,
          message: "No categories found",
          // count: result.length,
          data: result
        });
      }
      res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        count: result.length,
        data: result
      });
    }
  )
};

// src/module/public/public.route.ts
var router8 = Router();
router8.get("/tutors", PublicController.browseTutors);
router8.get("/tutors/:id", PublicController.getTutorDetail);
router8.get("/categories", PublicController.getAllCategories);
router8.get("/tutors/featured", PublicController.featuredTutors);
var PublicRouter = router8;

// src/module/student/dashboard/dashboard.route.ts
import express8 from "express";

// src/module/student/dashboard/dashboard.service.ts
var StudentDashboardService = {
  async getDashboardSummary(studentId) {
    const totalBookings = await prisma.booking.count({
      where: { studentId }
    });
    const upcomingBookings = await prisma.booking.count({
      where: { studentId, startTime: { gt: /* @__PURE__ */ new Date() } }
    });
    const completedBookings = await prisma.booking.count({
      where: { studentId, status: "COMPLETED" }
    });
    const cancelledBookings = await prisma.booking.count({
      where: { studentId, status: "CANCELLED" }
    });
    const allBookings = await prisma.booking.findMany({
      where: { studentId },
      select: {
        startTime: true,
        endTime: true,
        price: true,
        tutorProfile: {
          select: {
            id: true,
            categories: true
            // assuming you have subject field in TutorProfile
          }
        },
        review: {
          select: { rating: true }
        }
      }
    });
    let totalHours = 0;
    let totalSpent = 0;
    let ratingSum = 0;
    let ratingCount = 0;
    const tutorCountMap = {};
    const subjectCountMap = {};
    allBookings.forEach((b) => {
      const duration = (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) / (1e3 * 60 * 60);
      totalHours += duration;
      totalSpent += b.price;
      if (b.review?.rating) {
        ratingSum += b.review.rating;
        ratingCount += 1;
      }
      if (b.tutorProfile?.id) {
        tutorCountMap[b.tutorProfile.id] = (tutorCountMap[b.tutorProfile.id] || 0) + 1;
      }
      if (b.tutorProfile?.categories) {
        b.tutorProfile.categories.forEach((category) => {
          subjectCountMap[category.id] = (subjectCountMap[category.id] || 0) + 1;
        });
      }
    });
    const averageRating = ratingCount > 0 ? ratingSum / ratingCount : 0;
    const favoriteTutorId = Object.entries(tutorCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const favoriteSubject = Object.entries(subjectCountMap).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    return {
      totalBookings,
      upcomingBookings,
      completedBookings,
      cancelledBookings,
      totalHours,
      totalSpent,
      averageRating,
      favoriteTutorId,
      favoriteSubject
    };
  },
  //upcoming sessions
  async getUpcomingBookings(studentId, { limit = 5, startDate, endDate }) {
    return prisma.booking.findMany({
      where: {
        studentId,
        startTime: {
          gt: startDate ? new Date(startDate) : /* @__PURE__ */ new Date(),
          lte: endDate ? new Date(endDate) : void 0
        }
      },
      orderBy: { startTime: "asc" },
      take: Number(limit),
      include: {
        tutorProfile: {
          select: {
            id: true,
            hourlyRate: true,
            user: { select: { name: true, image: true } }
          }
        }
      }
    });
  },
  // Recent Bookings History
  async getRecentBookings(studentId, options) {
    const { page = 1, limit = 10, status, dateRange } = options;
    const skip = (page - 1) * limit;
    return prisma.booking.findMany({
      where: {
        studentId,
        status,
        createdAt: dateRange ? { gte: new Date(dateRange) } : void 0
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
      include: {
        tutorProfile: {
          select: {
            categories: true,
            user: { select: { name: true } }
          }
        },
        review: true
      }
    });
  },
  //pending reviews
  async getPendingReviews(studentId) {
    return prisma.booking.findMany({
      where: {
        studentId,
        status: "COMPLETED",
        review: null
      },
      include: {
        tutorProfile: {
          select: {
            categories: true,
            user: { select: { name: true } }
          }
        }
      }
    });
  },
  //learning progress
  async getLearningProgress(studentId) {
    const bookings = await prisma.booking.findMany({
      where: {
        studentId,
        status: "COMPLETED"
      },
      include: {
        tutorProfile: {
          select: {
            categories: true
          }
        }
      }
    });
    const bySubjectMap = {};
    bookings.forEach((b) => {
      const hours = (b.endTime.getTime() - b.startTime.getTime()) / 36e5;
      b.tutorProfile.categories.forEach((category) => {
        const subject = category.id;
        if (!bySubjectMap[subject]) {
          bySubjectMap[subject] = {
            subject,
            hours: 0,
            sessions: 0,
            proficiency: 0,
            lastSession: b.endTime
          };
        }
        bySubjectMap[subject].hours += hours;
        bySubjectMap[subject].sessions += 1;
        bySubjectMap[subject].lastSession = b.endTime;
      });
    });
    const bySubject = Object.values(bySubjectMap).map((s) => ({
      ...s,
      proficiency: Math.min(100, s.sessions * 10)
    }));
    return { bySubject };
  },
  //financial summay
  async getFinancialSummary(studentId) {
    const bookings = await prisma.booking.findMany({
      where: {
        studentId,
        status: "COMPLETED"
      }
    });
    const totalSpent = bookings.reduce((sum, b) => sum + b.price, 0);
    const averageSessionCost = bookings.length ? totalSpent / bookings.length : 0;
    return {
      totalSpent,
      averageSessionCost,
      paymentHistory: bookings.map((b) => ({
        date: b.createdAt,
        amount: b.price,
        bookingId: b.id,
        method: "COD"
      }))
    };
  },
  //Booking Statistics
  async getBookingStats(studentId) {
    const bookings = await prisma.booking.findMany({
      where: { studentId }
    });
    const byStatus = {};
    const byDay = {};
    const byHour = {};
    let cancelled = 0;
    bookings.forEach((b) => {
      byStatus[b.status] = (byStatus[b.status] || 0) + 1;
      const day = b.startTime.toLocaleDateString("en-US", { weekday: "short" });
      byDay[day] = (byDay[day] || 0) + 1;
      const hour = b.startTime.getHours();
      byHour[hour] = (byHour[hour] || 0) + 1;
      if (b.status === "CANCELLED") cancelled++;
    });
    return {
      byStatus: Object.entries(byStatus).map(([status, count]) => ({ status, count })),
      byDayOfWeek: Object.entries(byDay).map(([day, count]) => ({ day, count })),
      byTimeOfDay: Object.entries(byHour).map(([hour, count]) => ({
        hour: Number(hour),
        count
      })),
      cancellationRate: bookings.length ? cancelled / bookings.length : 0
    };
  },
  // quick actions
  async getQuickActions(studentId) {
    const [pendingReviews, upcomingToday] = await Promise.all([
      prisma.booking.count({
        where: { studentId, status: "COMPLETED", review: null }
      }),
      prisma.booking.count({
        where: {
          studentId,
          startTime: {
            gte: new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)),
            lte: new Date((/* @__PURE__ */ new Date()).setHours(23, 59, 59, 999))
          }
        }
      })
    ]);
    return {
      pendingConfirmations: 0,
      pendingReviews,
      upcomingSessionsToday: upcomingToday,
      outstandingPayments: 0,
      unreadNotifications: 0
    };
  },
  //Search & Filter Bookings
  async searchBookings(studentId, filters) {
    return prisma.booking.findMany({
      where: {
        studentId,
        status: filters.status,
        tutorProfileId: filters.tutorId,
        createdAt: {
          gte: filters.dateFrom && new Date(filters.dateFrom),
          lte: filters.dateTo && new Date(filters.dateTo)
        }
      },
      include: {
        tutorProfile: {
          select: {
            categories: true,
            user: { select: { name: true } }
          }
        }
      }
    });
  },
  // export bookings
  async getBookingsForExport(studentId, filters) {
    return prisma.booking.findMany({
      where: {
        studentId,
        createdAt: {
          gte: filters.dateFrom ? new Date(filters.dateFrom) : void 0,
          lte: filters.dateTo ? new Date(filters.dateTo) : void 0
        }
      },
      include: {
        tutorProfile: {
          select: {
            categories: true,
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
};

// src/module/student/dashboard/dashboard.controller.ts
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
var StudentDashboardController = {
  dashboardSummary: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized access: User not found");
    }
    const studentId = req.user.id;
    const data = await StudentDashboardService.getDashboardSummary(studentId);
    console.log("DATA ----", data);
    res.status(200).json({
      success: true,
      message: "Dashboard summary retrieved",
      data
    });
  }),
  //upccming bookings
  getUpcomingBookings: asyncHandler(
    async (req, res) => {
      if (!req.user) {
        throw new AppError(401, "Unauthorized access: User not found");
      }
      const studentId = req.user.id;
      const bookings = await StudentDashboardService.getUpcomingBookings(
        studentId,
        req.query
      );
      res.status(200).json({
        success: true,
        count: bookings.length,
        message: "Upcoming bookings retrieved",
        data: bookings
      });
    }
  ),
  //recent bookings
  recentBookings: asyncHandler(
    async (req, res) => {
      if (!req.user) {
        throw new AppError(401, "Unauthorized access: User not found");
      }
      const studentId = req?.user.id;
      const data = await StudentDashboardService.getRecentBookings(
        studentId,
        req.query
      );
      res.status(200).json({
        success: true,
        count: data.length,
        message: "Recent bookings retrieved",
        data
      });
    }
  ),
  //pending Reviews
  pendingReviews: asyncHandler(
    async (req, res) => {
      if (!req.user) {
        throw new AppError(401, "Unauthorized access: User not found");
      }
      const studentId = req?.user.id;
      const data = await StudentDashboardService.getPendingReviews(studentId);
      res.status(200).json({
        success: true,
        count: data.length,
        message: "Pending reviews retrieved",
        data
      });
    }
  ),
  //learning progress
  learningProgress: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    const data = await StudentDashboardService.getLearningProgress(req.user.id);
    res.status(200).json({
      success: true,
      message: "Learning progress retrieved",
      data
    });
  }),
  //financial summary
  financialSummary: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new AppError(401, "Unauthorized");
    }
    const data = await StudentDashboardService.getFinancialSummary(req.user.id);
    res.status(200).json({
      success: true,
      message: "Financial summary retrieved",
      data
    });
  }),
  //booking stats
  bookingStats: asyncHandler(async (req, res) => {
    if (!req.user) throw new AppError(401, "Unauthorized");
    const data = await StudentDashboardService.getBookingStats(req.user.id);
    res.status(200).json({
      success: true,
      message: "Booking statistics retrieved",
      data
    });
  }),
  //quick stats
  quickActions: asyncHandler(async (req, res) => {
    if (!req.user) throw new AppError(401, "Unauthorized");
    const data = await StudentDashboardService.getQuickActions(req.user.id);
    res.status(200).json({
      success: true,
      message: "Quick actions retrieved",
      data
    });
  }),
  //search & Filter bookings
  searchBookings: asyncHandler(async (req, res) => {
    if (!req.user) throw new AppError(401, "Unauthorized");
    const data = await StudentDashboardService.searchBookings(
      req.user.id,
      req.query
    );
    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  }),
  //export bookings
  exportBookings: asyncHandler(
    async (req, res) => {
      if (!req.user) {
        throw new AppError(401, "Unauthorized");
      }
      const { format = "csv", dateFrom, dateTo } = req.query;
      const bookings = await StudentDashboardService.getBookingsForExport(
        req.user.id,
        { dateFrom, dateTo }
      );
      if (!bookings.length) {
        throw new AppError(404, "No bookings found");
      }
      if (format === "csv") {
        const fields = [
          "id",
          "status",
          "price",
          "startTime",
          "endTime",
          "tutor",
          "subject"
        ];
        const data = bookings.map((b) => ({
          id: b.id,
          status: b.status,
          price: b.price,
          startTime: b.startTime,
          endTime: b.endTime,
          tutor: b.tutorProfile.user.name,
          subject: b.tutorProfile.categories
        }));
        const parser = new Parser({ fields });
        const csv = parser.parse(data);
        res.header("Content-Type", "text/csv");
        res.attachment("bookings.csv");
        return res.send(csv);
      }
      if (format === "pdf") {
        const doc = new PDFDocument({ margin: 40 });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=bookings.pdf"
        );
        doc.pipe(res);
        doc.fontSize(18).text("Booking History", { align: "center" });
        doc.moveDown();
        bookings.forEach((b, i) => {
          doc.fontSize(12).text(`${i + 1}. Tutor: ${b.tutorProfile.user.name}`).text(`   Subject: ${b.tutorProfile.categories}`).text(`   Status: ${b.status}`).text(`   Price: $${b.price}`).text(`   Time: ${b.startTime.toISOString()} \u2192 ${b.endTime.toISOString()}`).moveDown();
        });
        doc.end();
        return;
      }
      throw new AppError(400, "Invalid export format");
    }
  )
};

// src/module/student/dashboard/dashboard.route.ts
var router9 = express8.Router();
router9.get("/", authMiddleware("STUDENT" /* STUDENT */), StudentDashboardController.dashboardSummary);
router9.get(
  "/bookings/upcoming",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.getUpcomingBookings
);
router9.get(
  "/bookings/recent",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.recentBookings
);
router9.get(
  "/bookings/pending-reviews",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.pendingReviews
);
router9.get(
  "/analytics/progress",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.learningProgress
);
router9.get(
  "/financial/summary",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.financialSummary
);
router9.get(
  "/analytics/booking-stats",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.bookingStats
);
router9.get(
  "/quick-actions",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.quickActions
);
router9.get(
  "/bookings/search",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.searchBookings
);
router9.get(
  "/bookings/export",
  authMiddleware("STUDENT" /* STUDENT */),
  StudentDashboardController.exportBookings
);
var StudentDashboardRouter = router9;

// src/module/tutor/dashboard/dashboard.route.ts
import { Router as Router2 } from "express";

// src/module/tutor/dashboard/dashboard.service.ts
var TutorDashboardService = {
  async getSimpleStats(id) {
    console.log("USE ID ", id);
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId: id },
      include: {
        categories: true,
        bookings: true
      }
    });
    console.log(tutor);
    if (!tutor) {
      throw new Error("Tutor profile not found");
    }
    return {
      tutorName: tutor.name,
      hourlyRate: tutor.hourlyRate,
      experienceYears: tutor.experienceYears,
      rating: tutor.rating ?? 0,
      totalCategories: tutor.categories.length,
      totalBookings: tutor.bookings.length
    };
  },
  async getReviewSummary(tutorProfileId) {
    const reviews = await prisma.review.findMany({
      where: { booking: { tutorProfileId } }
    });
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.rating]++;
    });
    return distribution;
  },
  async getTutorStats(userId) {
    const tutor = await prisma.tutorProfile.findUnique({
      where: { userId },
      include: {
        bookings: true
        // to calculate conversion
      }
    });
    if (!tutor) {
      throw new Error("Tutor profile not found");
    }
    const totalBookings = tutor.bookings.length;
    const confirmedBookings = tutor.bookings.filter(
      (b) => b.status.toLowerCase() === "confirmed"
    ).length;
    const conversionRate = totalBookings === 0 ? 0 : Math.round(confirmedBookings / totalBookings * 100);
    return {
      averageRating: tutor.rating ?? 0,
      conversionRate
    };
  }
};

// src/module/tutor/dashboard/dashboard.controller.ts
var TutorDashboardController = {
  getBasicStats: asyncHandler(
    async (req, res) => {
      const userId = req?.user?.id;
      if (!userId) {
        throw new AppError(401, "User ID is missing or unauthorized");
      }
      const data = await TutorDashboardService.getSimpleStats(userId);
      return res.json({
        success: true,
        data
      });
    }
  ),
  summary: asyncHandler(async (req, res) => {
    const tutorProfileId = req.user?.id;
    if (!tutorProfileId) {
      throw new AppError(401, "Unauthorized");
    }
    console.log("tutorProfileId", tutorProfileId);
    const data = await TutorDashboardService.getReviewSummary(tutorProfileId);
    res.status(200).json({
      success: true,
      data
    });
  }),
  getTutorStats: asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const stats = await TutorDashboardService.getTutorStats(userId);
    res.status(200).json({ success: true, data: stats });
  })
};

// src/module/tutor/dashboard/dashboard.route.ts
var router10 = Router2();
router10.get(
  "/",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorDashboardController.getBasicStats
);
router10.get(
  "/reviews/summary",
  authMiddleware("TUTOR" /* TUTOR */),
  TutorDashboardController.summary
);
router10.get("/stats", authMiddleware("TUTOR" /* TUTOR */), TutorDashboardController.getTutorStats);
var TutorDashboardRouter = router10;

// src/module/admin/dashboard/dashboard.route.ts
import { Router as Router3 } from "express";

// src/module/admin/dashboard/dashboard.service.ts
var AdminDashboardService = {
  async getPlatformAnalytics() {
    const totalUsers = await prisma.user.count();
    const studentsCount = await prisma.user.count({
      where: { role: "STUDENT" }
    });
    const tutorsCount = await prisma.user.count({
      where: { role: "TUTOR" }
    });
    const totalBookings = await prisma.booking.count();
    const confirmedBookings = await prisma.booking.count({
      where: { status: "CONFIRMED" }
    });
    const cancelledBookings = await prisma.booking.count({
      where: { status: "CANCELLED" }
    });
    const completedBookings = await prisma.booking.count({
      where: { status: "COMPLETED" }
    });
    const revenueAgg = await prisma.booking.aggregate({
      where: { status: "COMPLETED" },
      _sum: { price: true },
      _avg: { price: true }
    });
    const totalRevenue = revenueAgg._sum.price || 0;
    const averageBookingPrice = revenueAgg._avg.price || 0;
    const activeUsers = await prisma.user.count({
      where: {
        studentBookings: {
          some: {}
        }
      }
    });
    const completionRate = totalBookings === 0 ? 0 : completedBookings / totalBookings * 100;
    return {
      users: {
        total: totalUsers,
        students: studentsCount,
        tutors: tutorsCount
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings
      },
      revenue: {
        totalRevenue,
        averageBookingPrice
      },
      platformHealth: {
        activeUsers,
        completionRate: Number(completionRate.toFixed(2))
      }
    };
  },
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        studentBookings: {
          select: { id: true }
        },
        tutorProfile: {
          select: { id: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  },
  //  Verification stats
  async getVerificationSummary() {
    const [verified, unverified] = await Promise.all([
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.count({ where: { emailVerified: false } })
    ]);
    return {
      verified,
      pending: unverified
    };
  },
  // 3. Update user status
  async updateUserStatus(userId, status) {
    return prisma.user.update({
      where: { id: userId },
      data: { status }
    });
  },
  // 4. Update user role
  async updateUserRole(userId, role) {
    return prisma.user.update({
      where: { id: userId },
      data: { role }
    });
  },
  // 5. Export users (CSV-ready)
  async exportUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true
      }
    });
  }
};

// src/module/admin/dashboard/dashboard.controller.ts
var AdminDasbhoardController = {
  getPlatformAnalytics: asyncHandler(
    async (req, res) => {
      const data = await AdminDashboardService.getPlatformAnalytics();
      res.status(200).json({
        success: true,
        data
      });
    }
  ),
  getUsers: asyncHandler(async (req, res) => {
    const users = await AdminDashboardService.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  }),
  // GET /api/admin/users/verification-summary
  verificationSummary: asyncHandler(async (req, res) => {
    const data = await AdminDashboardService.getVerificationSummary();
    res.status(200).json({
      success: true,
      data
    });
  }),
  // PATCH /api/admin/users/:id/status
  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = await AdminDashboardService.updateUserStatus(id, status);
    res.status(200).json({
      success: true,
      message: "User status updated",
      data: user
    });
  }),
  // PATCH /api/admin/users/:id/role
  updateRole: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const user = await AdminDashboardService.updateUserRole(id, role);
    res.status(200).json({
      success: true,
      message: "User role updated",
      data: user
    });
  }),
  // GET /api/admin/users/export
  exportUsers: asyncHandler(async (req, res) => {
    const users = await AdminDashboardService.exportUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  })
};

// src/module/admin/dashboard/dashboard.route.ts
var router11 = Router3();
router11.get("/", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.getPlatformAnalytics);
router11.get("/users", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.getUsers);
router11.get("/verification-summary", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.verificationSummary);
router11.patch("/:id/status", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.updateStatus);
router11.patch("/:id/role", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.updateRole);
router11.get("/export", authMiddleware("ADMIN" /* ADMIN */), AdminDasbhoardController.exportUsers);
var AdminDashboardRouter = router11;

// src/router/index.ts
var route = Router4();
route.use("/category", CategoriesRouter);
route.use("/tutor", TutorRouter);
route.use("/tutor-category", TutorCategoryRouter);
route.use("/tutor-availability", TutorAvailabilityRouter);
route.use("/bookings", BookingRouter);
route.use("/student", StudentRouter);
route.use("/admin", AdminRouter);
route.use("/public", PublicRouter);
route.use("/student/dashboard", StudentDashboardRouter);
route.use("/tutor/dashboard", TutorDashboardRouter);
route.use("/admin/dashboard", AdminDashboardRouter);
var router_default = route;

// src/middleware/globalErrorHandler.ts
function globalError(err, req, res, next) {
  const requestInfo = {
    method: req.method,
    path: req.originalUrl,
    time: (/* @__PURE__ */ new Date()).toLocaleString()
    // params: req.params,
    // query: req.query,
    // body: req.body
  };
  if (res.headersSent) {
    return next(err);
  }
  let status = 500;
  let message = "Internal Server Error";
  if (err instanceof AppError) {
    status = err.statusCode;
    message = err.message;
  } else if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    status = 400;
    message = "You have provided incorrect fieled type or missing field";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      status = 400;
      message = "The specific record you are trying to access or modify does not exist.";
    } else if (err.code === "P2002") {
      status = 400;
      message = "Unique constraint failed";
    } else if (err.code === "P2003") {
      status = 400;
      message = "Foreign key constraint failed";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    status = 500;
    message = "Error occurred during query execution";
  }
  console.log("Error ", err);
  res.status(status).json({
    success: false,
    message,
    requestInfo
  });
}

// src/app.ts
var app = express9();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.use(express9.json());
app.get("/api/auth/session", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return res.status(200).json(null);
    return res.status(200).json(session);
  } catch (err) {
    return res.status(500).json({ error: "Failed to get session" });
  }
});
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api", router_default);
app.get("/", (req, res) => {
  res.send("Hello Backend!");
});
app.use(globalError);

// src/server.ts
var port = process.env.PORT || 3e3;
if (process.env.NODE_ENV !== "production") {
  async function main() {
    try {
      await prisma.$connect();
      console.log("\u{1F44D} DB Connected");
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    } catch (error) {
      console.log("\u{1F44E} Connectin failed", error);
      await prisma.$disconnect();
      process.exit(1);
    }
  }
  main();
}
var server_default = app;
export {
  server_default as default
};
//! update tutor profile
//!create
//! get available slots by tutor profile id
//!update availability slot
//!my bookings
//!get booking details by id
//!user managerment routes
//!get all categories
