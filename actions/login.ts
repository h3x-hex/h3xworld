"use server";

import * as z from "zod";
import { prisma } from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
// import { generateVerificationToken } from "@/lib/token";
// import { sendVerificationEmail } from "@/lib/mail";

export const loginAction = async (data: z.infer<typeof LoginSchema>) => {
  var usernameExists = false;
  var username = '';

  try {
    // Validate the input data
    const validatedData = LoginSchema.parse(data);

    //  If the data is invalid, return an error
    if (!validatedData) {
      return { error: "Invalid input data" };
    }

    //  Destructure the validated data
    const { email, password } = validatedData;

    // Hash the password
    //const hashedPassword = await bcrypt.hash(password, 10);

    // Check to see if user already exists
    const userExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });


    if (!userExists || !userExists.password || !userExists.email) {
      return { error: "User not found!" };
    }

    try {
      await signIn('credentials', {
        email: userExists.email,
        password: password,
        redirect: false,
      })
    } catch (error) {
        if (error instanceof AuthError)
        {
          console.log(error.type)
            switch (error.type)
            {
              case 'CredentialsSignin':
                return { error: "Invalid Credentials" };
              default:
                return { error: "Please confirm your email address"};
            }
        }

        throw error;
    }
    
    if(userExists.username != null) 
    {
      usernameExists = true;
      username = userExists.username;
    }

    console.log(userExists)
    
    if(userExists)
    {
      const { password , ...userObj } = userExists;

      return { success: userObj }
    }

    //return { success: "User Logged In Successfully!" }

    // Generate Verification Token
    // const verificationToken = await generateVerificationToken(email);

    // await sendVerificationEmail(lowerCaseEmail, verificationToken.token);

    //return { success: "Email Verification was sent" };
  } catch (error) {
    // Handle the error, specifically check for a 503 error
    console.error("Database error:", error);

    if ((error as { code: string }).code === "ETIMEDOUT") {
      return {
        error: "Unable to connect to the database. Please try again later.",
      };
    } else if ((error as { code: string }).code === "503") {
      return {
        error: "Service temporarily unavailable. Please try again later.",
      };
    } else {
      return { error: "An unexpected error occurred. Please try again later." };
    }
  }

  if(usernameExists)
  {
    redirect(`/${username}`)
  }
  else
  {
    redirect('/home')
  }
  //return redirect('/home')
};