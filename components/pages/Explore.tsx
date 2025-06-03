'use client'

import React from 'react'
import BottomNav from '@/components/nav/BottomNav'
import Navbar from '@/components/nav/Navbar'
import MediaQuery from 'react-responsive'
import Sidebar from '../nav/Sidebar'
import { motion } from 'framer-motion'

const Explore = () => {

    const tabVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const tags = [ 'Art', 'Entertainment', 'News', 'Business', 'Sports', 'Computers', 'Electronics', 'Food', 'Shopping', 'Finance', 'Games', 'Health', 'Travel' ]
    return (
        <div className='bg-stone-950 h-screen'>
            <div>
                <MediaQuery maxWidth={550}>
                    <Navbar/>
                    <BottomNav/>
                </MediaQuery>

                <MediaQuery minWidth={551} maxWidth={99999}>
                    <Sidebar/>
                    <motion.div variants={tabVariants} initial="hidden" animate="visible" className="flex flex-col space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-yellow-400">Explore</h2>
                            <label className="input input-bordered border-2 focus:border-2 focus:border-yellow-500 bg-transparent rounded-full text-white w-2/3 mx-auto">
                                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                    <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                    >
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <path d="m21 21-4.3-4.3"></path>
                                    </g>
                                </svg>
                                <input type="search" required placeholder="Search" />
                            </label>
                        </div>
                        <div className="flex flex-col pl-84 gap-8">
                            <div className='flex flex-col'>
                                <h3 className='text-2xl text-white'>Popular Tags</h3>
                                <div className='flex flex-row pt-3 gap-3 overflow-x-scroll'>
                                    {tags.map((tag, idx) => (
                                        <div className="badge badge-xl border-none bg-stone-900 text-yellow-500 hover:border-2 hover:border-yellow-500 cursor-pointer" key={idx}>#{tag}</div>
                                    ))}
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <h3 className='text-2xl text-white'>Trending Tags</h3>
                                <div className='flex flex-row pt-3 gap-3'>
                                    <div className="badge badge-xl border-none bg-stone-900 text-yellow-500 hover:border-2 hover:border-yellow-500 cursor-pointer">Art</div>
                                    <div className="badge badge-xl border-none bg-stone-900 text-yellow-500 hover:border-2 hover:border-yellow-500 cursor-pointer">Entertainment</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </MediaQuery>
            </div>
        </div>
    )
}

export default Explore