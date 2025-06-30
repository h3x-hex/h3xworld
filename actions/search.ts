'use server'

import { prisma } from '@/prisma/prisma'

export const searchUsers = async (query: string) => {
  if (!query) return []

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: { id: true, username: true, name: true },
    })
    return users
  } catch (error) {
    console.log(error)
    return []
  }
}
