// components/GifPicker.tsx
"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import React, { useState, useEffect } from "react"

interface GifPickerProps {
  apiKey: string
  onSelect: (url: string) => void
  onClose: () => void
}

const GifPicker: React.FC<GifPickerProps> = ({ apiKey, onSelect, onClose }) => {
  const [query, setQuery] = useState("")
  const [gifs, setGifs] = useState<Array<{ id: string; url: string }>>([])

  useEffect(() => {
    // fetch trending on mount
    fetchGifs("")
  }, [])

  const fetchGifs = async (q: string) => {
    const url = new URL("https://api.giphy.com/v1/gifs/search")
    url.searchParams.set("api_key", apiKey)
    url.searchParams.set("q", q || "trending")
    url.searchParams.set("limit", "25")
    const res = await fetch(url.toString())
    const data = await res.json()
    setGifs(
      data.data.map((g: any) => ({
        id: g.id,
        url: g.images.fixed_width.url,
      }))
    )
  }

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchGifs(query)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
      <div className="bg-stone-900 rounded-lg p-4 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <form onSubmit={onSearch} className="flex flex-1">
            <input
              value={query}
              onChange={(e) => {setQuery(e.target.value);fetchGifs(e.target.value)}}
              placeholder="Search GIFs"
              className="flex-1 px-4 py-2 rounded-full bg-stone-800 text-white focus:outline-none"
            />
            
          </form>
          <button onClick={onClose}>
            <XMarkIcon className="h-6 w-6 text-gray-300 hover:text-white" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {gifs.map((g) => (
            <img
              key={g.id}
              src={g.url}
              onClick={() => {
                onSelect(g.url)
                onClose()
              }}
              className="w-full h-24 object-cover cursor-pointer rounded"
              alt="gif"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GifPicker
