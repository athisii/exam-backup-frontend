"use client";

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { confirmPasswordReset, sendOtp } from './actions';

const ForgotPassword = () => {
    const [userId, setUserId] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [disableBtn, setDisableBtn] = useState(true);
    const [isUserIdReadOnly, setIsUserIdReadOnly] = useState(false);

    useEffect(() => {
        setDisableBtn(!(otp && password));
    }, [otp, password]);

    const handleSendOtp = async () => {
        try {
            if (!userId.trim()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'User ID cannot be empty.',
                });
                return;
            }

            const response = await sendOtp(userId);
            Swal.fire({
                icon: response.message === 'OTP sent successfully' ? 'success' : 'error',
                title: response.message,
            });

            if (response.message === 'OTP sent successfully') {
                setOtp('');
                setPassword('');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send OTP. Please try again.',
            });
        }
    };

    const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        console.log("User ID, OTP, and Password before API call:", userId, otp, password); 
    
        try {
            const response = await confirmPasswordReset(userId, otp, password);
            Swal.fire({
                icon: 'success',
                title: response.message || 'Password reset successfully',
            }).then(() => {
                window.location.href = '/login'; 
            }); 
        } catch (error: unknown) {
            console.error("Error during password reset:", error);
    
            // Type assertion to handle unknown error types
            const errorMessage = (error as { message?: string })?.message || 'An error occurred while resetting the password';
            
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
            });
        }
    };
    

    const handleCancel = () => {
        window.location.href = '/login'; 
    };

    const isSendOtpDisabled = !userId.trim();

    return (
        <main className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                            Forgot Password
                        </h1>
                        <div className="flex items-center space-x-4 mb-4">
                            <label className='font-bold w-1/3 text-right' htmlFor="userId">User Name :</label>
                            <input
                                type="text"
                                placeholder="User name or Center Code"
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-2/3 p-2.5"
                                required
                                value={userId}
                                onChange={e => setUserId(e.target.value)} 
                                readOnly={isUserIdReadOnly}
                            />
                        </div>
                        <div className="text-right mb-4">
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendOtpDisabled}
                                className="w-[30%] text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-100 disabled:text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                            >
                                Send OTP
                            </button>
                        </div>
                        <form className="space-y-6" onSubmit={handleSavePassword}>
                            <div className="flex items-center space-x-4 mb-4">
                                <label className='font-bold w-1/3 text-right' htmlFor="otp">OTP :</label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-2/3 p-2.5"
                                    required
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center space-x-4 mb-4">
                                <label className='font-bold w-1/3 text-right' htmlFor="password">Password :</label>
                                <input
                                    type="password"
                                    placeholder="Enter New Password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-2/3 p-2.5"
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-between space-x-2">
                                <button
                                    type="button" 
                                    onClick={handleCancel} 
                                    className="w-[30%] text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={disableBtn}
                                    className="w-[50%] text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-100 disabled:text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Save Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
