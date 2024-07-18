import React from 'react';

const NotFound = () => {
    return (
        <main className="flex justify-center font-[sans-serif]">
            <div
                className="flex h-screen w-full flex-col justify-center items-center gap-2 bg-gray-300 shadow-lg sm:w-[60vw]">
                <h1>404</h1>
                <h1>Could not find the requested resource.</h1>
            </div>
        </main>
    );
};

export default NotFound;