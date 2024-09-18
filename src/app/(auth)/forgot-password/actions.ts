'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

// API call to send OTP

export async function sendOtp(userId: string) {
    const url = `${API_URL}/password-reset/initiate`;
    

    const requestBody = { userId: userId.toString() };


    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error response from API:", errorResponse);
            return { message: 'Failed to send OTP', error: errorResponse };
        }

        return { message: 'OTP sent successfully' };

    } catch (error: unknown) {        
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error("Error sending OTP:", errorMessage);
        return { message: 'Failed to send OTP', error: errorMessage };
    }
}

export async function confirmPasswordReset(userId: string, otp: string, password: string) {
    const url = `${API_URL}/password-reset/confirm`;
    const requestBody = { userId:userId.toString(), otp:otp.toString(), password:password.toString() };
    console.log("Sending request to confirm password reset:", requestBody);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error response from API:", errorResponse);
            throw new Error(errorResponse.message || 'Failed to confirm OTP or reset password');
        }
    
        const data = await response.json();
        console.log("Response data:", data);
        
        return data;

    } catch (error) {
        console.error("Error confirming password reset:", error);
        throw error; 
    }
}
