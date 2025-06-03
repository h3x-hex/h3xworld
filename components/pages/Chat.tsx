'use client'

import React, { useState } from 'react'
import BottomNav from '@/components/nav/BottomNav'
import Navbar from '@/components/nav/Navbar'
import MediaQuery from 'react-responsive'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import CreateChatModal from '../modals/CreateChatModal'

const Chat = () => {

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateChat = (username: string) => {
    // You can route to a new chat or make API call here
    console.log('Starting chat with:', username)
  }


  return (
    <div className='bg-stone-950 h-screen'>
      <div>
          <MediaQuery maxWidth={550}>
              <Navbar/>
              <BottomNav/>
              <div className="w-full bg-stone-950 border-r border-stone-950 p-4">
                <div className='flex flex-row justify-between items-center mb-4'>
                  <ChevronLeftIcon width={24} color="#eab308" onClick={() => history.back()}/>
                  <h2 className="text-2xl font-bold text-white">Messages</h2>
                  <PencilSquareIcon width={32} color='#FFFFFF' className='' onClick={() => setIsModalOpen(true)}/>
                </div>
                <div className="space-y-4">
                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition" onClick={() => router.push(`/chats/1234`)}>
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">Ronald Prithiv</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>

                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition">
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">Pandiaraj</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>

                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition">
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">xen dante</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>
                  {/* More chats... */}
                </div>
              </div>
              <CreateChatModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateChat={handleCreateChat}
              />
          </MediaQuery>

          <MediaQuery minWidth={551} maxWidth={99999}>
              <Sidebar/>
              <motion.div variants={tabVariants} initial="hidden" animate="visible" className="text-white space-y-6 flex flex-col pl-80">
              <div className="w-full bg-stone-950 border-r border-stone-950 p-4">
                <div className='flex flex-row'>
                  <h2 className="text-xl font-bold mb-4 text-white">Messages</h2>
                  <PencilSquareIcon width={24} color='#FFFFFF'/>
                </div>
                <div className="space-y-4">
                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition">
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">John Doe</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>

                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition">
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">John Doe</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>

                  <div className="cursor-pointer py-3 bg-stone-950 rounded-lg hover:bg-stone-600 transition">
                    <div className='flex flex-row gap-3'>
                      <img
                          src={'/defaultProfilePhoto.png'}
                          alt="avatar"
                          className="w-16 h-16 rounded-full border border-yellow-400"
                      />
                      <div className='flex flex-col'>
                        <p className="font-semibold text-white text-lg">John Doe</p>
                        <p className="text-md text-gray-400 truncate">Hey, how’s it going?</p>
                      </div>
                    </div>
                  </div>
                  {/* More chats... */}
                </div>
              </div>
              </motion.div>
          </MediaQuery>
      </div>
    </div>
  )
}

export default Chat