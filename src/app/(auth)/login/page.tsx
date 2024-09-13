"use client";

import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useFormState } from 'react-dom';
import Link from "next/link";
import { login } from '@/app/(auth)/login/actions';

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
        <main className="bg-gray-100 font-poppins">
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
                            <div className="w-1/3 font-bold">USERNAME :</div>
                              <div className="relative flex-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 448 512"
                                  className="input-icon absolute left-3 top-1/2 transform -translate-y-1/2"
                                  style={{ fill: 'black', width: '18px', height: '18px' }}
                                >
                                  <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464l349.5 0c-8.9-63.3-63.3-112-129-112l-91.4 0c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3z" />
                                </svg>
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
                              <div className="w-1/3 font-bold">PASSWORD :</div>
                              <div className="relative flex-1">
                                {/* Lock Icon from Icons8 */}
                                <svg
                                                              xmlns="http://www.w3.org/2000/svg"
                                                              viewBox="0 0 448 512"
                                                              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                              style={{ fill: 'black', width: '18px', height: '18px' }}
                                                            >
                                                              <path d="M400 192h-24v-72C376 53.24 322.8 0 256 0S136 53.24 136 120v72H112C85.49 192 64 213.5 64 240v224C64 490.5 85.49 512 112 512h288c26.51 0 48-21.49 48-48V240C448 213.5 426.5 192 400 192zM160 120c0-53.02 42.98-96 96-96s96 42.98 96 96v72H160V120zM384 464c0 8.822-7.178 16-16 16H112c-8.822 0-16-7.178-16-16V240c0-8.822 7.178-16 16-16h256c8.822 0 16 7.178 16 16V464zM224 384v-48c0-8.822 7.178-16 16-16s16 7.178 16 16v48c0 8.822-7.178 16-16 16S224 392.8 224 384z" />
                                                            </svg>

                                {/* Password Input */}
                                <input
                                  type={passwordVisible ? "text" : "password"}
                                  name="password"
                                  placeholder="Password"
                                  className="bg-gray-50 border border-black-300 text-gray-900 rounded-lg focus:ring-2 focus:outline-none focus:ring-primary-300 p-2 pl-10 pr-12 hover:border-black w-full"
                                  required
                                />

                                {/* Toggle Password Visibility */}
                                <button
                                  type="button"
                                  className="absolute inset-y-0 right-3 flex items-center"
                                  onClick={togglePasswordVisibility}
                                  aria-label="Toggle Password Visibility"
                                >
                                  {passwordVisible ? (
                                    /* Invisible Icon from Icons8 (eye slash) */
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 48 48"
                                      style={{ fill: 'black', width: '18px', height: '18px' }}
                                    >
                                      <path d="M24,9C13.1,9,4,18,4,24s9.1,15,20,15s20-9,20-15S34.9,9,24,9z M24,34c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10  S29.5,34,24,34z"/>
                                      <path d="M24,18c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S27.3,18,24,18z"/>
                                    </svg>        
                                  ) : (       
                                <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 48 48"
                              style={{ fill: 'black', width: '18px', height: '18px' }}
                            >

                              <path d="M24,9C13.1,9,4,18,4,24s9.1,15,20,15s20-9,20-15S34.9,9,24,9z M24,34c-5.5,0-10-4.5-10-10s4.5-10,10-10s10,4.5,10,10 S29.5,34,24,34z"/>
                                
                                
                              <path d="M24,18c-3.3,0-6,2.7-6,6s2.7,6,6,6s6-2.7,6-6S27.3,18,24,18z"/>
                                
                                
                              <line x1="" y1="22" x2="600" y2="194" stroke="black" stroke-width="5"/>
                            </svg>    

                                  )}
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
