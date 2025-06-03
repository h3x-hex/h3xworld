// components/ImageModal.tsx
'use client'

import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"

interface ImageModalProps {
  media: string[]
  startIndex: number
  onClose: () => void
}

const ImageModal: React.FC<ImageModalProps> = ({ media, startIndex, onClose }) => {
    return (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex justify-center items-center"
          onClick={onClose} // clicking outside closes modal
        >
          <div
            className="w-full max-w-3xl px-4"
            onClick={(e) => e.stopPropagation()} // 👈 prevent bubbling to parent
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white text-2xl font-bold z-50"
            >
              ✕
            </button>
    
            <Carousel
              selectedItem={startIndex}
              showThumbs={false}
              showStatus={false}
              infiniteLoop
              useKeyboardArrows
              dynamicHeight
              showIndicators
            >
              {media.map((url, idx) => (
                <div key={idx}>
                  <img
                    src={url}
                    className="object-contain max-h-[90vh] w-full rounded-lg"
                    alt={`image-${idx}`}
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
    );
}

export default ImageModal
