'use client'

import React, { useState } from 'react'
import ImageUploadCropper from '../utils/ImageUploadCropper';
import { MetadataAttributeType, account } from "@lens-protocol/metadata";
import { setAccountMetadata } from "@lens-protocol/client/actions";
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState';
import { platforms } from '@/constants/socialLinksPlatforms';
import { PlusIcon } from '@heroicons/react/24/outline';
import { storageClient } from '@/helper/storageClient';
import { client } from '@/helper/lensClient';
import { uri } from '@lens-protocol/client';
import { ethers } from 'ethers';
import { handleOperationWith } from '@lens-protocol/client/ethers';
import { immutable } from '@lens-chain/storage-client';
import { chains } from '@lens-chain/sdk/viem';

interface SocialLink {
  platform: string
  url: string
}

interface Profile {
    name: string,
    username: string,
    profileImage: string;
    coverImage: string;
    bio: string;
    socialLinks: SocialLink[];
    plan: string;
    location: string;
    occupation: string;
}

interface EditProfileModalProps {
  onClose: () => void
  onSave: (data: any) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose, onSave }) => {
  const [user] = useAtom(userAtom);
  const [profile, setProfile] = useState<Profile>({
      name: user.name,
      username: user.username!,
      profileImage: user.profileImage!,
      coverImage: user.coverImage!,
      bio: user.bio!,
      socialLinks: user.socialLinks!,
      plan: 'free',
      location: user.location!,
      occupation: user.occupation!,
  });

  const [newPlatform, setNewPlatform] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const [profileImage, setProfileImage] = useState<File|null>(null);
  const [coverImage, setCoverImage] = useState<File|null>(null);

  const [loading, setLoading] = useState(false);

  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updated = [...profile.socialLinks]
    updated[index][field] = value
    setProfile({ ...profile, socialLinks: updated })
  }

  const handleAddSocialLink = () => {
    setProfile({ ...profile, socialLinks: [...profile.socialLinks, { platform: '', url: '' }] })
  }

  const handleSocialLinkRemove = (index: number) => {
    const updated = profile.socialLinks.filter((_, i) => i !== index)
    setProfile({ ...profile, socialLinks: updated })
  }

  const handleSubmit = async () => {
    setLoading(true);

    let profileUri = '';
    let coverUri = '';

    const acl = immutable(chains.testnet.id);

    if(profileImage != null)
    {
      profileUri = (await storageClient.uploadFile(profileImage, { acl })).uri;
    }
    
    if(coverImage != null)
    {
      coverUri = (await storageClient.uploadFile(coverImage, { acl })).uri;
    }

    const metadata = account({
      name: profile.name,
      bio: profile.bio,
      picture: profileImage ? profileUri : profile.profileImage,
      coverPicture: coverImage ? coverUri : profile.coverImage,
      attributes:[
        {
          key: 'username',
          type: MetadataAttributeType.STRING, //0
          value: profile.username,
        },
        {
          key: 'DOB',
          type: MetadataAttributeType.STRING, //1
          value: user.dob!,
        },
        {
          key: 'location',
          type: MetadataAttributeType.STRING, //2
          value: profile.location,
        },
        {
          key: 'occupation',
          type: MetadataAttributeType.STRING, //3
          value: profile.occupation,
        },
        {
          key: 'h3xPro',
          type: MetadataAttributeType.STRING, //4
          value: profile.plan,
        },
        {
          key: 'walletAddress',
          type: MetadataAttributeType.STRING, //5
          value: user.address!,
        },
        {
          key: 'socialLinks',
          type: MetadataAttributeType.JSON, //7
          value: JSON.stringify(profile.socialLinks),
        },
      ]
    });

    const { uri: AccountMetadata } = await storageClient.uploadAsJson(metadata);

    const resumed = await client.resumeSession();
                  
    if (resumed.isErr()) {
      return console.error(resumed.error);
    }
    
    // SessionClient: { ... }
    const sessionClient = resumed.value;

    const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
    const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
    const signer = wallet.connect(provider);
    
    const result = await setAccountMetadata(sessionClient, {
      metadataUri: uri(AccountMetadata),
    }).andThen(handleOperationWith(signer));

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
            <fieldset className="">
              <legend className="text-yellow-400 pb-2">Profile Photo</legend>
              <div className="avatar w-48 mx-auto">
                <ImageUploadCropper
                  type="profile"
                  onImageCropped={(file: File) => {
                    setProfileImage(file)
                  }}
                />
              </div>
            </fieldset>
          </div>          
      
          <div className='py-6 relative w-full mx-auto'>
            <fieldset className="">
              <legend className="text-yellow-400 pb-2">Cover Photo</legend>
              <ImageUploadCropper
                type="cover"
                onImageCropped={(file: File) => {
                  setCoverImage(file)
                }}
              />
            </fieldset>
          </div>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Full Name</legend>
            <input className="input w-full bg-transparent border border-stone-600 focus:border-yellow-500 h-12" value={profile.name} onChange={(e) => setProfile(prevProfile => ({...prevProfile, name: e.target.value}))} />
          </fieldset>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Username</legend>
            <input disabled className="input w-full bg-transparent border border-stone-600 focus:border-yellow-500 h-12" value={profile.username} onChange={(e) => setProfile(prevProfile => ({...prevProfile, username: e.target.value}))} />
          </fieldset>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Bio</legend>
            <textarea className="textarea w-full bg-transparent border border-stone-600 focus:border-yellow-500" value={profile.bio!} onChange={(e) => setProfile(prevProfile => ({...prevProfile, bio: e.target.value}))} />
          </fieldset>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Location</legend>
            <input className="input w-full bg-transparent border border-stone-600 focus:border-yellow-500 h-12" value={profile.location!} onChange={(e) => setProfile(prevProfile => ({...prevProfile, location: e.target.value}))} />
          </fieldset>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Occupation</legend>
            <input className="input w-full bg-transparent border border-stone-600 focus:border-yellow-500 h-12" value={profile.occupation} onChange={(e) => setProfile(prevProfile => ({...prevProfile, occupation: e.target.value}))} />
          </fieldset>

          <fieldset className="">
            <legend className="text-yellow-400 pb-2">Social Links</legend>
            {profile.socialLinks.map((link, index) => (
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
          </fieldset>
        </div>

        <button className="btn w-full bg-yellow-500 text-black mt-6 shadow-none border-none" onClick={handleSubmit}>
          { loading ? <span></span> : <p>Save Changes</p> }
        </button>
      </div>
    </div>
  )
}

export default EditProfileModal
