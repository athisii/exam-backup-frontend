'use server'

import {sendPostRequest} from "@/utils/api";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

export async function initiateForgotPassword(userId: string) {
    let url = `${API_URL}/password-reset/initiate`;
    return await sendPostRequest(url, "", {userId}, false);
}

export async function confirmForgotPassword(userId: string, otp: string, password: string) {
    let url = `${API_URL}/password-reset/confirm`;
    return await sendPostRequest(url, "", {userId, otp, password}, false);
}