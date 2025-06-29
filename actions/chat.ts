'use server'

import { prisma } from '@/prisma/prisma'

export interface CreateChatOptions {
  participants: string[]
  type?: 'DM' | 'GROUP' | 'VOICE' | 'VIDEO' | 'COLAB' | 'PAID' | 'GIG'
  isGroup?: boolean
  name?: string
  price?: number
  gigId?: string
}

export const createChat = async (options: CreateChatOptions) => {
  try {
    const chat = await prisma.chat.create({
      data: {
        participants: options.participants,
        type: options.type ?? 'DM',
        isGroup: options.isGroup ?? false,
        name: options.name,
        price: options.price,
        gigId: options.gigId,
      },
    })
    return chat
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getChatsForUser = async (userId: string) => {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          has: userId,
        },
      },
    })
    return chats
  } catch (error) {
    console.log(error)
    return []
  }
}

export const sendMessage = async (
  chatId: string,
  sender: string,
  content: string,
) => {
  try {
    const message = await prisma.message.create({
      data: {
        chatId,
        sender,
        content,
      },
    })
    return message
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getChatMessages = async (chatId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { timestamp: 'asc' },
    })
    return messages
  } catch (error) {
    console.log(error)
    return []
  }
}
