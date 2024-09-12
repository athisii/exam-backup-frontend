"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useFormState } from 'react-dom';
import Link from "next/link";
import { login } from '@/app/(auth)/login/actions';
import { faEyeSlash, faEye, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginPage = () => {
    const [state, action] = useFormState(login, { message: '' });
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleForgotPassword = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Forgot Password',
            html: `
                <input id="swal-input1" class="swal2-input" placeholder="Center Code">
                <input id="swal-input2" class="swal2-input" type="tel" placeholder="Phone Number">
            `,
            focusConfirm: false,
            preConfirm: () => {
                const centerCode = Swal.getPopup().querySelector('#swal-input1').value;
                const phoneNumber = Swal.getPopup().querySelector('#swal-input2').value;
                if (!centerCode || !phoneNumber) {
                    Swal.showValidationMessage('Please enter both center code and phone number');
                }
                return { centerCode, phoneNumber };
            }
        });

        if (formValues) {
            // Simulate a verification request
            const isVerified = await verifyCredentials(formValues.centerCode, formValues.phoneNumber);

            if (isVerified) {
                Swal.fire({
                    title: 'Verification Successful',
                    text: `Center Code: ${formValues.centerCode}\nPassword: YourPassword123`,
                    icon: 'success'
                });
            } else {
                Swal.fire({
                    title: 'Verification Failed',
                    text: 'The center code or phone number is incorrect',
                    icon: 'error'
                });
            }
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const verifyCredentials = async (centerCode, phoneNumber) => {
        return centerCode === '101' && phoneNumber === '7207676142'; 
    };

    return (
<<<<<<< HEAD
        <main className="bg-gray-100 font-poppins">
=======
        <main className="bg-gray-50 font-poppins">
>>>>>>> 52b8285af12cbf1ccb2c9bf28784bc839656571c
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full flex flex-col gap-6 justify-center items-center bg-white rounded-lg shadow-lg md:mt-0 xl:p-1 !w-[600px] h-[400px]">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-[450px] h-[400px] font-poppins">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl text-center font-poppins">
                            CDAC Exam BackUp 
                        </h1>
                        <div className='text-center text-red-500'>
                            <p>{state?.message}</p>
                        </div>
                        <form className="space-y-4 md:space-y-6" action={action}>
                            <div className="flex items-center mb-4">
                                <div className='w-1/3 font-bold'>USERNAME :</div>
                                <div className="relative flex-1">
                                    <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        autoFocus
                                        type="text"
                                        name="username"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 p-2 pl-10 hover:border-black w-full"
                                        placeholder="Username or Centre Code"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="flex items-center mb-4">
                                <div className='w-1/3 font-bold'>PASSWORD :</div>
                                <div className="relative flex-1">
                                    <FontAwesomeIcon icon={faLock} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 p-2 pl-10 pr-12 hover:border-black w-full"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-3 flex items-center"
                                        onClick={togglePasswordVisibility}
                                        aria-label="Toggle Password Visibility"
                                    >
                                        <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="text-end">
                                <a 
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        handleForgotPassword();
                                    }}
                                    className="text-sm font-medium text-primary-600 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <button type="submit"
                                    className="w-full text-white bg-primary-700 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
