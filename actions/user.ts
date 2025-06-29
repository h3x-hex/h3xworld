'use server'

import { getUserByEmail } from "@/data/user";
import { prisma } from "@/prisma/prisma"
import { ethers, Wallet } from "ethers";
import bcrypt from "bcryptjs";




export const checkUsernameExists = async (username: string) => {

    try {
        const usernameExists = await prisma.user.findFirst({
          where: {
            username: username,
          }
        })
        console.log(usernameExists);
        if(usernameExists != null)
        {
            console.log('Username Not Available')
            return { error: "Username Not Available"}
        }
        else {
            console.log('Username Available')
            return { success: "Username Available"}
        }
      } catch (error) {
        console.log(error)
        return { error: error }
      }

    return;
}

interface onboardPayload  {
  username: string,
  email: string,
  wallet: {},
  pin: string,
  address: string,
  accountAddress: string,
}

export const onboardUser = async (onboardPayload: onboardPayload) => {

  console.log('Onboarding')
  try {
    const existingUser = await getUserByEmail(onboardPayload.email)

    if(!existingUser) {
        return { error: "User not found" }
    }   
    
    const usernameExists = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        username: onboardPayload.username,
        wallet: onboardPayload.wallet,
        pin: onboardPayload.pin,
        address: onboardPayload.address,
        accountAddress: onboardPayload.accountAddress,
      },
    })
    console.log('Update:', usernameExists);

    return { success: 'Username Updated'};
    
  } catch (error) {
    console.log("Error:" , error)
    return { error: error }
  }

}

export const updateUsername = async (username: string, email: string) => {

    try {

        const existingUser = await getUserByEmail(email)


        if(!existingUser) {
            return { error: "User not found" }
        }   
        
        const usernameExists = await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            username: username,
          },
        })
        console.log('Update:', usernameExists);

        return { success: 'Username Updated'};
        
      } catch (error) {
        console.log("Error:" , error)
        return { error: error }
      }

}

interface SocialLink {
  platform: string
  url: string
}

interface Profile {
    name: string,
    username: string;
    profileImage: string;
    coverImage: string;
    bio: string;
    socialLinks: SocialLink[];
    plan: string;
    location: string;
    occupation: string;
}

export const editUser = async (email: string, profile: Profile) => {

    try {

        const existingUser = await getUserByEmail(email)


        if(!existingUser) {
            return { error: "User not found" }
        }   
        
        const usernameExists = await prisma.user.update({
          where: {
            id: existingUser.id,
          },
          data: {
            name: profile.name,
            username: profile.username,
          },
        })
        console.log('Update:', usernameExists);

        return { success: 'User Updated'};
        
      } catch (error) {
        console.log("Error:" , error)
        return { error: error }
      }

}
