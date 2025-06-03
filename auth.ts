import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import authConfig from './auth.config';
import { prisma } from './prisma/prisma';
import { getUserByID } from './data/user';
import { getAccountByUserId } from './data/account';

export const { handlers: { GET, POST }, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: 'jwt' },
    ...authConfig,
    callbacks: {
        async signIn({ user, account }) {
            if ( account?.provider !== 'credentials') {
                return true;
            }
            if (!user.id) return false;
            const existingUser = await getUserByID(user.id ?? "");

            //if(!existingUser?.emailVerified) return false;

            return true;
        },
        async jwt({token}) {
            if(!token.sub) return token;

            const existingUser = await getUserByID(token.sub);

            if(!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);
            console.log(existingAccount);

            token.isOauth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;

            return token;
        },
        async session({ token, session }) {
            console.log("token", token)
            console.log("session", session)
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    isOauth: token.isOauth,
                }
            }
        }

    }
});
