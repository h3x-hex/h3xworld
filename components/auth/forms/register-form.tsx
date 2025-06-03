'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterSchema, TRegisterSchema } from '@/schemas'
import { registerAction } from '@/actions/register'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const RegisterForm = () => {

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TRegisterSchema>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data: TRegisterSchema) => {
    setLoading(true);
    registerAction(data).then((res) => {
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
        } else if (errors.confirmPassword) {
          setError("confirmPassword", {
            type: "server",
            message: res.error,
          });
        } else {
            if(res.error === "Email already is in use. Please try another one.")
            {
              setError("email", {
                type: "server",
                message: res.error,
              });
            }
            else {
              alert(res.error);
            }
        }
        return;
      }
      setSuccess("User Registered");
      console.log(success)
      setLoading(false);
    });
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center sm:px-6 lg:px-8 py-16">
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
                Join h<span className='text-yellow-500'>3</span>x.world
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

              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend text-gray-300 text-[1rem] ">Name</legend>
                  <input {...register("name")} type="text" className="input w-full bg-transparent border-2 border-gray-400 focus:border-2 focus:border-yellow-500 rounded-md text-white" placeholder="Enter your name" />
                  {errors.name && (
                    <p className="fieldset-label text-red-500">{`${errors.name.message}`}</p>
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

              <fieldset className="fieldset">
                <legend className="fieldset-legend text-gray-300 text-[1rem]">Confirm Password</legend>
                <input {...register("confirmPassword")} type="password" className="input w-full bg-transparent border-2 border-gray-400 focus:border-2 focus:border-yellow-500 rounded-md text-white" placeholder="Confirm Password" />
                {errors.confirmPassword && (
                  <p className="fieldset-label text-red-500">{`${errors.confirmPassword.message}`}</p>
                )}
              </fieldset>

              <div className='pt-6 pb-16'>
                {
                  loading ?

                  <button
                    type="submit"
                    disabled
                    className="btn flex w-full justify-center rounded-md text-white border-yellow-500 border-2 bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                  >
                    <span className="loading loading-spinner"></span> Joining...
                  </button>
                  
                  :
                  
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-yellow-500 px-3 py-1.5 text-sm/6 font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-500"
                  >
                    Join h3x.world
                  </button>
                }
              </div>
            </form>

            <div className='flex flex-row text-center mx-auto gap-1 pl-18'>
              <p className=" text-center text-sm/6 text-gray-300">
                Already a member?{' '}
              </p>
              <p className="font-semibold text-yellow-500 hover:text-yellow-500 cursor-pointer" onClick={() => router.push('/auth/login')}>
                Enter h3x.world
              </p>
            </div>

          </div>

          
        </div>
      </div>
  )
}

export default RegisterForm