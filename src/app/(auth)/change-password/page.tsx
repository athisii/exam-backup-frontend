"use client"


import React, {useEffect, useState} from 'react';
import {useFormState} from "react-dom";
import {changePassword} from "@/lib/actions/change-password-actions";

const ChangePasswordPage = () => {
    const [apiResState, action] = useFormState(changePassword, {message: ''});
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [passwordMatchMsg, setPasswordMatchMsg] = useState<string>('');
    const [disableBtn, setDisabledBtn] = useState<boolean>(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    
    useEffect(() => {
        if (apiResState.message.length) {
            setOldPassword("")
            setNewPassword("");
            setConfirmNewPassword("");
            setPasswordMatchMsg("");
            setDisabledBtn(true)
        }
    }, [apiResState])

    useEffect(() => {
        setPasswordMatchMsg("");
        apiResState.message = ''
        if (oldPassword && oldPassword === newPassword) {
            setPasswordMatchMsg("Old password and new password should not matched.");
            setDisabledBtn(true);
        } else if (newPassword && confirmNewPassword && confirmNewPassword !== newPassword) {
            setPasswordMatchMsg("New password and confirmation password do not matched.");
            setDisabledBtn(true);
        } else if (newPassword && confirmNewPassword && oldPassword !== newPassword) {
            setPasswordMatchMsg("");
            setDisabledBtn(false);
        }
    }, [oldPassword, newPassword, confirmNewPassword])

    return (
        <main className="bg-gray-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div
                    className="w-full bg-white rounded-lg shadow-lg  md:mt-0 sm:max-w-md xl:p-0 ">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Change your password
                        </h1>
                        <div className='text-center text-red-500'>
                            <p>
                                {passwordMatchMsg ? passwordMatchMsg : apiResState.message}
                            </p>
                        </div>
                        <form className="space-y-4 md:space-y-6" action={action}>
                            <div>
                                <input autoFocus type="password" name="oldPassword" placeholder="Old password"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       required
                                       value={oldPassword}
                                       onChange={event => setOldPassword(event.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="newPassword"
                                    placeholder="New password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                    required
                                    value={newPassword}
                                    onChange={event => setNewPassword(event.target.value)}
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
                            <div className="relative">
                                <input
                                    type={isPasswordVisible ? "text" : "password"}
                                    name="confirmNewPassword"
                                    placeholder="Confirm new password"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                    required
                                    value={confirmNewPassword}
                                    onChange={event => setConfirmNewPassword(event.target.value)}
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
                            <button type="submit" disabled={disableBtn}
                                    className="w-full text-white bg-primary-700 hover:bg-primary-700 disabled:bg-primary-100 disabled:text-black focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Change
                                Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ChangePasswordPage;