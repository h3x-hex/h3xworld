'use client'

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Navbar from '@/components/nav/Navbar'
import BottomNav from '@/components/nav/BottomNav'

interface Club {
  id: string
  name: string
  description: string
  banner: string
  members: number
  isMember: boolean
}

const ClubFullPage = () => {
  const { id } = useParams()
  const [club, setClub] = useState<Club | null>(null)

  useEffect(() => {
    // Simulate fetching club data
    const fetchClub = async () => {
      setClub({
        id: id as string,
        name: 'h3xClub',
        description: 'This is a private community of builders.',
        banner: '/club-banner.png',
        members: 42,
        isMember: false,
      })
    }

    fetchClub()
  }, [id])

  const toggleMembership = () => {
    setClub((prev) => prev && { ...prev, isMember: !prev.isMember })
  }

  if (!club) return <div className="text-white p-6">Loading...</div>

  return (
    <>
        <Navbar/>
        <div className="bg-black text-white min-h-screen pb-20 flex flex-col">
            <div className="border-b border-gray-400 h-12 flex text-center">
                <button
                    onClick={() => history.back()}
                    className="bg-black bg-opacity-50 p-2 rounded-full"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-white" />
                </button>
                <p className='pl-30 pt-1 text-2xl font-bold'>{club.name}</p>
            </div>

            <div className="p-4">
                <img src={club.banner} alt="club-banner" className="w-full h-56 object-cover" />
                <h1 className="text-2xl font-bold">{club.name}</h1>
                <p className="text-sm text-gray-400 mt-1">{club.description}</p>

                <p className="text-yellow-500 font-semibold mt-2">{club.members} Members</p>

                <div className="flex gap-3 mt-4">
                <button
                    onClick={toggleMembership}
                    className={`px-4 py-2 rounded-full border ${
                    club.isMember
                        ? 'bg-stone-800 border-red-500 text-red-500'
                        : 'bg-yellow-500 text-black'
                    }`}
                >
                    {club.isMember ? 'Leave Club' : 'Join Club'}
                </button>
                <button className="px-4 py-2 rounded-full border border-yellow-500 text-yellow-500">
                    Create Post
                </button>
                </div>

                {/* Members List */}
                <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 text-yellow-500">Members</h2>
                <div className="grid grid-cols-4 gap-3">
                    {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <img
                        src={`https://i.pravatar.cc/100?img=${i + 1}`}
                        className="w-12 h-12 rounded-full border border-yellow-500"
                        alt="member"
                        />
                        <p className="text-sm mt-1">User{i + 1}</p>
                    </div>
                    ))}
                </div>
                </div>
            </div>
        </div>
        <BottomNav/>
    </>
  )
}

export default ClubFullPage
