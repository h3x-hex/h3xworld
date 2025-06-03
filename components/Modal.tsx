'use client'

import React, { useRef } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  fields?: {
    name: string
    type: 'text' | 'textarea' | 'number' | 'file'
    placeholder: string
  }[]
  isLoading: boolean
  onSubmit?: () => void
  onSubmitWithData?: (data: { [key: string]: any }) => void
  submitText?: string
  children?: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  fields = [],
  isLoading,
  onSubmit,
  onSubmitWithData,
  submitText = 'Create',
  children
}) => {
  const [formData, setFormData] = React.useState<{ [key: string]: any }>({})
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    name: string
  ) => {
    const value =
      e.target.type === 'file'
        ? (e.target as HTMLInputElement).files?.[0]
        : e.target.value

    if (e.target.type === 'file' && value instanceof File) {
      const url = URL.createObjectURL(value)
      setPreviewUrl(url)
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (onSubmitWithData) {
      onSubmitWithData(formData)
    } else if (onSubmit) {
      onSubmit()
    }
    //onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-stone-900 text-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-yellow-500"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-lg font-bold mb-4">{title}</h2>

        {fields.map((field, index) => (
          <div key={index} className="mb-3">
            {field.type === 'textarea' ? (
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-white">{field.placeholder}</legend>
                <textarea
                  placeholder={field.placeholder}
                  className="w-full bg-stone-800 p-2 rounded"
                  rows={3}
                  onChange={e => handleChange(e, field.name)}
                />
              </fieldset>
            ) : field.type === 'file' ? (
              <>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend text-white">{field.placeholder}</legend>
                  <div className="border-2 border-dashed border-gray-500 rounded-lg text-center cursor-pointer hover:border-yellow-500 h-48 w-48 relative" onClick={() => fileInputRef.current?.click()}>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleChange(e, field.name)}
                      // if needed
                    />
                    <div className="text-gray-300 h-48 w-48 flex flex-col items-center justify-center relative">
                      
                      {previewUrl ? 
                        <img src={previewUrl} alt="Preview" className="rounded-lg border border-yellow-500 object-cover max-h-44" />

                        :
                        <div>
                          <p>Upload your Thumbnail Image</p>
                          <p className="text-xs text-gray-500 mt-1">Max size 8MB</p>
                        </div>

                      }
                    </div>
                  </div>
                </fieldset>
              </>
            ) : (
              <fieldset className="fieldset w-full">
                <legend className="fieldset-legend text-white">{field.placeholder}</legend>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-stone-800 p-2 rounded"
                  onChange={e => handleChange(e, field.name)}
                />
              </fieldset>
            )}
          </div>
        ))}

        {children && <div className="mb-4">{children}</div>}

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 bg-gray-700 rounded p-2">
            Cancel
          </button>
          {(onSubmit || onSubmitWithData) && (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-yellow-500 text-black font-bold p-2 rounded"
            >
              {isLoading ? <span className="loading loading-spinner"></span> : submitText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal
