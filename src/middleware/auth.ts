import { betterAuth, email } from "better-auth";
import { NextFunction, Request, Response } from "express";
import { auth } from './../lib/auth';
import { Role } from "../types/role";
import { accountStatus } from "../types/accStatus";
import { prisma } from "../lib/prisma";

export const authMiddleware = (...roles: Role[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // get the session 
            const session = await auth.api.getSession({
                headers: req.headers as any
            });
            console.log("--Session", session);

            if (!session) {
                return res.status(401).json({ message: "Unauthorized!!!!!!" });
            }

            // if (session?.user.emailVerified === false) {
            //     return res.status(401).json({ message: "Email not verified" });
            // }

            // // check role if roles were provided
            const user = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (!user || user.status === "BANNED") {
                return res.status(403).json({
                    message: "Your account has been banned"
                });
            }

            // Check role from database
            if (roles.length > 0) {
                const userRole = user.role as Role;
                const hasRequiredRole = roles.includes(userRole) || 
                                        (roles.includes(Role.STUDENT) && (userRole === Role.TUTOR || userRole === Role.ADMIN)) ||
                                        (roles.includes(Role.TUTOR) && userRole === Role.ADMIN);

                if (!hasRequiredRole) {
                    return res.status(403).json({ message: "Forbidden: insufficient role" });
                }
            }

            req.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                emailVerified: user.emailVerified,
                role: user.role as Role
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
