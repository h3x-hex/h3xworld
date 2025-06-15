// components/ConnectionsView.tsx
'use client'

import React, { useState } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { userAtom } from '@/store/authState'
import { useAtom } from 'jotai';

interface Props {
    initialTab: string
}

export default function ConnectionsView({ initialTab }: Props) {

    const [user] = useAtom(userAtom);

    const [activeTab, setActiveTab] = useState(initialTab)
    const tabs = ['Followers', 'Following', 'Subscribers', 'Subscriptions']

    return (
        <div className="bg-black text-white min-h-screen">
        {/* Header */}
        <div className="flex items-center px-4 py-3 border-b border-stone-700">
            <ArrowLeftIcon className="h-5 w-5 text-white mr-4" />
            <div>
            <p className="text-lg text-gray-400">{user.username}</p>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-between border-b border-stone-700 text-center text-sm">
            {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 ${
                activeTab === tab
                    ? 'border-b-2 border-yellow-500 text-yellow-500 font-semibold'
                    : 'text-gray-400'
                }`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* Search */}
        <div className="px-4 py-2">
            <input
            type="text"
            placeholder="Search"
            className="w-full bg-stone-900 text-white border border-stone-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-yellow-500"
            />
        </div>

        {/* Categories (only for Followers tab) */}
        {activeTab === 'Followers' && (
            <div className="px-4 pb-4">
            <h3 className="text-sm text-gray-300 font-semibold mb-3">Categories</h3>
            <div className="space-y-3 text-sm">
                <CategoryRow label="Accounts you don't follow back" count="86" />
                <CategoryRow label="Least interacted with" count="49" />
                <CategoryRow label="Deactivated accounts" count="10" />
            </div>
            </div>
        )}

        {/* List */}
        <div className="px-4 space-y-4 pb-16">
            <h3 className="text-sm text-gray-300 font-semibold mb-2">All {activeTab.toLowerCase()}</h3>
            {[...Array(5)].map((_, i) => (
            <UserRow key={i} name={`User ${i + 1}`} username={`username${i}`} tab={activeTab} />
            ))}
        </div>
        </div>
    )
}

const CategoryRow = ({ label, count }: { label: string; count: string }) => (
  <div className="flex items-center gap-3">
    <div className="h-10 w-10 bg-stone-800 rounded-full" />
    <div className="text-sm">
      <p>{label}</p>
      <p className="text-xs text-gray-500">and {count} others</p>
    </div>
  </div>
)

const UserRow = ({
  name,
  username,
  tab,
}: {
  name: string
  username: string
  tab: string
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 bg-stone-800 rounded-full" />
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-400">{username}</p>
      </div>
    </div>
    {tab === 'Followers' ? (
      <button className="text-blue-500 text-sm bg-blue-500/10 px-3 py-1 rounded-md">Follow back</button>
    ) : (
      <button className="text-sm border border-stone-600 px-3 py-1 rounded-md text-white">Message</button>
    )}
  </div>
)
