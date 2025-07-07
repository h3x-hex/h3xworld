'use server'

import { prisma } from '@/prisma/prisma'
import { evmAddress } from '@lens-protocol/client';
import { usePosts } from "@lens-protocol/react";


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

export const searchPosts = async (query: string) => {
  if (!query) {
    return { users: [], posts: [], products: [], groups: [] }
  }

  const { data, loading, error } = usePosts({
    filter: {
      searchQuery: query,
      feeds: [
        {
          app: evmAddress("0xa4de8E77b3F92005C84ff4dDd184b1F097aF11a2"),
        }
      ],
    },
  });

  if (loading) {
    return 'Loading…';
  }

  if (error) {
    return error.message;
  }

  const posts = data
    

  return {
    posts,
    products: [],
    groups: [],
  }
}