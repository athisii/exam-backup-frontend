"use client"


import React, {useEffect, useState} from 'react';
import {useFormState} from "react-dom";
import {changePassword} from "@/app/(auth)/change-password/actions";

const ForgotPassword = () => {
    const [apiResState, action] = useFormState(changePassword, {message: ''});
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
    const [passwordMatchMsg, setPasswordMatchMsg] = useState<string>('');
    const [disableBtn, setDisabledBtn] = useState<boolean>(true);


    useEffect(() => {
        if (apiResState.message.length) {
            setOldPassword("")
            setNewPassword("");
            setConfirmNewPassword("");
        }
    }, [apiResState])

    useEffect(() => {
        if (confirmNewPassword !== newPassword) {
            setPasswordMatchMsg("New password and confirmation password do not matched.");
            setDisabledBtn(true);
        } else if (confirmNewPassword) {
            setPasswordMatchMsg("");
            setDisabledBtn(false);
        }
    }, [confirmNewPassword])

    useEffect(() => {
        setPasswordMatchMsg("");
        if (newPassword !== confirmNewPassword) {
            setDisabledBtn(true);
        } else if (newPassword) {
            setDisabledBtn(false);
        }
    }, [newPassword])

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
                                {apiResState?.message}
                                {apiResState?.message ? "" : passwordMatchMsg}
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
                            <div>
                                <input type="password" name="newPassword" placeholder="New password"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       required
                                       value={newPassword}
                                       onChange={event => setNewPassword(event.target.value)}
                                />
                            </div>
                            <div>
                                <input type="password" name="confirmNewPassword" placeholder="Confirm new password"
                                       className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 block w-full p-2.5"
                                       required
                                       value={confirmNewPassword}
                                       onChange={event => setConfirmNewPassword(event.target.value)}
                                />
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

export default ForgotPassword;