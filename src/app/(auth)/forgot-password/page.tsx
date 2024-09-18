"use client";

import React, { useState, useEffect } from 'react';
import { confirmPasswordReset, sendOtp } from './actions';

const ForgotPassword = () => {
    const [userId, setUserId] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOtpFields, setShowOtpFields] = useState(false);
    const [disableSaveBtn, setDisableSaveBtn] = useState(true);
    const [message, setMessage] = useState('');
    const [isUserIdReadOnly, setIsUserIdReadOnly] = useState(false);

    useEffect(() => {
        setDisableSaveBtn(!(otp && password && confirmPassword && password === confirmPassword));
        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
        } else {
            setMessage('');
        }
    }, [otp, password, confirmPassword]);

    const handleSendOtp = async () => {
        if (!userId.trim()) {
            setMessage('User ID cannot be empty.');
            return;
        }

        try {
            const response = await sendOtp(userId);
            setMessage(response.message === 'OTP sent successfully' ? 'OTP sent successfully!' : response.message);

            if (response.message === 'OTP sent successfully') {
                setShowOtpFields(true);
                setOtp('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (error) {
            setMessage('Failed to send OTP. Please try again.');
        }
    };

    const handleSavePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            return;
        }

        try {
            const response = await confirmPasswordReset(userId, otp, password);
            setMessage(response.message || 'Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                window.location.href = '/login'; 
            }, 2000);
        } catch (error) {
            const errorMessage = (error as { message?: string })?.message || 'An error occurred while resetting the password';
            setMessage(errorMessage);
        }
    };

    const handleCancel = () => {
        window.location.href = '/login'; 
    };

    return (
        <main className="bg-gray-100">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow-lg md:mt-1 sm:max-w-lg xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                            Forgot Password
                        </h1>
                        {message && (
                            <div className="text-red-500 text-center mb-4 font-bold">
                                {message}
                            </div>
                        )}
                        {!showOtpFields ? (
                            <>
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
                                <div className="text-center mb-4">
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={!userId.trim()}
                                        className="w-[30%] text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-100 disabled:text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                    >
                                        Send OTP
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form className="space-y-6" onSubmit={handleSavePassword}>
                                <div className="flex items-center space-x-4 mb-4">
                                    <label className='font-bold w-[46%] text-center' htmlFor="otp">OTP :</label>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-[50%] p-2.5 text-center"
                                        required
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <label className='font-bold w-[46%] text-center' htmlFor="password">Password :</label>
                                    <input
                                        type="password"
                                        placeholder="Enter New Password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-[50%] p-2.5 text-center"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="flex items-center space-x-4 mb-4">
                                    <label className='font-bold w-[46%] text-center' htmlFor="confirmPassword">Confirm Password :</label>
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-[50%] p-2.5 text-center"
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
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
                                        disabled={disableSaveBtn}
                                        className="w-[50%] text-white bg-primary-700 hover:bg-primary-800 disabled:bg-primary-100 disabled:text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                    >
                                        Save Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
