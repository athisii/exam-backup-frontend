'use server'

import {redirect} from "next/navigation";
import {ApiResponse} from "@/types/types";
import {cookies} from "next/headers";
import identityContext from "@/utils/session";

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
    let url = `${API_URL}/change-password`;

    // fetch might throw connection refused/timeout
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            oldPassword: formData.get("oldPassword"),
            newPassword: formData.get("newPassword")
        }),
        cache: "no-store",
    });

    if (!response.ok) {
        console.log(`ServerAPIError:: Login API response status: ${response.status}`);
        if (response.status === 401) {
            return {
                message: 'Incorrect username or password',
            };
        }
        return {
            message: 'Something went wrong',
        };
    }
    const apiResponse: ApiResponse = await response.json();
    if (!apiResponse.status) {
        return {
            message: 'Incorrect username or password',
        };
    }
    const cookieStore = cookies()
    cookieStore.delete("token")
    cookieStore.delete("refreshToken")
    redirect("/login"); // throws error internally so cant used in try-catch block
}