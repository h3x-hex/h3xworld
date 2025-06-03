import authConfig from "./auth.config";
import NextAuth from "next-auth";
import { privateRoutes } from "./routes";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {

    const isLoggedIn = !!req.auth;
    const { nextUrl } = req;
    const url = 'http://localhost:3000'
    const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
    const isAuthRoute = nextUrl.pathname.includes('/auth');
    const isApiRoute = nextUrl.pathname.includes('/api');

    if(isApiRoute) return;

    if(isAuthRoute && !isLoggedIn) return;

    //if(!isLoggedIn && isPrivateRoute) return Response.redirect(`${url}/auth/login`);

    //if(isLoggedIn && isAuthRoute) return Response.redirect(`${url}/home`);
})

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}