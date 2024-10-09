'use server'

import {redirect} from "next/navigation";
import {ApiResponse} from "@/types/types";
import {cookies} from "next/headers";
import identityContext from "@/utils/session";
import {sendPostRequest} from "@/utils/api";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

export async function changePassword(state: { message: string }, formData: FormData) {
    /*
    a. call change-password api
        if auth passed:
            1. remove in cookie
            2. redirect to login page
        else:
            1. send error message
     */

    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    const userId = idContext.tokenClaims?.sub as string;
    const token = idContext.token as string
    let url = `${API_URL}/change-password`;

    // fetch might throw connection refused/timeout
    const apiResponse: ApiResponse = await sendPostRequest(url, token, {
        userId,
        oldPassword: formData.get("oldPassword"),
        newPassword: formData.get("newPassword")
    }, false);

    if (!apiResponse.status) {
        return {
            message: apiResponse.message,
        };
    }
    const cookieStore = cookies()
    cookieStore.delete("token")
    cookieStore.delete("refreshToken")
    redirect("/login"); 
}