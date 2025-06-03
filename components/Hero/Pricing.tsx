'use client'

import Image from 'next/image'
import React from 'react'

const platforms = [
  {
    name: 'h3x.world',
    color: 'text-yellow-500',
    logo: '/logo.png',
    link: 'https://h3x.world',
    features: {
      freePlan: '✅',
      sellDigitalProducts: '✅',
      sellAffiliateProducts: '✅',
      bookingSystem: '✅',
      exclusiveContentTiers: '✅',
      communityClubs: '✅',
      linksPage: '✅',
      analytics: '✅',
      platformFee: '0%'
    }
  },
  {
    name: 'Stan.store',
    logo: '/stan.jpeg',
    link: 'https://stan.store',
    features: {
      freePlan: '✅',
      sellDigitalProducts: '✅',
      sellAffiliateProducts: '✅',
      bookingSystem: '✅',
      exclusiveContentTiers: '✖️',
      communityClubs: '✖️',
      linksPage: '✅',
      analytics: '✅',
      platformFee: '10%'
    }
  },
  {
    name: 'Beacons.ai',
    logo: '/beacons.png',
    link: 'https://beacons.ai',
    features: {
      freePlan: '✅',
      sellDigitalProducts: '✅',
      sellAffiliateProducts: '✖️',
      bookingSystem: '✖️',
      exclusiveContentTiers: '✖️',
      communityClubs: '✖️',
      linksPage: '✅',
      analytics: '✅',
      platformFee: '9%'
    }
  },
  {
    name: 'Linktree',
    logo: '/linktree.png',
    link: 'https://linktr.ee',
    features: {
      freePlan: '✅',
      sellDigitalProducts: '✖️',
      sellAffiliateProducts: '✖️',
      bookingSystem: '✖️',
      exclusiveContentTiers: '✖️',
      communityClubs: '✖️',
      linksPage: '✅',
      analytics: '✅',
      platformFee: 'N/A'
    }
  },
  {
    name: 'Ko-fi',
    logo: '/kofi.jpg',
    link: 'https://ko-fi.com',
    features: {
      freePlan: '✅',
      sellDigitalProducts: '✅',
      sellAffiliateProducts: '✖️',
      bookingSystem: '✖️',
      exclusiveContentTiers: '✅',
      communityClubs: '✖️',
      linksPage: '✅',
      analytics: '✅',
      platformFee: '5%'
    }
  }
]

const featureLabels = {
  freePlan: 'Free Plan Available',
  sellDigitalProducts: 'Sell Digital Products',
  sellAffiliateProducts: 'Sell Affiliate Products',
  bookingSystem: 'Booking System',
  exclusiveContentTiers: 'Exclusive Content Tiers',
  communityClubs: 'Community / Clubs',
  linksPage: 'Links Page',
  analytics: 'Analytics',
  platformFee: 'Platform Fee'
}

export default function PricingComparison() {
  return (
    <div className=" bg-black text-white h-full w-full bg-gradient-to-l from-black to-transparent pointer-events-none z-10">
      <h2 className="text-2xl font-bold text-yellow-500 mb-4">Compare Platforms</h2>

      <table className="min-w-[800px] w-full table-auto border-collapse border border-gray-700 text-sm rounded-xl overflow-x-auto">
        <thead>
          <tr className="bg-stone-900">
            <th className="text-left px-4 py-3 border border-gray-700">Feature</th>
            {platforms.map((platform) => (
              <th
                key={platform.name}
                className={`px-4 py-3 border border-gray-700 text-center ${
                  platform.name === 'h3x.world' ? 'bg-yellow-900/30 text-yellow-400' : ''
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-1">
                  <Image src={platform.logo} alt={platform.name} width={32} height={32} />
                  <span className="text-xs font-semibold">{platform.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Object.keys(featureLabels).map((key) => (
            <tr key={key}>
              <td className="pl-3 py-3 border-t border-gray-700 text-gray-300 font-medium">
                {featureLabels[key as keyof typeof featureLabels]}
              </td>
              {platforms.map((platform) => (
                <td
                  key={platform.name + key}
                  className={`py-2 border-t border-l border-gray-700 text-center ${
                    platform.name === 'h3x.world' ? 'text-yellow-400 font-bold' : ''
                  }`}
                >
                  {platform.features[key as keyof typeof platform.features]}
                </td>
              ))}
            </tr>
          ))}

          {/* Call to Action row */}
          <tr className="">
            <td className="px-4 py-3 border border-yellow-500 text-gray-300 font-medium">Pro Plan Pricing</td>
            {[
                '$8.88-$36.9',
                '$29–99',
                '$10–30',
                '$5–24',
                '$6 or 5% fee'
            ].map((price, idx) => (
                <td key={idx} className={`px-4 py-2 border border-gray-700 text-center ${
                idx === 0 ? 'text-yellow-400 font-bold border-t border-yellow-500' : 'text-white'
                }`}>
                {price}
                </td>
            ))}
            </tr>
        </tbody>
      </table>
    </div>
  )
}
