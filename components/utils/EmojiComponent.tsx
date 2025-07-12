'use client'

import React, { useRef, useEffect } from 'react'
import EmojiPicker from 'emoji-picker-react'

type Props = {
  onEmojiSelect: (emoji: string) => void
  onClose: () => void
}

export default function EmojiComponent({ onEmojiSelect, onClose }: Props) {
  const pickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div ref={pickerRef} className="absolute top-[96] z-50 mt-2">
        <EmojiPicker
            onEmojiClick={(emojiData) => {
                onEmojiSelect(emojiData.emoji)
            }}
        />
    </div>
  )
}
