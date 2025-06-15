'use client'

import FeatureBlock from '../../components/Hero/FeatureBlock'

const sections = [
  { title: 'Posts', description: 'Share updates, drops, and thoughts.', image: '/posts.png' },
  { title: 'Portfolio', description: 'Showcase your best work in one place. Built for creators and visionaries.', image: '/portfolio.png' },
  { title: 'h3xclusive', description: 'Sell exclusive content through h3xclusive tiers.', image: '/h3xclusive.png' },
  { title: 'Shop', description: 'Sell digital products and affiliate items. Monetize like a boss.', image: '/shop.png' },
  { title: 'Booking', description: 'Offer 1-on-1 sessions, coaching or services. Let clients book you directly.', image: '/booking.png' },
  { title: 'Links', description: 'Curated links, tools, and social accounts in one clean hub.', image: '/links.png' },
  { title: 'Clubs', description: 'Create and manage communities.', image: '/clubs.png' }
]

export default function Features() {
  return (
    <div className="bg-stone-950 text-white space-y-32 py-20 px-6 sm:px-12">
      {sections.map((s, i) => (
        <FeatureBlock key={s.title} {...s} reverse={i % 2 !== 0} />
      ))}
    </div>
  )
}
