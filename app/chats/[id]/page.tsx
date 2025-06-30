import FullChat from '@/components/pages/FullChat'
import React from 'react'

interface PageProps {
  params: { id: string }
}

const ChatPage = ({ params }: PageProps) => {
  return (
    <div>
      <FullChat chatId={params.id} />
    </div>
  )
}

export default ChatPage
