import { prisma } from "@/prisma/prisma"
export const getVerificationTokenByEmail = async (email: string) => {

    try {
        const verificationToken = await prisma.verificationToken.findFirst({
            where: {
                email: email
            }
        })

        return verificationToken;
    } catch (error) {
        console.log(error);
    }

}