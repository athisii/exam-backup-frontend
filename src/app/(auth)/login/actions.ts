'use server'

import {redirect} from "next/navigation";
import {ApiResponse} from "@/types/types";
import {cookies} from "next/headers";
import {encrypt, EncryptedData} from "@/utils/crypto";
import {getClaims} from "@/utils/jwt";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

export async function login(state: { message: string }, formData: FormData) {
    /*
    a. call login api
        if auth passed:
            1. encrypt the token returned from api
            2. revalidate api login path
            3. set in cookie.next
            4. redirect to home page
        else:
            1. send error message
     */

    let url = `${API_URL}/login`;
    let firstTimeLogin = false;

    // fetch might throw connection refused/timeout
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: formData.get("username"), password: formData.get("password")}),
        cache: "no-store",
    });

    if (!response.ok) {
        console.log(`API-${url} response status code: ${response.status}`);
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
    const {token, refreshToken, isFirstLogin} = apiResponse.data;
    firstTimeLogin = isFirstLogin;

    const cookieStore = cookies()

    let {iv, cipherText, authTag} = encrypt(token);
    let cipher = `${iv}:${cipherText}:${authTag}`
    let claims = getClaims(token)
    const tokenExpiryDate = claims.exp - claims.iat;
    cookieStore.set("token", cipher, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: tokenExpiryDate
    })

    const encryptRes: EncryptedData = encrypt(refreshToken);
    cipher = `${encryptRes.iv}:${encryptRes.cipherText}:${encryptRes.authTag}`
    claims = getClaims(refreshToken)
    const refreshTokenExpiryDate = claims.exp - claims.iat;
    cookieStore.set("refreshToken", cipher, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: refreshTokenExpiryDate
    })

    if (firstTimeLogin) {
        redirect("/change-password"); // throws error internally so cant used in try-catch block
    }
    redirect("/"); // throws error internally so cant used in try-catch block
}