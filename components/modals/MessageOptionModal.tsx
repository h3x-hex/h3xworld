// components/MessageOptionModal.tsx
"use client"

import React, { useState } from "react"
import BottomSheet from "./BottomSheet"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

interface MessageOptionModalProps {
  isOpen: boolean
  onClose: () => void
}

const MessageOptionModal: React.FC<MessageOptionModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<"options" | "dm" | "colab">("options")
  const [message, setMessage] = useState("")

  const handleBack = () => setView("options")

  const handleSubmit = () => {
    console.log("Submitting", view, message)
    setMessage("")
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightRatio={0.5}>
      {view === "options" && (
        <div className="space-y-4">
          <button
            onClick={() => setView("dm")}
            className="w-full py-3 bg-yellow-500 rounded-lg text-black font-bold"
          >
            Direct Message
          </button>
          <button
            onClick={() => setView("colab")}
            className="w-full py-3 bg-yellow-500 rounded-lg text-black font-bold"
          >
            Request Collaboration
          </button>
        </div>
      )}

      {view !== "options" && (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <button onClick={handleBack} className="text-yellow-500 font-bold"><ChevronLeftIcon width={24} color="#EAB308"/></button>
                <h2 className="text-white font-semibold">
                {view === "dm" ? "Send a Direct Message" : "Request Collaboration"}
                </h2>
            </div>
            <textarea
                placeholder="Type your message..."
                className="w-full p-3 rounded bg-stone-700 text-white"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            {
                view === 'colab' && 

                <div>
                    
                </div>
            }
            <button
                onClick={handleSubmit}
                className="w-full py-3 bg-yellow-500 rounded-lg text-black font-bold"
            >
                Submit
            </button>
        </div>
      )}
    </BottomSheet>
  )
}

export default MessageOptionModal
