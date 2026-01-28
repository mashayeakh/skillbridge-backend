import { betterAuth, email } from "better-auth";
import { NextFunction, Request, Response } from "express";
import { auth } from './../lib/auth';
import { Role } from "../types/role";

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

            if (session?.user.emailVerified === false) {
                return res.status(401).json({ message: "Email not verified" });
            }

            // // check role if roles were provided
            if (roles.length > 0 && !roles.includes(session.user.role as Role)) {
                return res.status(403).json({ message: "Forbidden: insufficient role" });
            }

            // Check role strictly
            // if (roles.length > 0 && !roles.includes(session.user.role as Role)) {
            //     return res.status(403).json({ message: "Forbidden: you must be adsdd tutor" });
            // }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                emailVerified: session.user.emailVerified,
                role: session.user.role as Role
            };

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
};
