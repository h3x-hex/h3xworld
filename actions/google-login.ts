'use server'

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function googleAuthenticate() {

    try {
        await signIn('google')
    } catch (error) {
        if (error instanceof AuthError) 
        {
            return 'Google Log In Failed'
        }

        throw error;
    }

    redirect('/home')

}