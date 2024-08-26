"use client"

import React from 'react';
import {useFormState} from 'react-dom';
import Link from "next/link";
import {login} from '@/app/(auth)/login/actions'


const LoginPage = () => {
    const [state, action] = useFormState(login, {message: ''});
    return (
        <main className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow-lg  md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in to your account
                        </h1>
                        <div className='text-center text-red-500'>
                            <p> {state?.message}</p>
                        </div>
                        <form className="space-y-4 md:space-y-6" action={action}>
                            <div>
                                <input autoFocus
                                       type="text" name="username"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       placeholder="Username or Centre Code" required/>
                            </div>
                            <div>
                                <input type="password" name="password" placeholder="Password"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       required/>
                            </div>
                            <div className="text-end">
                                <Link href="/forgot-password"
                                      className="text-sm font-medium text-primary-600 hover:underline">
                                    Forgot password?</Link>
                            </div>
                            <button type="submit"
                                    className="w-full text-white bg-primary-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign
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