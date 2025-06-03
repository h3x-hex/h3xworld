'use client'

import React from 'react'
import BottomNav from '@/components/nav/BottomNav'
import Navbar from '@/components/nav/Navbar'
import MediaQuery from 'react-responsive'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'

const Notifications = () => {

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className='bg-stone-950 h-screen flex flex-col'>
      <div>
          <MediaQuery maxWidth={550}>
              <Navbar/>
              <BottomNav/>
          </MediaQuery>

          <MediaQuery minWidth={551} maxWidth={99999}>
              <Sidebar/>
              <div className='flex flex-col pl-80'>
                <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-6 text-white">
                  <h2 className="text-3xl font-bold">Notifications</h2>
                  <ul className="space-y-2">
                    <li className="bg-neutral p-4 rounded">Sarah Johnson followed you <span className="text-xs text-gray-400">2m ago</span></li>
                    <li className="bg-neutral p-4 rounded">James Smith minted your NFT <span className="text-xs text-gray-400">30m ago</span></li>
                    <li className="bg-neutral p-4 rounded">🎉 You leveled up to Core Member <span className="text-xs text-gray-400">1h ago</span></li>
                    <li className="bg-neutral p-4 rounded">Jonathan Lee sent you a tip <span className="text-xs text-gray-400">3h ago</span></li>
                    <li className="bg-neutral p-4 rounded">Michael Williams @mentioned you <span className="text-xs text-gray-400">6h ago</span></li>
                    <li className="bg-neutral p-4 rounded">Ashley Wilson commented on your post <span className="text-xs text-gray-400">12h ago</span></li>
                  </ul>
                </motion.div>
              </div>
          </MediaQuery>
      </div>
    </div>
  )
}

export default Notifications