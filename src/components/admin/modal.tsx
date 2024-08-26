import React from 'react';


const Modal = ({children}: {
    children: React.ReactNode
}) => {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                <div className="p-2 text-center">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;