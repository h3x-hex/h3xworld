// File: components/onboarding/StepCustomizeProfile.tsx

'use client'

import { useContext, useEffect, useState } from 'react'
import { OnboardingContext } from './OnboardingWrapper'
import ImageUploadCropper from '@/components/utils/ImageUploadCropper'
import { PlusIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const MAX_BIO_LENGTH = 160;
const MIN_BIO_LENGTH = 0;

export default function StepCustomizeProfile() {
  const context = useContext(OnboardingContext)
  if (!context) throw new Error("OnboardingContext not found")

  const { onboardingData, setOnboardingData, setStep, step } = context

  const [bio, setBio] = useState(onboardingData.bio || '')
  const [dobError, setDOBError] = useState('')
  const isTooShort = bio.length > 0 && bio.length < MIN_BIO_LENGTH

  const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'YouTube', 'GitHub']

  useEffect(() => {
    setOnboardingData(prev => ({ ...prev, bio }))
  }, [bio])

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...onboardingData.socialLinks]
    updated[index][field] = value
    setOnboardingData({ ...onboardingData, socialLinks: updated })
  }

  const handleAddSocialLink = () => {
    setOnboardingData({ ...onboardingData, socialLinks: [...onboardingData.socialLinks, { platform: '', url: '' }] })
  }

  const handleSocialLinkRemove = (index: number) => {
    const updated = onboardingData.socialLinks.filter((_, i) => i !== index)
    setOnboardingData({ ...onboardingData, socialLinks: updated })
  }

  return (
    <div className='flex flex-col items-center justify-center gap-3 sm:w-1/3 px-3 mx-auto'>
      <h1 className="text-3xl sm:text-3xl font-bold text-yellow-500 pt-8">
        Customize Your Profile
      </h1>

      <p className="text-sm text-stone-400">
        Step {step + 1} of 5
      </p>

      <div className='pt-8'>
        <fieldset className="fieldset">
          <legend className="fieldset-legend text-white mx-auto">Profile Photo</legend>
          <div className="avatar w-48">
            <ImageUploadCropper
              type="profile"
              onImageCropped={(file: File) => {
                setOnboardingData(prev => ({ ...prev, profileImage: file }))
              }}
            />
          </div>
        </fieldset>
      </div>

      <div className='py-6 relative w-full mx-auto'>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-white">Cover Photo</legend>
          <ImageUploadCropper
            type="cover"
            onImageCropped={(file: File) => {
              setOnboardingData(prev => ({ ...prev, coverImage: file }))
            }}
          />
        </fieldset>
      </div>

      <div className='flex flex-col w-full relative'>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-white">Bio</legend>
          <textarea
            className="textarea bg-transparent border-2 border-stone-600 h-36 w-full focus:border-yellow-500 text-white"
            placeholder="Bio"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            maxLength={MAX_BIO_LENGTH}
            data-gramm="false"
            data-enable-grammarly="false"
          />
          <div className="flex justify-between text-xs">
            <span className={isTooShort ? 'text-red-500' : 'text-stone-400'}>
              {isTooShort ? `Minimum ${MIN_BIO_LENGTH} characters` : 'Optional'}
            </span>
            <span className={bio.length > MAX_BIO_LENGTH ? 'text-red-500' : 'text-stone-400'}>
              {bio.length}/{MAX_BIO_LENGTH}
            </span>
          </div>
        </fieldset>
      </div>

      <div className='flex flex-col w-full relative'>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-white">Date of Birth</legend>
          <label className="form-control w-full text-white">
            <input
              type="date"
              className="input input-bordered w-full bg-transparent border-stone-600 text-white focus:border-yellow-500"
              value={onboardingData.dob}
              onChange={(e) => {
                const value = e.target.value
                const thirteenYearsAgo = new Date()
                thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13)
                setDOBError(new Date(value) > thirteenYearsAgo ? 'You must be 13+ to join' : '')
                setOnboardingData(prev => ({ ...prev, dob: value }))
              }}
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </label>
          {dobError && <p className="fieldset-label text-red-500">{dobError}</p>}
        </fieldset>
      </div>

      <div className='flex flex-row gap-1 w-full'>
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-white">Location</legend>
          <input
            type="text"
            className="input input-bordered w-full bg-transparent border-2 border-stone-600 focus:border-yellow-500 rounded-lg text-white"
            placeholder="Location"
            onChange={(e) => setOnboardingData(prev => ({ ...prev, location: e.target.value }))}
            value={onboardingData.location}
          />
        </fieldset>

        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-white">Occupation</legend>
          <input
            type="text"
            className="input input-bordered w-full bg-transparent border-2 border-stone-600 focus:border-yellow-500 rounded-lg text-white"
            placeholder="Occupation"
            onChange={(e) => setOnboardingData(prev => ({ ...prev, occupation: e.target.value }))}
            value={onboardingData.occupation}
          />
        </fieldset>
      </div>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend text-white">Add Social Links</legend>
        {onboardingData.socialLinks.map((link, index) => (
          <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
            <select
              value={link.platform}
              onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
              className="bg-stone-950 border-2 border-stone-600 rounded-md px-4 py-2 text-white w-[36.9%] focus:outline-none focus:border-yellow-500"
            >
              <option value="">Select Platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="https://yourlink.com"
              value={link.url}
              onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
              className="bg-transparent border-2 border-stone-600 rounded-md px-4 py-2 text-white w-full placeholder-stone-400 focus:outline-none focus:border-yellow-500"
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleSocialLinkRemove(index)}
                className="text-red-500 hover:text-red-700 text-md font-bold"
              >
                ✕ Remove
              </button>
            )}
            <div className="divider divider-warning m-0"></div>
          </div>
        ))}
        <button className='btn btn-outline bg-transparent border-2 border-yellow-500 shadow-none' onClick={handleAddSocialLink}>
          <PlusIcon width={20} color='white' /><p className='pb-1 text-md text-white'>Add Social Link</p>
        </button>
        <p className="fieldset-label text-stone-300">Optional</p>
      </fieldset>

      <button
        className="flex w-full justify-center cursor-pointer rounded-md bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
        onClick={() => setStep(step + 1)}
      >
        Continue
      </button>

      <button className='btn bg-transparent border-none text-stone-300 shadow-none' onClick={() => setStep(step - 1)}>
        Go Back
      </button>

      <div className="my-8 flex space-x-2 mx-auto">
        {Array.from({ length: 5 }).map((_, index) => (
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