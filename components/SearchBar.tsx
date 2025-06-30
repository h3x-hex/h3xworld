'use client'

import React, { useEffect, useState } from 'react'
import { searchUsers } from '@/actions/search'

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim() === '') {
        setResults([])
        return
      }
      const data = await searchUsers(query.trim())
      setResults(data)
    }, 300)

    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className="relative w-full">
      <label className="input rounded-full bg-transparent border-gray-300 focus:border-yellow-500 border-[1px] w-full">
        <svg className="h-[1em] opacity-50 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          placeholder="Search"
          className="text-gray-300 bg-transparent"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </label>
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-stone-900 border border-gray-700 rounded-md text-gray-300 max-h-60 overflow-y-auto">
          {results.map(user => (
            <li key={user.id} className="p-2 hover:bg-stone-800">
              <a href={`/${user.username}`}>{user.username || user.name}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchBar
