'use client'

import React from 'react'
import BottomNav from '@/components/nav/BottomNav'
import Navbar from '@/components/nav/Navbar'
import MediaQuery from 'react-responsive'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'

const Dashboard = () => {

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };  

  return (
    <div className='bg-stone-950 h-screen'>
      <div>
          <MediaQuery maxWidth={550}>
              <Navbar/>
              <BottomNav/>
          </MediaQuery>

          <MediaQuery minWidth={551} maxWidth={99999}>
              <Sidebar/>
              <motion.div variants={tabVariants} initial="hidden" animate="visible" className="text-white space-y-6 flex flex-col pl-80">
                <h2 className="text-3xl font-bold">Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-neutral p-4 rounded">
                    <p className="text-sm text-gray-400">Total Views</p>
                    <h3 className="text-2xl font-bold text-yellow-400">32.4K</h3>
                  </div>
                  <div className="bg-neutral p-4 rounded">
                    <p className="text-sm text-gray-400">Earnings This Month</p>
                    <h3 className="text-2xl font-bold text-yellow-400">$1,890</h3>
                  </div>
                  <div className="bg-neutral p-4 rounded">
                    <p className="text-sm text-gray-400">Followers</p>
                    <h3 className="text-2xl font-bold text-yellow-400">9,471</h3>
                  </div>
                </div>
                <div className="bg-neutral p-4 rounded">
                  <h3 className="text-lg font-semibold mb-2">Post Performance</h3>
                  <ul className="space-y-2 text-sm">
                    <li>The Future of Web3 Creation — 85%</li>
                    <li>New Drop: Digital Dreamscape — 70%</li>
                    <li>Behind the Scenes of My Art — 60%</li>
                    <li>Tips for Aspiring Artists — 45%</li>
                  </ul>
                </div>
                <div className="bg-neutral p-4 rounded">
                  <h3 className="text-lg font-semibold mb-2">Storage</h3>
                  <div className="w-full bg-base-100 rounded h-2 mb-2">
                    <div className="bg-yellow-400 h-2 rounded" style={{ width: '88%' }}></div>
                  </div>
                  <p className="text-sm text-gray-400">88% of 200 GB used</p>
                  <div className="flex space-x-2 mt-2">
                    <button className="btn btn-outline border-yellow-400 text-yellow-400">Upload</button>
                    <button className="btn btn-outline border-yellow-400 text-yellow-400">Create Product</button>
                    <button className="btn btn-outline border-yellow-400 text-yellow-400">Go Live</button>
                  </div>
                </div>
              </motion.div>
          </MediaQuery>
      </div>
    </div>
  )
}

export default Dashboard