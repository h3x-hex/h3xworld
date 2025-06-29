// components/ChatSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { getChatsForUser } from '@/actions/chat'
import BottomNav from '../nav/BottomNav';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai';
import { userAtom } from '@/store/authState';
import { whiteColor } from '@/constants/colors';
import NewMessageModal from '../modals/NewMessageModal';


const TABS = ['DMs', 'Paid DMs', 'Colab Requests', 'Gigs'];

const ChatSection = () => {

  const [activeTab, setActiveTab] = useState('DMs');
  const [isModalOpen, setModalOpen] = useState(false);
  const [user] = useAtom(userAtom)

  const router = useRouter();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'DMs': return <DMs />;
      case 'Paid DMs': return <PaidDMs />;
      case 'Colab Requests': return <ColabRequests />;
      case 'Gigs': return <Gigs />;
      default: return null;
    }
  };


  return (
    <>
    <div className="w-full max-w-4xl mx-auto">
      <div className='flex flex-row justify-between pr-3'>
        <div className='flex flex-row pt-3 gap-3'>
          <ChevronLeftIcon width={24} color={whiteColor} className='cursor-pointer pt-2' onClick={() => router.back()} />
          <h1 className='text-white text-2xl font-bold'>{user.username}</h1>
        </div>
        <PencilSquareIcon width={32} color={whiteColor} className='cursor-pointer pt-2' onClick={() => setModalOpen(true)}/>
      </div>
      <div className='flex w-full pt-3'>
        <label className="input rounded-full bg-transparent border-gray-300 focus:border-yellow-500 border-[1px] w-[90%] mx-auto">
          <svg className="h-[1em] opacity-50 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
          <input type="search" required placeholder="Search" className='text-gray-300'/>
        </label>
      </div>
      <NewMessageModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />

      <div className="flex flex-row justify-around border-b border-gray-700 py-2 text-white">
        
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === tab ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-gray-400'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">{renderTabContent()}</div>
    </div>
    <BottomNav/>
    </>
  );
};

export default ChatSection;

// Placeholder Components (You'd replace these with real implementations)
// File: components/sections/DMList.tsx
export const DMs: React.FC = () => {
  const [user] = useAtom(userAtom)
  const [chats, setChats] = useState<any[]>([])

  useEffect(() => {
    async function loadChats() {
      const data = await getChatsForUser(user.id)
      setChats(data)
    }
    if (user.id) loadChats()
  }, [user.id])

  return (
    <div className="text-white p-4 space-y-3">
      <h2 className="text-xl font-bold mb-2">Direct Messages</h2>
      {chats.length === 0 && <p>No messages yet.</p>}
      {chats.map((chat) => (
        <div key={chat.id} className="border-b border-gray-700 pb-2">
          <a href={`/chats/${chat.id}`}>Chat {chat.id}</a>
        </div>
      ))}
    </div>
  )
}

// File: components/sections/PaidDMList.tsx
export const PaidDMs: React.FC = () => {
  return (
    <div className="text-white p-4">
      <h2 className="text-xl font-bold mb-2">Paid DMs</h2>
      {/* Replace with actual Paid DMs UI */}
      <p>No paid messages yet.</p>
    </div>
  );
};

// File: components/sections/ColabRequests.tsx
export const ColabRequests: React.FC = () => {
  return (
    <div className="text-white p-4">
      <h2 className="text-xl font-bold mb-2">Collaboration Requests</h2>
      {/* Replace with actual Colab requests UI */}
      <p>No collaboration requests yet.</p>
    </div>
  );
};

// File: components/sections/GigChats.tsx
export const Gigs: React.FC = () => {
  return (
    <div className="text-white p-4">
      <h2 className="text-xl font-bold mb-2">Gigs</h2>
      {/* Replace with actual Gigs UI */}
      <p>No gigs booked or listed.</p>
    </div>
  );
};