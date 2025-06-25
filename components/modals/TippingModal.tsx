// components/TippingModal.tsx
"use client"

import React, { useState } from "react"
import BottomSheet from "./BottomSheet"

interface TippingModalProps {
  isOpen: boolean
  onClose: () => void
  onTip: (amount: number) => void
}

const TippingModal: React.FC<TippingModalProps> = ({ isOpen, onClose, onTip }) => {
  const [amount, setAmount] = useState<number | string>("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    const value = Number(amount)
    if (isNaN(value) || value <= 0) {
      setError("Enter a valid amount")
      return
    }
    setError("")
    onTip(value)
    setAmount("")
    onClose()
  }

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} heightRatio={0.4}>
      <h2 className="text-white text-lg font-semibold mb-4">Send a Tip</h2>

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full px-4 py-2 rounded-md bg-stone-700 text-white placeholder-gray-400 focus:outline-none mb-2"
      />

      {error && <p className="text-red-400 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md transition"
      >
        Tip
      </button>
    </BottomSheet>
  )
}

export default TippingModal
