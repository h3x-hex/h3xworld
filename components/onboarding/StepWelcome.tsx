'use client'

import { useContext } from 'react'
import { OnboardingContext } from './OnboardingWrapper'
import NextImage from 'next/image'

export default function StepWelcome() {
  const context = useContext(OnboardingContext)
  if (!context) throw new Error("OnboardingContext not found")

  const { setStep } = context

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8 w-full bg-stone-950 px-4 text-center">
      <NextImage src="/logo.png" width={128} height={128} alt="h3x logo" priority />
      
      <h1 className="text-3xl sm:text-4xl font-bold text-stone-300">
        Welcome to h<span className="text-yellow-500">3</span>x<span className="text-stone-600">.</span>world
      </h1>

      <p className="text-md text-stone-400 max-w-sm">
        Empower your digital identity and creator journey. We’ll get you set up in 5 quick steps.
      </p>

      <button
        className="btn bg-yellow-500 text-black px-8 py-2 border-yellow-500 shadow-none font-semibold transition"
        onClick={() => setStep(1)}
      >
        Let’s Get Started →
      </button>
    </div>
  )
}
