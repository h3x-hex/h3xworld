'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface PostsFeedProps {
  address: string;
}

const BookingTab = ({address}: PostsFeedProps) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [openModal, setOpenModal] = useState(false)


  const handleSubmit = () => {
    if (!selectedDate || !selectedTime || !name || !email) {
      alert('Please fill in all fields.')
      return
    }

    const booking = {
      name,
      email,
      date: selectedDate,
      time: selectedTime
    }

    console.log('Booking submitted:', booking, address)
    alert('Booking confirmed ✅')
    setOpenModal(false)
  }

  return (
    <div className="w-[96%] max-w-sm mx-auto rounded-xl overflow-hidden border border-yellow-500">
      <div className="relative rounded-xl bg-black text-white overflow-hidden">
        <Image src="/bookingThumbnail.png" alt="Photoshoot" width={400} height={200} className="w-full h-48 object-cover" />

        <div className="absolute top-2 right-2">
          <div className="h-6 w-6 rounded-full bg-yellow-500" />
        </div>

        <div className="p-4 flex flex-col justify-between h-full">
          <div className='flex flex-row gap-24'>
            <div className="mb-4 flex flex-col">
              <h3 className="text-lg font-semibold">Personal Training</h3>
              <p className="text-sm text-gray-300 mt-1">1 Hour – $36.9</p>
            </div>
            <p className="text-xs text-yellow-400 mt-1">⭐ 4.9 (120 ratings)</p>
          </div>
          <button
            onClick={() => setOpenModal(true)}
            className="w-fit bg-yellow-500 text-black text-sm font-semibold py-2 px-4 rounded-full hover:scale-105 transition"
          >
            Book Now
          </button>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Book a Session</h2>

            <div className="space-y-3">
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setSelectedTime('')
                }}
                className="w-full bg-stone-900 border border-gray-600 rounded-lg p-2 text-white"
              >
                <option value="">Select a date</option>
                
              </select>


              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-900 border border-gray-600 rounded-lg p-2 text-white"
              />

              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-gray-600 rounded-lg p-2 text-white"
              />

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setOpenModal(false)}
                  className="w-full bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-yellow-500 text-black text-sm font-semibold py-2 px-4 rounded-lg"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingTab