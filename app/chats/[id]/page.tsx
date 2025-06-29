import FullChat from '@/components/pages/FullChat'
import React from 'react'

interface ChatRouteParams  {
  params: { id: string }
}

const ChatPage = ({ params }: ChatRouteParams ) => {
  return (
    <div>
      <FullChat chatId={params.id} />
    </div>
  )
}

export default ChatPage
