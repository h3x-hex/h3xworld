'use client'

import React from 'react'
import MediaQuery from 'react-responsive'
import Navbar from '../nav/Navbar'
import BottomNav from '../nav/BottomNav'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'

const Wallet = () => {
  
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };  
  
  return (
    <div className='bg-stone-950 h-screen flex mx-auto'>
      
          <MediaQuery maxWidth={550}>
              <Navbar/>
              <BottomNav/>
          </MediaQuery>

          <MediaQuery minWidth={551} maxWidth={99999} className='flex'>
              <Sidebar/>
              <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col text-white space-y-6 sm:w-[64rem]">
                <div className='flex flex-col'>
                  <h2 className="text-3xl font-bold text-gray-100 pt-8">Wallet</h2>
                  <div className="stats shadow bg-neutral text-white">
                    <div className="stat">
                      <div className="stat-title text-white">Balance</div>
                      <div className="stat-value text-yellow-400">Ξ 2.43</div>
                      <div className="stat-desc text-white">Updated 2 mins ago</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-white">Monthly Income</div>
                      <div className="stat-value">Ξ 1.20</div>
                      <div className="stat-desc text-green-400">+22% from last month</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title text-white">Monthly Spending</div>
                      <div className="stat-value">Ξ 0.85</div>
                      <div className="stat-desc text-red-400">-8% from last month</div>
                    </div>
                  </div>
                  <div className="flex flex-col bg-stone-950 p-4 rounded-lg">
                    <div className="flex flex-col justify-between mb-8">
                      <div className='flex flex-row justify-between'>
                        <p className="text-3xl text-white">ETH</p>
                        <p className="text-3xl font-bold">2.56 ETH</p>
                      </div>
                      <div className="divider"></div>
                      <div className='flex flex-row justify-between'>
                        <p className="text-3xl text-white">HexCoin</p>
                        <p className="text-3xl font-bold">1.208 HEX</p>
                      </div>
                    </div>
                    <button className="btn bg-transparent border-yellow-400 text-yellow-400 w-64 shadow-none rounded-full">Request Payout</button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <ul className="space-y-1 text-sm">
                      <li>+ $550 — Minted NFT (2 hours ago)</li>
                      <li>+ $25 — Tipped (8 hours ago)</li>
                      <li>+ $10 — Subscription (Yesterday)</li>
                      <li>- $320 — Bought NFT (Yesterday)</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
          </MediaQuery>
      </div>
  )
}

export default Wallet