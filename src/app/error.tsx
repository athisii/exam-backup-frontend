"use client"

import React, {useEffect, useState} from 'react';

const Error = ({error, reset}: {
    error: Error & { digest?: string },
    reset: () => void
}) => {

    const [fetchError, setFetchError] = useState<boolean>(false)

    useEffect(() => {
        console.error(error)
        if (error.message.includes("fetch failed")) {
            setFetchError(true)
        }
    }, [error])

    return (
        <main className="flex justify-center font-[sans-serif]">
            <div
                className="flex h-screen w-full flex-col justify-center items-center gap-2 bg-gray-300 shadow-lg sm:w-[60vw]">
                {
                    fetchError ? (
                            <>
                                <h1>Oops. It looks like the server is down.</h1>
                                <button className='border border-1 bg-blue-500 p-2 rounded-md text-white'
                                        onClick={reset}>Try again
                                </button>
                            </>) :
                        <>
                            <h1>Something went wrong.</h1>
                            <h1>Please contact the system admin.</h1>
                            <button className='border border-1 bg-blue-500 p-2 rounded-md text-white'
                                    onClick={reset}>Try again
                            </button>
                        </>
                }
            </div>
        </main>

    )
        ;
};

export default Error;