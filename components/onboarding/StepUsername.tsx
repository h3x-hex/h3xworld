import React, { useContext, useEffect, useState } from 'react'
import { OnboardingContext } from './OnboardingWrapper'
import { motion } from 'framer-motion'
import { checkUsernameExists } from '@/actions/user'

const StepUsername = () => {
    const context = useContext(OnboardingContext)
    if (!context) throw new Error("OnboardingContext not found")

    const { onboardingData, setOnboardingData, step, setStep, steps } = context
    const [username, setUsername] = useState(onboardingData.username);
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const [success, setSuccess] = useState("");
    const [errors, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        console.log(username);
        if(username != "")
        {
            checkUsernameExists(username).then(async (res) => {
                if (res!.error) {
                    setError('Username Exists!')
                    setLoading(false);
                    setUsernameAvailable(false);
                    return;
                }
                if (res!.success) {
                    setSuccess(res!.success)
                    setError("")
                    setLoading(false);
                    setUsernameAvailable(true);
                    return;
                }
            });
        }

        if(username == "")
        {
            setLoading(false);
            setError("");
            setSuccess("");
            setUsernameAvailable(false);
        }
        
    
    }, [username])


    return (
      <div className="h-screen flex flex-col items-center pt-32 w-96 mx-auto justify-center">
        <h1 className="text-3xl sm:text-3xl font-bold text-yellow-500">
            {steps[step]}
        </h1>
        
        <p className="text-sm text-stone-400">
            Step {step + 1} of {steps.length}
        </p>
        <fieldset className="fieldset">
            <legend className="fieldset-legend text-stone-300 text-[1rem]">Username</legend>
            <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setLoading(true); setOnboardingData({ ...onboardingData, username: e.target.value }) }}
            placeholder='Username'
            className="input input-bordered w-96 text-white bg-transparent border-stone-600"
            />
            {
                loading ? 
                    <span className="loading loading-spinner text-warning"></span>

                :
                errors ? 
                    <p className="fieldset-label text-red-500">{`${errors}`}</p>
                
                :
                success && username != '' ?
                    <p className="fieldset-label text-green-500">{`${success}`}</p>
                :
                <></>
            }
        </fieldset>

        <button
          disabled={!usernameAvailable}
          onClick={() => setStep(2)}
          className="btn mt-6 bg-yellow-500 text-black border-yellow-500 w-full shadow-none"
        >
          Continue
        </button>
        <button className='btn bg-transparent border-none text-stone-300 shadow-none' onClick={() => setStep(step - 1)}>
            Go Back
        </button>

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
    )
}

export default StepUsername