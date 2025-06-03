'use client'

import React, { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onCreateChat: (username: string) => void
}

const CreateChatModal: React.FC<Props> = ({ isOpen, onClose, onCreateChat }) => {
  const [username, setUsername] = useState('')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-stone-900 text-white w-full max-w-sm p-6 rounded-xl shadow-lg relative border border-yellow-500">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl font-bold text-yellow-500">×</button>
        <h2 className="text-lg font-bold mb-4 text-yellow-500">Start a New Chat</h2>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-600 rounded-md bg-transparent text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
        />
        <button
          onClick={() => {
            onCreateChat(username)
            setUsername('')
            onClose()
          }}
          disabled={!username.trim()}
          className="mt-4 w-full py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-400 transition"
        >
          Create Chat
        </button>
      </div>
    </div>
  )
}

export default CreateChatModal
