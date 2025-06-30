'use client'

import React from 'react'
import SearchBar from '../SearchBar'
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
                            <div className="w-2/3 mx-auto">
                              <SearchBar />
                            </div>
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