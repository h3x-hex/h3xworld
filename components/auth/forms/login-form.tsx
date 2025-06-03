'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema, TLoginSchema } from '@/schemas' 
import { loginAction } from '@/actions/login'
import Image from 'next/image'
import { userAtom } from '@/store/authState'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { client } from '@/helper/lensClient'
import { ethers } from 'ethers'
import { signMessageWith } from '@lens-protocol/client/ethers'

const LoginForm = () => {

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [user, setUser] = useAtom(userAtom);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: TLoginSchema) => {
    setLoading(true);
    loginAction(data).then(async (res) => {
      if (res.error) {
        setLoading(false)
        if (errors.email) {
          setError("email", {
            type: "server",
            message: res.error,
          });
        } else if (errors.password) {
          setError("password", {
            type: "server",
            message: res.error,
          });
        } else {
            if(res.error === "User not found!")
            {
              setError("email", {
                type: "server",
                message: res.error,
              });
            }
            if(res.error === "Invalid Credentials")
              {
                setError("password", {
                  type: "server",
                  message: res.error,
                });
              }
            else {
              setError("password", {
                type: "server",
                message: res.error,
              });
            }
        }
        return;
      }
      console.log(success);
      setUser(res.success!);

      const wallet = await ethers.Wallet.fromEncryptedJson(user.wallet!, user.pin!);
      const provider = new ethers.JsonRpcProvider('https://shape-mainnet.g.alchemy.com/v2/xo6V5kULZHRCwGEuinRFYq_8Ma4rD8Mx');
      const signer = wallet.connect(provider);
      
      //"0x7c65ce360ae76070a1f6453070b52ff0698b161a4a771a4c0456d939c1383dc7"
      
      const authenticated = await client.login({
        accountOwner: {
          account: user.accountAddress,
          app: "0xa4de8E77b3F92005C84ff4dDd184b1F097aF11a2",
          owner: wallet.address,
        },
        signMessage: signMessageWith(signer),
      });
      
      if (authenticated.isErr()) {
        console.log('first')
        return console.error(authenticated.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = authenticated.value;

      console.log(sessionClient)

      setSuccess("User Logged In");
      router.push('/home');
      console.log(res.success);
      setLoading(false);
    });
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center sm:px-6 lg:px-8">
      <div className=" sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-stone-950 px-6 pt-6 pb-12 sm:rounded-lg sm:px-12 sm:border-1 sm:border-gray-500 ">
          <div className="sm:mx-auto sm:w-full sm:max-w-md pb-6">
            <Image
              alt="Your Company"
              src="/logo.png"
              width={64}
              height={64}
              className="mx-auto cursor-pointer"
              onClick={() => router.push('/')}
            />
            <h2 className="mt-3 text-center text-3xl font-bold text-gray-300">
              Enter h<span className='text-yellow-500'>3</span>x.world
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} method="POST" className="flex flex-col">
            <div>
              <fieldset className="fieldset">
                <legend className="fieldset-legend text-gray-300 text-[1rem]">Email</legend>
                <input {...register("email")} type="email" className="input w-full bg-transparent border-2 border-gray-400 focus:border-2 focus:border-yellow-500 rounded-md text-white" placeholder="Enter Email" />
                {errors.email && (
                  <p className="fieldset-label text-red-500">{`${errors.email.message}`}</p>
                )}
              </fieldset>
            </div>

            <fieldset className="fieldset">
              <legend className="fieldset-legend text-gray-300 text-[1rem]">Password</legend>
              <input {...register("password")} type="password" className="input w-full bg-transparent border-2 border-gray-400 focus:border-2 focus:border-yellow-500 rounded-md text-white" placeholder="Password" />
              {errors.password && (
                <p className="fieldset-label text-red-500">{`${errors.password.message}`}</p>
              )}
            </fieldset>

            <div className='pt-6'>
              {
                loading ?

                <button
                  type="submit"
                  disabled
                  className="btn flex w-full justify-center rounded-md text-white border-yellow-500 border-2 bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                >
                  <span className="loading loading-spinner"></span> Entering...
                </button>
                
                :
                
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500 cursor-pointer"
                >
                  Enter h3x.world
                </button>
              }
            </div>
          </form>
          <div className="divider"></div>
          <div className='flex flex-row gap-3 text-center pt-8 pl-18'>
            <p className="text-sm/6 text-gray-300">
              Not a member?{' '}
            </p>
            <p className="font-semibold text-yellow-500 hover:text-yellow-500 cursor-pointer" onClick={() => router.push('/auth/register')}>
              Join h3x.world
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginForm