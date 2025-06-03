import React from 'react'


interface PostsFeedProps {
  address: string;
}

const About = ({address}: PostsFeedProps) => {
  return (
    <div className="bg-stone-950 text-white p-5 h-screen">
      {address}
    </div>

  )
}

export default About