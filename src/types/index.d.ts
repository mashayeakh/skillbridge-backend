import { Role } from "../types/role";
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                emailVerified: boolean;
                role: Role;
            }
        }
    }
}