'use client'

import React, { useState, useRef } from 'react'
import ImageCropper from './ImageCropper'
import Image from 'next/image'

interface ImageUploadCropperProps {
  type: 'profile' | 'cover'
  onImageCropped: (file: File) => void
  defaultImage?: string
}

const ImageUploadCropper: React.FC<ImageUploadCropperProps> = ({
  type,
  onImageCropped,
  defaultImage = '/defaultProfilePhoto.png'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [rawImage, setRawImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setRawImage(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (cropped: File) => {
    setPreviewImage(URL.createObjectURL(cropped))
    setRawImage(null)
    setShowCropper(false)
    fileInputRef.current!.value = ''
    onImageCropped(cropped)
  }

  const handleCancel = () => {
    setRawImage(null)
    setShowCropper(false)
    fileInputRef.current!.value = ''
  }

  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      {/* Preview Image */}
      <div className={type === 'profile' ? 'avatar h-full' : 'h-full w-full'}>
     
        <div
            className={
            type === 'profile'
                ? 'relative w-48 h-48 rounded-full overflow-hidden border-2 border-stone-600'
                : 'relative w-full max-w-3xl aspect-[3/1] rounded-lg overflow-hidden border-2 border-stone-600'
            }
        >
        {

            type === 'profile' ?

                <div className='cursor-pointer' onClick={() => fileInputRef.current?.click()}>

                    <Image
                        src={previewImage || defaultImage}
                        alt="Preview"
                        layout='fill'
                        className="w-full h-full object-cover"
                        
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm transition rounded-full">
                        Change Profile Photo
                    </div>

                </div>

            :

                <div className='cursor-pointer' onClick={() => fileInputRef.current?.click()}>
                    <Image
                        src={previewImage || '/defaultCover.png'}
                        alt="Preview"
                        layout='fill'
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm transition">
                        Change Cover
                    </div>
                </div>
        }
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

        {/* Crop Modal */}
        <div className='h-full'>
            {showCropper && rawImage && (
                <ImageCropper
                    imageSrc={rawImage}
                    type={type}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancel}
                />
            )}
        </div>
       </div>
    </div>
  )
}

export default ImageUploadCropper
