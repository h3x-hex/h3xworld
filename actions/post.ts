'use server'

import { prisma } from "@/prisma/prisma"


export const hasUserLikedPost = async (postId: string, userId: string) => {
  const likeDoc = await prisma.like.findUnique({
    where: { postId },
  })

  if (!likeDoc) return false

  return likeDoc.userIds.includes(userId)
}

export const likePost = async (postId: string, userId: string, isLiked: boolean) => {

    try {
        const likeDoc = await prisma.like.findUnique({
            where: { postId },
        })
    
        if (!likeDoc)
        {
            await prisma.like.create({
                data: {
                    postId: postId,
                    userIds: [userId]
                }
            })
            return;
        }
        
        if(!isLiked)
        {
            await prisma.like.update({
                where: { postId },
                data: {
                  userIds: {
                    push: userId,
                  },
                },
            })
        }
        else 
        {
            await prisma.like.update({
                where: { postId },
                data: {
                  userIds: {
                    set: likeDoc.userIds.filter(id => id !== userId),
                  },
                },
            })
        }
          
    
    } catch (error) {
        console.log(error)
        return { error: error }
    }

}
