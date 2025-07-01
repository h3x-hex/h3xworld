'use server'

import { prisma } from '@/prisma/prisma'
import { client } from '@/helper/lensClient'
import { fetchPosts } from '@lens-protocol/client/actions'

export const searchContent = async (query: string) => {
  if (!query) {
    return { users: [], posts: [], products: [], groups: [] }
  }

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

  const postResult = await fetchPosts(client, {
    where: { metadata: { contentContains: query } },
    limit: 5,
  })

  const posts = postResult.isOk()
    ? postResult.value.items.filter((p) => p.__typename === 'Post')
    : []

  return {
    users,
    posts,
    products: [],
    groups: [],
  }
}
