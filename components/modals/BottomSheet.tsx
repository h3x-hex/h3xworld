'use client'

import React, { useEffect, useRef, useState } from 'react'

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  heightRatio?: number // 0.75 = 75% of screen height
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  heightRatio = 0.75,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [translateY, setTranslateY] = useState(100)

  const heightVH = heightRatio * 100

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
      requestAnimationFrame(() => setTranslateY(0)) // animate in
    } else {
      document.body.classList.remove('overflow-hidden')
      setTranslateY(100)
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    setDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging || startY.current === null) return
    const deltaY = e.touches[0].clientY - startY.current
    if (deltaY > 0) {
      const percentage = Math.min((deltaY / window.innerHeight) * 100, 100)
      setTranslateY(percentage)
    }
  }

  const handleTouchEnd = () => {
    if (translateY > 25) {
      onClose()
    } else {
      setTranslateY(0) // snap back
    }
    setDragging(false)
    startY.current = null
  }

  if (!isOpen) return null

  return (
    <div className="fixed z-50 pointer-events-none h-screen overflow-hidden">
      {/* Top overlay */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-auto"
        style={{ height: `${100 - heightVH}vh` }}
        onClick={onClose}
      >
        <div className="w-full h-full bg-black bg-opacity-30 backdrop-blur-sm" />
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`pointer-events-auto fixed bottom-0 left-0 transition-transform duration-300 bg-stone-800 w-full sm:left-1/2 sm:-translate-x-1/2 sm:w-96 rounded-t-2xl flex flex-col`}
        style={{
          height: `${heightVH}vh`,
          transform: `translate(0%, ${translateY}%)`,
          touchAction: 'none',
        }}
      >
        {/* Drag handle area */}
        <div
          className="flex justify-center py-3 border-b border-stone-700"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-gray-500 rounded-full" />
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default BottomSheet
