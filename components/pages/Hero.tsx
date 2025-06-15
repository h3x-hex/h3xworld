'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useTypewriter, Cursor } from 'react-simple-typewriter'
import { Canvas } from '@react-three/fiber';
import {  push, ref, set } from "firebase/database";
import { db } from '@/lib/firebase'
import { OrbitControls } from "@react-three/drei"
import H3xCard from '../H3xCard'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Features from '../Hero/Features'
import PricingComparison from '../Hero/Pricing'



const navigation = [
  { name: 'Features', href: '#' },
  { name: 'h3xCard', href: '#' },
  { name: 'Pricing', href: '#' },
]



export default function Hero() {

    const isDesktop = useMediaQuery({ minWidth: 551 });
    const isMobile = useMediaQuery({ maxWidth: 550 }); 
    
    const [text] = useTypewriter({
    words: [ 'Portfolio', 'Shop', 'Link in Bio', 'Campaign', 'Community', 'Brand' ],
    loop: 0,
    typeSpeed: 100,
    })
    
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [addedToWaitlist, setAddedToWaitlist] = useState(false);

    const [email, setEmail] = useState('');

    const router = useRouter();

    const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'max'>('free');

    const scrollToSection = (idName: string, mobile?: boolean) => {
        document.getElementById(idName)!.scrollIntoView({
            behavior: 'smooth',
            block: 'start', 
            inline: 'start' 
        })
        if(mobile) setMobileMenuOpen(false);
    }

    const handlePlanSelect = (plan: 'free' | 'pro' | 'max') => {
        setSelectedPlan(plan)
    }

    function addUserToWaitlist(){
    
        /*emails.forEach((x) =>{
          const timestamp = new Date().getTime();
          set(ref(db, `Waitlist/${timestamp}`), x);
        })*/
        const dbRef = ref(db, 'Waitlist/')
        const newWaitlistUser = push(dbRef);
        set(newWaitlistUser,email);
        setAddedToWaitlist(true);
      }

    return (
        <>
        <div className="bg-stone-950 h-screen w-full">
        <header className="absolute inset-x-0 top-0 z-50">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image
                    alt=""
                    src="/logo.png"
                    width={48}
                    height={48}
                />
                </a>
            </div>
            <div className="flex lg:hidden">
                <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-100"
                >
                <span className="sr-only">Open main menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
            </div>
            <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                <button key={item.name} onClick={() => scrollToSection(item.name)} className="text-sm/6 font-semibold text-gray-100 hover:text-yellow-500">
                    {item.name}
                </button>
                ))}
            </div>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <p className="text-sm/6 font-semibold text-gray-100 hover:text-yellow-500 cursor-pointer" onClick={() => router.push('/auth/login')}>
                Join h3x.world <span aria-hidden="true">&rarr;</span>
                </p>
            </div>
            </nav>
            <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden bg-stone-950">
            <div className="fixed inset-0 z-50 bg-stone-950" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
                <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <Image
                    alt=""
                    width={48}
                    height={48}
                    src="/logo.png"
                    
                    />
                </a>
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-100"
                >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
                </div>
                <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                        <button
                        key={item.name}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-100 hover:bg-gray-50"
                        onClick={() => scrollToSection(item.name, true)}
                        >
                        {item.name}
                        </button>
                    ))}
                    </div>
                    <div className="py-6">
                    <button
                        onClick={() => scrollToSection('Waitlist', true)}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-yellow-500 hover:bg-gray-50"
                    >
                        Join h3xWorld <span aria-hidden="true">&rarr;</span>
                    </button>
                    </div>
                </div>
                </div>
            </DialogPanel>
            </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8">
            <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
            
            </div>
            <div className="mx-auto py-32 sm:py-48 lg:py-56">
            
            <div className="mx-auto text-center text-wrap">
                <p className="text-6xl font-bold tracking-tight text-gray-100">
                    Build your <span className='font-bold text-yellow-500'>{text}<span className='text-yellow-500'><Cursor cursorStyle='| '/></span></span>with
                </p>
                <h1 className="mt-2 text-7xl font-bold tracking-tight text-balance text-gray-100">
                 h<span className='text-yellow-500'>3</span>x<span className='text-gray-300'>.</span>world
                </h1>
                <p className="mt-8 text-xl font-medium text-pretty text-gray-300 sm:text-2xl">
                    Social Media for creators, hustlers, and entrepreneurs.
                </p>
                <p className=" text-md font-medium text-pretty text-gray-300 sm:text-lg">
                    Get your link up and Link up!!!
                </p>
                <p className="text-gray-400">
                    Currently in beta.
                </p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                <button
                    onClick={() => scrollToSection('Waitlist')}
                    className="btn border-yellow-500 rounded-full w-32 h-10 bg-yellow-500 px-3.5 py-2 font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400"
                
                >
                    Get started
                </button>
                <span className='bg-transparent text-gray-300 hover:cursor-pointer' onClick={() => scrollToSection('Features')}>
                    Read more <span aria-hidden="true">&rarr;</span>
                </span>
                </div>
                
            </div>
            </div>
            <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
            
            </div>
        </div>
        </div>
        <div id='Features' className="relative bg-stone-950 pb-24 pt-8 mx-auto">
            <div className="mx-auto px-6 text-center">
                <h2 className="text-lg font-semibold text-yellow-500">Features</h2>
                <div className="mx-auto max-w-7xl text-center mb-10">
                    <p className="mt-2 text-6xl font-semibold tracking-tight text-balance text-gray-100">
                        Packed with features to help you monetize your content and products
                    </p>
                </div>
                
                <Features/>
                <div className="my-20">
                
            </div>
        </div>
        <div className="relative bg-stone-950 pb-32 pt-8 flex" id='h3xCard'>
            <div className="mx-auto flex flex-col text-center ">
                <h2 className="text-lg font-semibold text-yellow-500">h3xCard</h2>
                <p className="mt-2 text-6xl font-semibold tracking-tight text-balance text-gray-100">
                    NFC Business Card. Network with a single tap. 
                </p>
                <div className="mx-auto gap-3">
                    <p className='py-6 text-gray-300 sm:text-xl/8'>Fun fact: Card is in 3D Space, you can move it around.</p>
                        { 
                            isMobile && 

                            <div className="flex flex-wrap py-8 h-[24rem] w-screen bg-stone-900">
                                <Canvas className='w-10/12 h-48'>
                                    <ambientLight intensity={100}/>
                                    <OrbitControls enableZoom={false}/>
                                    <H3xCard scale={[0.4, 0.4, 0.4]}/>
                                </Canvas>
                            </div>
                        }

                        { 
                            isDesktop && 

                            <div className="flex flex-wrap py-8 h-[36rem] w-screen bg-stone-900">
                                <Canvas className='w-10/12 h-96'>
                                    <ambientLight intensity={100}/>
                                    <OrbitControls enableZoom={false}/>
                                    <H3xCard scale={[0.4, 0.4, 0.4]}/>
                                </Canvas>
                            </div>
                        }
                        <div className='pt-8'><button className='btn bg-yellow-500 border-2 border-yellow-500 shadow-none w-36 text-black rounded-full'>Coming Soon</button></div>
                </div>
            </div>
        </div>
        <div id='Pricing' className="bg-stone-950 py-10">
            <div className="flex flex-col mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-lg font-semibold text-yellow-500">Pricing</h2>
                    <p className="mt-2 text-6xl font-semibold tracking-tight text-balance text-gray-100">
                        Pricing that grows with you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-3xl text-center text-lg font-medium text-pretty text-gray-300 sm:text-2xl">
                    Choose an affordable plan that’s packed with the best features for engaging your audience, creating customer
                    loyalty, and driving sales.
                </p>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-300 sm:text-lg">
                    Support Creators. Power the Platform.

                    Your payment goes directly to the creator — they keep 100% of what they earn.
                    We just add a small 8.88% h3x.world fee to keep this platform free, open, and creator-first.

                    You’re not just buying content —
                    You’re fueling the future of digital independence.
                </p>
                <div className="mt-16 flex justify-center">
                
                </div>
                <div className="mt-10 text-white px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Choose your plan</h2>

            <div className="flex flex-col gap-6 items-center w-full mx-auto">

              {/* Free Plan */}
              <div className='flex flex-col sm:flex-row w-full gap-6'>
                <div
                    onClick={() => handlePlanSelect('free')}
                    className={`border flex flex-col mx-auto${
                    selectedPlan === 'free' ? 'border-2 border-yellow-500' : ''
                    } rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition border-stone-700`}
                >
                    <h3 className="text-3xl font-semibold mb-2">Free</h3>
                    <p className="text-yellow-500 text-3xl font-bold mb-4">$0<span className="text-sm text-stone-400">/month</span></p>
                    <ul className="text-sm text-stone-300 space-y-1 gap-3 flex flex-col">
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Unlimited Posts</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Unlimited Product Listings & Affiliate Products</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Unlimited Links</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Book/Sell Appointments and Services</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Sell Digital Products</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> h3xclusive Members-only Content</li>
                    </ul>
                </div>

                {/* h3xPro Plan */}
                <div
                    onClick={() => handlePlanSelect('pro')}
                    className={`border flex flex-col mx-auto${
                    selectedPlan === 'pro' ? 'border-2 border-yellow-500' : ''
                    } rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition border-stone-700`}
                >
                    <h3 className="text-3xl font-semibold mb-2">h3xPro</h3>
                    <p className="text-yellow-500 text-3xl font-bold mb-4">$8.88<span className="text-sm text-stone-400">/month</span></p>
                    <ul className="text-sm text-stone-300 space-y-1 gap-3 flex flex-col">
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> All Free Plan features</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Create Clubs for community building</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Advanced Analytics</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Verified Badge</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> 100GB Storage for Shop and Content (Unlimited after beta)</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> AI integration, Ad Credits and more features coming soon after beta</li>
                    </ul>
                </div>

                {/* HexPro Plan */}
                <div
                    onClick={() => handlePlanSelect('max')}
                    className={`border flex flex-col mx-auto${
                    selectedPlan === 'max' ? 'border-2 border-yellow-500' : ''
                    } rounded-lg p-6 w-full cursor-pointer hover:border-yellow-500 transition border-stone-700`}
                >
                    <h3 className="text-3xl font-semibold mb-2">h3xMax</h3>
                    <p className="text-yellow-500 text-3xl font-bold mb-4">$36.9<span className="text-sm text-stone-400">/month</span></p>
                    <ul className="text-sm text-stone-300 space-y-1 gap-3 flex flex-col">
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> All h3xPro features</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Golden Verified Badge</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> Featured Feed Visibility</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> 1TB Storage for Shop and Content (Unlimited after beta)</li>
                        <li className='flex'><CheckIcon className="h-5 w-5 text-yellow-500 mr-1" /> AI integration, Ad Credits and more features coming soon after beta</li>
                    </ul>
                </div>
              </div>
              {/* Action Buttons 
              <div className="flex flex-col w-full max-w-sm mt-6 space-y-2">
                {selectedPlan === 'free' && (
                  <button className='btn bg-yellow-500 text-black border-2 border-yellow-500 shadow-none'>
                    Continue with Free Plan
                  </button>
                )}
                {selectedPlan === 'pro' && (
                  <button className='btn bg-yellow-500 text-black border-2 border-yellow-500 shadow-none'>
                    Continue with h3xPro
                  </button>
                )}
                {selectedPlan === 'max' && (
                  <button className='btn bg-yellow-500 text-black border-2 border-yellow-500 shadow-none'>
                    Continue with h3xMax
                  </button>
                )}
              </div>*/}
              <div className='overflow-x-auto w-full relative flex mx-auto'>
                <PricingComparison/>
              </div>

              <div className='flex flex-row mx-auto pr-3 gap-8' id={'Waitlist'}>
                <div className='flex flex-col gap-3 items-center justify-center'>
                    {
                        addedToWaitlist ?

                        <h1  className='text-xl mx-auto pb-3'>Joined the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist. Thank you and see you soon!</h1>
                        :
                        <h1  className='text-xl mx-auto pb-3'>Join the h<span className='text-[#d69e2e]'>3</span>x<span className='text-[#888888]'>.</span>world beta waitlist.</h1>
                    }
                    <input type="text" placeholder="Email" className="input input-bordered text-lg text-white w-80 bg-stone-950 border border-yellow-500 outline-none shadow-none" disabled={addedToWaitlist} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <button className='btn btn-warning text-black w-80' onClick={() => addUserToWaitlist()} disabled={addedToWaitlist}>Join h3x.world</button>
                </div>
              </div>
              
            </div>
          </div>
            </div>
        </div>
    </div>
        
    </>
    )
}