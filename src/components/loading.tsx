import React from 'react';

const Loading = () => {
    return (
        <div className='flex space-x-2 justify-center items-center h-screen'>
            <span className='sr-only'>Loading...</span>
            <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]'/>
            <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]'/>
            <div className='h-8 w-8 bg-blue-500 rounded-full animate-bounce'/>
        </div>
    );
};

export default Loading;