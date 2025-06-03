'use client'

import React, { useState } from 'react'
import ImageUploadCropper from '../utils/ImageUploadCropper';

interface SocialLink {
  platform: string
  url: string
}

interface Profile {
    name: string,
    username: string;
    profileImage: File | null;
    coverImage: File | null;
    bio: string;
    socialLinks: SocialLink[];
    plan: string;
    location: string;
    occupation: string;
    address: string;
}

interface EditProfileModalProps {
  onClose: () => void
  onSave: (data: any) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onSave }) => {
    const [profile, setProfile] = useState<Profile>({
        name: '',
        username: '',
        profileImage: null,
        coverImage: null,
        bio: '',
        socialLinks: [],
        plan: 'free',
        location: ' ',
        occupation: ' ',
        address: '',
    });

  const [newPlatform, setNewPlatform] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSocialLinkAdd = () => {
    if (newPlatform && newUrl) {
      setProfile(prevProfile => ({
          ...prevProfile,
          socialLinks: [...prevProfile.socialLinks, {platform: newPlatform, url: newUrl}]
      }));
      setNewPlatform('')
      setNewUrl('')
    }
  }

  const handleSubmit = () => {
    onSave({profile})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex justify-center items-center px-4">
      <div className="bg-stone-900 text-white w-full max-w-xl rounded-xl p-6 relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-4 text-xl font-bold text-white">×</button>
        <h2 className="text-2xl font-bold mb-4 text-yellow-500">Edit Profile</h2>

        <div className="space-y-4">
          
          <div className='pt-8'>
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-white mx-auto">Profile Photo</legend>
              <div className="avatar w-48 mx-auto">
                <ImageUploadCropper
                  type="profile"
                  onImageCropped={(file: File) => {
                    setProfile(prev => ({ ...prev, profileImage: file }))
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
                  setProfile(prev => ({ ...prev, coverImage: file }))
                }}
              />
            </fieldset>
          </div>

          <input className="input w-full bg-transparent border focus:border-yellow-500 h-12" placeholder="Full Name" value={profile.name} onChange={(e) => setProfile(prevProfile => ({...prevProfile, name: e.target.value}))} />

          <input className="input w-full bg-transparent border focus:border-yellow-500 h-12" placeholder="Username" value={profile.username} onChange={(e) => setProfile(prevProfile => ({...prevProfile, username: e.target.value}))} />

          <textarea className="textarea w-full bg-transparent border focus:border-yellow-500" placeholder="Bio" value={profile.bio!} onChange={(e) => setProfile(prevProfile => ({...prevProfile, bio: e.target.value}))} />

          <input className="input w-full bg-transparent border focus:border-yellow-500 h-12" placeholder="Location" value={profile.location!} onChange={(e) => setProfile(prevProfile => ({...prevProfile, location: e.target.value}))} />
          
          <input className="input w-full bg-transparent border focus:border-yellow-500 h-12" placeholder="Occupation" value={profile.occupation} onChange={(e) => setProfile(prevProfile => ({...prevProfile, occupation: e.target.value}))} />

          <div className="border border-stone-700 rounded p-3">
            <p className="font-semibold mb-2 text-yellow-400">Social Links</p>
            <div className="flex gap-2 mb-2">
              <input className="input w-1/3 bg-transparent border focus:border-yellow-500" placeholder="Platform" value={newPlatform} onChange={(e) => setNewPlatform(e.target.value)} />
              <input className="input w-2/3 bg-transparent border focus:border-yellow-500" placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
              <button className="btn bg-yellow-500 text-black px-3" onClick={handleSocialLinkAdd}>Add</button>
            </div>
            <ul className="list-disc list-inside text-sm text-gray-400">
              {profile.socialLinks.map((link, index) => (
                <li key={index}>{link.platform}: {link.url}</li>
              ))}
            </ul>
          </div>
        </div>

        <button className="btn w-full bg-yellow-500 text-black mt-6 shadow-none border-none" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default EditProfileModal
