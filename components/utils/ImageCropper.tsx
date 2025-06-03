'use client'

import React, { useState, useCallback } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import getCroppedImg from '../../utils/cropImage'

interface ImageCropperProps {
    imageSrc: string
    type: 'profile' | 'cover'
    onCropComplete: (croppedFile: File) => void
    onCancel: () => void
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, type, onCropComplete, onCancel }) => {
  const aspectRatio = type === 'profile' ? 1 / 1 : 3 / 1
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()

  const onCropDone = async () => {
    if (croppedAreaPixels) {
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels, `${type}-image.webp`)
      onCropComplete(croppedFile) // now returns File object
    }
  }
  

  const onCropAreaComplete = useCallback((_: any, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-3xl h-[400px] bg-black rounded-lg overflow-hidden">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropAreaComplete}
          cropShape={type === 'profile' ? 'round' : 'rect'}
          showGrid={false}
          restrictPosition={false}
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="range range-warning w-64"
        />
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button className="btn btn-outline btn-sm text-white" onClick={onCancel}>Cancel</button>
          <button className="btn btn-warning btn-sm text-black" onClick={onCropDone}>Crop & Save</button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper
