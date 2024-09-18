"use client"

import React, {useState} from 'react';
import Link from "next/link";
import {confirmForgotPassword, initiateForgotPassword} from "@/app/(auth)/forgot-password/actions";
import {ApiResponse} from "@/types/types";
import {useRouter} from "next/navigation";

const usernameInfo: string = "Please enter your username or centre code to search for your account.";
const otpInfo: string = "Kindly enter the OTP sent to your mobile number.";

const ForgotPasswordPage = () => {
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [otpSent, setOtpSent] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("")

    const [otp, setOtp] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);


    const handleContinue = async () => {
        if (!username) {
            setErrorMessage("Username or Centre Code is required.");
            return;
        }
        const apiResponse: ApiResponse = await initiateForgotPassword(username);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message);
            return;
        }
        setOtpSent(true);
    }

    const handleSubmit = async () => {
        if (!otp || !newPassword || !confirmNewPassword) {
            setErrorMessage("All fields are required.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setErrorMessage("New password and confirmation password do not match.");
            return;
        }
        const apiResponse: ApiResponse = await confirmForgotPassword(username, otp, newPassword);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message);
            return;
        }
        router.replace("/login")
    }

    return (
        <main className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow-lg md:mt-0 sm:max-w-xl xl:p-0 ">
                    <div className="p-3 space-y-4 md:space-y-6 sm:p-4">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-center">
                            {otpSent ? "Change Password" : "Find Your Account"}
                        </h1>
                        <div className='text-center text-red-500'>
                            <p> {errorMessage}</p>
                        </div>
                        {
                            otpSent ?
                                <div className="m-3">
                                    <h4 className="text-center">{otpInfo}</h4>
                                    <div className="flex flex-col p-2 mt-4">
                                        <label>OTP</label>
                                        <input
                                            autoFocus
                                            placeholder="Enter OTP"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block p-2.5"
                                            value={otp}
                                            onChange={event => {
                                                setErrorMessage("");
                                                setOtp(event.target.value);
                                            }}/>
                                    </div>
                                    <div className="relative flex flex-col p-2 mt-4">
                                        <label>New Password</label>
                                        <input
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Enter new password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block p-2.5"
                                            value={newPassword}
                                            onChange={event => {
                                                setErrorMessage("");
                                                setNewPassword(event.target.value);
                                            }}/>
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            className="absolute inset-y-0 right-0 pt-5 pr-4 flex items-center hover:text-blue-500"
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
                                    <div className="relative flex flex-col p-2 mt-4">
                                        <label>Confirm Password:</label>
                                        <input
                                            type={isPasswordVisible ? "text" : "password"}
                                            placeholder="Enter confirm password"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block p-2.5"
                                            value={confirmNewPassword}
                                            onChange={event => {
                                                setErrorMessage("");
                                                setConfirmNewPassword(event.target.value);
                                            }}/>
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                            className="absolute inset-y-0 right-0 pt-5 pr-4 flex items-center hover:text-blue-500"
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
                                    <div className="flex justify-end gap-2 p-2 mt-8 text-white">
                                        <Link href={"/login"}
                                              className="w-full bg-red-500 hover:bg-red-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            Cancel
                                        </Link>
                                        <button
                                            className="w-full text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            onClick={() => handleSubmit()}>
                                            Submit
                                        </button>

                                    </div>
                                </div>
                                :
                                <div className="m-3 text-center">
                                    <h4>{usernameInfo}</h4>
                                    <div className="flex justify-center items-center gap-3 p-2 mt-4">
                                        <input
                                            autoFocus
                                            placeholder="Username or centre code"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                            value={username}
                                            onChange={event => {
                                                setErrorMessage("");
                                                setOtpSent(false);
                                                setUsername(event.target.value);
                                            }}/>
                                    </div>
                                    <div className="flex justify-end gap-2 p-2 mt-8 text-white">
                                        <Link href={"/login"}
                                              className="w-full border-2 border-gray-300 hover:bg-gray-200 text-black font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                            Back
                                        </Link>
                                        <button
                                            className="w-full text-white bg-primary-700 hover:bg-primary-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            onClick={() => handleContinue()}>
                                            Continue
                                        </button>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;