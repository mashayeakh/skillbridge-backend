import { prisma } from "../../../lib/prisma";


export const getAppUserId = async (authUserId: string) => {
    const user = await prisma.account.findFirst({
        where: {
            providerId: authUserId,
        },

    },
    );


    console.log("USER ", user)

    if (!user) {
        throw new Error("User not found in database");
    }

    return user.id;
};
