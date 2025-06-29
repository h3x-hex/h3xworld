// app/chat/[username]/page.tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation';
import { ChevronLeftIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { getChatMessages, sendMessage as sendChatMessage } from '@/actions/chat'

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
}

export default function FullChat() {

  const { id } = useParams();

  const fullName = 'Ronald Prithiv'
  const username = 'Ronald'
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadMessages() {
      const data = await getChatMessages(id as string)
      setMessages(data)
    }
    loadMessages()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return
    const created = await sendChatMessage(id as string, 'me', newMessage.trim())
    if (created) {
      setMessages((prev) => [...prev, created])
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800 bg-stone-900">
        <ChevronLeftIcon width={24} color="#eab308" onClick={() => history.back()}/>
        <img
          src={`https://api.dicebear.com/7.x/identicon/svg?seed=${username}`}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className='flex flex-col'>
            <h2 className="text-lg font-semibold">{fullName}</h2>
            <h2 className="text-md text-gray-300">{username}</h2>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.sender === 'me'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-stone-800 text-white'
              }`}
            >
              <p>{msg.content}</p>
              <span className={`text-[10px] float-right mt-1 ${
                msg.sender === 'me'
                  ? 'text-black'
                  : 'text-white'
              }`}></span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input box */}
      <div className="px-4 py-3 border-t border-gray-800 bg-stone-900 flex items-center">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-transparent border border-gray-700 rounded-full px-4 py-2 text-sm outline-none focus:border-yellow-500 h-12"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 text-yellow-500 hover:text-yellow-400 transition"
        >
          <PaperAirplaneIcon className="w-6 h-6 -rotate-45" />
        </button>
      </div>
    </div>
  )
}
