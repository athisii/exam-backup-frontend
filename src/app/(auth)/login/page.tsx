"use client"

import React, {useState} from 'react';
import {useFormState} from 'react-dom';
import Link from "next/link";
import {login} from '@/app/(auth)/login/actions'


const LoginPage = () => {
    const [state, action] = useFormState(login, {message: ''});
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    return (
        <main className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow-lg  md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            CDAC Exam BackUp
                        </h1>
                        <div className='text-center text-red-500'>
                            <p> {state?.message}</p>
                        </div>
                        <form className="space-y-4 md:space-y-6" action={action}>
                            <div>
                                <input autoFocus
                                       type="text" name="username"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       placeholder="Username or centre code" required/>
                            </div>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600"
                                >
                                    <svg
                                        className="shrink-0 size-3.5"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        {isPasswordVisible ? (
                                            <>
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                <circle cx="12" cy="12" r="3"/>
                                            </>
                                        ) : (
                                            <>
                                                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                <path
                                                    d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                <path
                                                    d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                <line x1="2" x2="22" y1="2" y2="22"/>
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>
                            <div className="text-end">
                                <Link href={"/forgot-password"}
                                      className="text-sm font-medium text-primary-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <button type="submit"
                                    className="w-full text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign
                                in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;