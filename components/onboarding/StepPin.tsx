import React, { useContext, useEffect, useRef, useState } from 'react'
import { OnboardingContext } from './OnboardingWrapper'
import { motion } from 'framer-motion'

const StepPin = () => {
    const context = useContext(OnboardingContext)

    if (!context) {
        throw new Error("OnboardingContext must be used within OnboardingWrapper")
    }

    const {
        step,
        setStep,
        setOnboardingData,
        steps
    } = context

    const [digits, setDigits] = useState<string[]>(Array(6).fill(''))
    const pinInputsRef = useRef<(HTMLInputElement | null)[]>([])
  
    useEffect(() => {
      setOnboardingData((prev: any) => ({ ...prev, pin: digits.join('') }))
    }, [digits])
  
    const handleChange = (index: number, value: string) => {
      if (!/^[0-9]?$/.test(value)) return
      const newDigits = [...digits]
      newDigits[index] = value
      setDigits(newDigits)
      if (value && index < 5) pinInputsRef.current[index + 1]?.focus()
    }
  
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        pinInputsRef.current[index - 1]?.focus()
      }
    }
  
    return (
        <div className='h-screen pt-8 flex flex-col w-full mx-auto items-center justify-center'>
            <h1 className="text-3xl sm:text-3xl font-bold text-yellow-500">
                {steps[step]}
            </h1>
            
            <p className="text-sm text-stone-400">
                Step {step + 1} of {steps.length}
            </p>

            <div className="mt-10 text-white px-4 ">
                <h2 className="text-xl mb-6 text-center">Enter your desired PIN for an additional layer while creating posts, products, and links.</h2>

                <div className="flex flex-col gap-6 items-center w-[80%] mx-auto">

                    {/* Free Plan */}
                    <div className="w-full max-w-xs mx-auto mt-8 text-center text-white">
                        <h2 className="text-lg font-semibold mb-3">Enter your 6-digit PIN</h2>
                        <div className="flex justify-center gap-2">
                            {digits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => {pinInputsRef.current[idx] = el}}
                                type="password"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                className="w-12 h-12 text-2xl text-center bg-transparent border-2 border-stone-600 rounded focus:border-yellow-500 focus:outline-none"
                                value={digit}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                            />
                            ))}
                        </div>

                        <button
                            className="btn bg-yellow-500 text-black w-full mt-6 shadow-none border-none"
                            onClick={() => setStep(step + 1)}
                            disabled={digits.join('').length !== 6}
                        >
                            Continue
                        </button>
                        <button className='btn bg-transparent border-none text-stone-300 shadow-none' onClick={() => setStep(step - 1)}>Go Back</button>
                    </div>

                    <div className="flex space-x-2 mt-4 pb-8 mx-auto">
                        {steps.map((_, index) => (
                            <motion.div
                            key={index}
                            className={`w-3 h-3 rounded-full ${index <= step ? 'bg-yellow-400' : 'bg-stone-600'}`}
                            layout
                            transition={{ type: 'spring', stiffness: 500 }}
                            />
                        ))}
                    </div>
                </div>
            </div>
      </div>
    )
}

export default StepPin