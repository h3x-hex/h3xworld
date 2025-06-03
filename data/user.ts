import { prisma } from "@/prisma/prisma";

export const defaultUser = {
    id: '',
    name: '',
    email: '',
    emailVerified: '',
    username: '',
    image: '',
    createdAt: null,
    updatedAt: null,
    accounts: [],
    links: [],
    products: [],
    categories: [],
    walletJSON: '',
    walletAddress: '',
}

export const getUserByID = async (id: string) => {

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        })
        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const getUserByEmail = async (email: string) => {
    try {
        const lowerCaseEmail = email.toLowerCase();
        const user = await prisma.user.findUnique({
            where: {
                email: lowerCaseEmail
            }
        })

        return user;
    } catch (error) {
        return null
    }
}

export const getUsernameByEmail = async (email: string) => {

    try {
  
        const existingUser = await getUserByEmail(email)
  
  
        if(!existingUser) {
            return { error: "User not found" }
        }   

        if(existingUser.username) return existingUser.username;
        
      } catch (error) {
        console.log(error)
        return { error: error}
      }
  
    return;
  }