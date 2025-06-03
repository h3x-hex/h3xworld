'use client'

import React from 'react'
import MediaQuery from 'react-responsive'
import Navbar from '../nav/Navbar'
import BottomNav from '../nav/BottomNav'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'

const Marketplace = () => {

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
              <motion.div variants={tabVariants} initial="hidden" animate="visible" className="space-y-6 flex flex-col pl-80">
                <h2 className="text-3xl font-bold text-white">h<span className='text-yellow-500'>3</span>xMarketplace</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="card bg-yellow-400 text-black p-4">
                    <h3 className="font-bold">Pro Template Pack</h3>
                    <p className="text-sm">A collection of NFT post designs and overlays</p>
                    <button className="btn btn-outline border-black text-black mt-2">Buy – $12</button>
                  </div>
                  <div className="card bg-yellow-400 text-black p-4">
                    <h3 className="font-bold">Monetization Toolkit</h3>
                    <p className="text-sm">Smart contract tools to manage sales</p>
                    <button className="btn btn-outline border-black text-black mt-2">Buy – $20</button>
                  </div>
                  <div className="card bg-yellow-400 text-black p-4">
                    <h3 className="font-bold">Booking System</h3>
                    <p className="text-sm">Let fans schedule 1:1 calls with you</p>
                    <button className="btn btn-outline border-black text-black mt-2">Buy – $30</button>
                  </div>
                </div>
              </motion.div>
          </MediaQuery>
      </div>
    </div>
  )
}

export default Marketplace