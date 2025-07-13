'use client';

import { FC, useEffect, useState } from 'react';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { searchUsers } from '@/actions/search';
import { getChatBetweenUsers, createChat } from '@/actions/chat';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authState';

type NewMessageModalProps = {
  onClose: () => void;
};

const NewMessageModal: FC<NewMessageModalProps> = ({ onClose }) => {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([])
  const [user] = useAtom(userAtom)
  const router = useRouter()

  const handleSelectUser = async (selected: any) => {
    if (!user.id) return
    let chat = await getChatBetweenUsers(user.id, selected.id)
    if (!chat) {
      chat = await createChat({ participants: [user.id, selected.id] })
    }
    if (chat) {
      router.push(`/chats/${chat.id}`)
      onClose()
    }
  }

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim() === '') {
        setResults([])
        return
      }
      setIsLoading(true)
      const data = await searchUsers(query.trim())
      setIsLoading(false)
      console.log(data)
      setResults(data)
    }, 300)

    return () => clearTimeout(handler)
  }, [query])

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-70">
        <div className="w-full max-w-md bg-black text-white rounded-xl  shadow-lg ">
            <div className="flex items-center px-2 py-3 border-b border-gray-700">
              <button onClick={onClose} className="p-1 mr-3">
                  <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>   
              <h2 className="text-lg font-semibold">New message</h2>
            </div>
            <div className="px-4 py-3">
                <div className="relative w-full">
                  <label className="input rounded-full bg-transparent border-gray-300 focus:border-yellow-500 border-[1px] w-full">
                    <p className='text-gray-300'>To: </p>
                    <input
                      type="search"
                      placeholder="Search"
                      className="text-gray-100 bg-transparent"
                      value={query}
                      onChange={e => setQuery(e.target.value)}
                    />
                  </label>
                  {
                      isLoading ?

                      <span className="loading loading-spinner text-warning"></span>

                      :

                      results.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-stone-900 border border-gray-700 rounded-md text-gray-300 max-h-60 overflow-y-auto">
                          {results.map(user => (
                            <li
                              key={user.id}
                              className="p-2 hover:bg-stone-800 cursor-pointer"
                              onClick={() => handleSelectUser(user)}
                            >
                              {user.username || user.name}
                            </li>
                          ))}
                        </ul>
                      )
                    }
                  
                </div>
            </div>
        </div>
    </div>
  );
};

export default NewMessageModal;
