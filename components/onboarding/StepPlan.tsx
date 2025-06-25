// File: components/onboarding/StepSelectPlan.tsx

'use client'

import { useContext } from 'react'
import { OnboardingContext } from './OnboardingWrapper'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import { createAccountWithUsername, fetchAccount } from '@lens-protocol/client/actions'
import { storageClient } from '@/helper/storageClient'
import { immutable } from '@lens-chain/storage-client'
import { chains } from '@lens-chain/sdk/viem'
import { ethers } from 'ethers'
import { account, MetadataAttributeType } from '@lens-protocol/metadata'
import { useAtom } from 'jotai'
import { userAtom } from '@/store/authState'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { client } from '@/helper/lensClient'
import { handleOperationWith } from '@lens-protocol/client/viem'
import { evmAddress, never } from '@lens-protocol/client'
import { signMessageWith } from '@lens-protocol/client/ethers'
import { useRouter } from 'next/navigation'
import { onboardUser } from '@/actions/user'


interface onboardPayload  {
    username: string,
    email: string,
    wallet: string,
    address: string,
    pin: string,
    accountAddress: string,
  }
  

export default function StepSelectPlan() {
  const context = useContext(OnboardingContext)
  if (!context) throw new Error("OnboardingContext not found")

  const { step, setStep, onboardingData, setOnboardingData } = context;

  const [user, setUser] = useAtom(userAtom);

  const handlePlanSelect = (plan: 'free' | 'pro' | 'max') => {
    setOnboardingData(prev => ({ ...prev, plan }))
  }

  const router = useRouter();

  async function handleUserCreation() {
  
      const acl = immutable(chains.testnet.id);
  
      const fetchImageAsFile = async (path: string, name: string): Promise<File> => {
        const res = await fetch(path);
        const blob = await res.blob();
        return new File([blob], name, { type: blob.type });
      };

      let profileUri = '';
      let coverUri = '';
  
      if(!onboardingData.profileImage)
      {
        const defaultProfile = await fetchImageAsFile('/defaultProfilePhoto.png', 'default-profile.png');
        profileUri = (await storageClient.uploadFile(defaultProfile, { acl })).uri;
      }
      
      if(!onboardingData.coverImage)
      {
        const defaultCover = await fetchImageAsFile('/defaultCover.png', 'default-cover.png');
        coverUri = ((await storageClient.uploadFile(defaultCover, { acl })).uri);
      }
  
      if(onboardingData.profileImage)
      {
        profileUri = (await storageClient.uploadFile(onboardingData.profileImage, { acl })).uri;
      }
      
      if(onboardingData.coverImage)
      {
        coverUri = (await storageClient.uploadFile(onboardingData.coverImage, { acl })).uri;
      }
  
      console.log(profileUri, coverUri);
  
      const socialLinksJSON = onboardingData.socialLinks.reduce((acc, curr) => {
        if (curr.platform && curr.url) {
          acc[curr.platform] = curr.url;
        }
        return acc;
      }, {} as Record<string, string>);
  
      const wallet = ethers.Wallet.createRandom();
      const encrypted = await wallet.encrypt(onboardingData.pin);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);
  
      const metadata = account({
        name: user.name,
        bio: onboardingData.bio,
        picture: profileUri,
        coverPicture: coverUri,
        attributes:[
          {
            key: 'username',
            type: MetadataAttributeType.STRING, //0
            value: onboardingData.username,
          },
          {
            key: 'DOB',
            type: MetadataAttributeType.STRING, //1
            value: onboardingData.dob,
          },
          {
            key: 'location',
            type: MetadataAttributeType.STRING, //2
            value: onboardingData.location,
          },
          {
            key: 'occupation',
            type: MetadataAttributeType.STRING, //3
            value: onboardingData.occupation,
          },
          {
            key: 'h3xPro',
            type: MetadataAttributeType.STRING, //4
            value: onboardingData.plan,
          },
          {
            key: 'walletAddress',
            type: MetadataAttributeType.STRING, //5
            value: wallet.address,
          },
          {
            key: 'socialLinks',
            type: MetadataAttributeType.JSON, //7
            value: JSON.stringify(socialLinksJSON),
          },
        ]
      });
  
      const { uri } = await storageClient.uploadAsJson(metadata);
  
      const walletClient = createWalletClient({
        account: privateKeyToAccount(wallet.privateKey as `0x{string}`),
        chain: chains.testnet,
        transport: http(),
      });
  
      const authenticated = await client.login({
        onboardingUser: {
          app: "0xa4de8E77b3F92005C84ff4dDd184b1F097aF11a2",
          wallet: signer.address,
        },
        signMessage: signMessageWith(signer),
      });
      
      if (authenticated.isErr()) {
        return console.error(authenticated.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = authenticated.value;
  
      const result = await createAccountWithUsername(sessionClient, {
        username: {
          localName: onboardingData.username,
          namespace: evmAddress("0x0c978F29b462762A1b64e10E0c7052353E743a2e"),
        },
        metadataUri: uri,
      })
      .andThen(handleOperationWith(walletClient))                                                                                                                                                       
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash) => fetchAccount(sessionClient, { txHash }))
      .andThen((account) =>
        sessionClient.switchAccount({
          account: account?.address ?? never("Account not found"),
        })
      );
      

      console.log(result);

      if(result.isOk())
      {
        const fetchedAccount = await fetchAccount(client, {
          username: {
            localName: onboardingData.username,
            namespace: evmAddress("0x0c978F29b462762A1b64e10E0c7052353E743a2e"), // the Username namespace address
          },
        });
        
        if (fetchedAccount.isErr()) {
          return console.error(fetchedAccount.error);
        }
        
        const account = fetchedAccount.value;

        const onboardPayload = {
          username: onboardingData.username,
          email: user.email,
          wallet: encrypted,
          pin: onboardingData.pin,
          address: wallet.address,
          accountAddress: account?.address
        }

        console.log(account?.address)

        onboardUser(onboardPayload as onboardPayload).then((res) => {

            if(res.success)
            {
                console.log(privateKeyToAccount(wallet.privateKey as `0x{string}`))
                console.log(result)
                setUser({...user, username: onboardingData.username, wallet: encrypted, pin: onboardingData.pin, address: wallet.address, accountAddress: account?.address})
                router.push(`/${onboardingData.username}`)
            }

            if(res.error)
            {
                console.log(res)
            }

        })
      
      //console.log(fetchedAccount)
  
    }
  }

  return (
    <div className='h-full sm:h-screen pt-8 flex flex-col w-full mx-auto'>
      <h1 className="text-3xl sm:text-3xl font-bold text-yellow-500 text-center">
        Choose Your Plan
      </h1>

      <p className="text-sm text-stone-400 text-center">
        Step {step + 1} of 5
      </p>

      <div className="mt-10 text-white px-4 ">
        <div className="flex flex-col gap-6 items-center sm:w-[30%] mx-auto">

          {/* Free Plan */}
          <div
            onClick={() => handlePlanSelect('free')}
            className={`border ${onboardingData.plan === 'free' ? 'border-2 border-yellow-500' : 'border-stone-700'} rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition`}
          >
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-yellow-500 text-2xl font-bold mb-4">$0<span className="text-sm text-stone-400">/month</span></p>
            <ul className="text-sm text-stone-300 space-y-1">
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Unlimited Posts</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Product Listings & Affiliate Products</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Unlimited Links</li>
            </ul>
          </div>

          {/* h3xPro Plan */}
          <div
            onClick={() => handlePlanSelect('pro')}
            className={`border ${onboardingData.plan === 'pro' ? 'border-2 border-yellow-500' : 'border-stone-700'} rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition`}
          >
            <h3 className="text-xl font-semibold mb-2">h3xPro</h3>
            <p className="text-yellow-500 text-2xl font-bold mb-4">$8.88<span className="text-sm text-stone-400">/month</span></p>
            <ul className="text-sm text-stone-300 space-y-1">
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> All Free Plan features</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Advanced Analytics</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Verified Badge</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Book/Sell Appointments</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Sell Digital Products</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Members-only Content</li>
            </ul>
          </div>

          {/* HexMax Plan */}
          <div
            onClick={() => handlePlanSelect('max')}
            className={`border ${onboardingData.plan === 'max' ? 'border-2 border-yellow-500' : 'border-stone-700'} rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition`}
          >
            <h3 className="text-xl font-semibold mb-2">h3xMax</h3>
            <p className="text-yellow-500 text-2xl font-bold mb-4">$36.9<span className="text-sm text-stone-400">/month</span></p>
            <ul className="text-sm text-stone-300 space-y-1">
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> All h3xPro features</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> 1TB Storage</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Premium Badge</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Featured Feed Visibility</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> HexLife AI (Fitness, Wellness)</li>
              <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> AI Caption & Thread Generator</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full mt-6 space-y-2">
            <button
              className='btn bg-yellow-500 text-black border-2 border-yellow-500 shadow-none'
              onClick={() => handleUserCreation()}
            >
              Continue with {onboardingData.plan === 'max' ? 'h3xMax' : onboardingData.plan === 'pro' ? 'h3xPro' : 'Free'} Plan
            </button>
            <button
              className='btn bg-transparent border-none text-stone-300 shadow-none'
              onClick={() => setStep(step - 1)}
            >
              Go Back
            </button>
          </div>

          <div className="flex space-x-2 mt-4 pb-8 mx-auto">
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
      </div>
    </div>
  )
}
