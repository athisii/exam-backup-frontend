'use server'

import {redirect} from "next/navigation";
import {ApiResponse} from "@/types/types";
import {cookies} from "next/headers";
import {encrypt, EncryptedData} from "@/utils/crypto";
import {getClaims} from "@/utils/jwt";
import {sendPostRequest} from "@/utils/api";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
const STAFF_ROLE_CODE = process.env.STAFF_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');

}
if (!STAFF_ROLE_CODE) {
    throw new Error('STAFF_ROLE_CODE environment variable is not set');
}

export async function login(state: { message: string }, formData: FormData) {
    /*
    a. call login api
        if auth passed:
            1. encrypt the token returned from api
            2. set encrypted token in cookie
            3. redirect to home page
        else:
            1. display error message
     */

    let url = `${API_URL}/login`;
    let firstTimeLogin = false;

    // fetch might throw connection refused/timeout
    const apiResponse: ApiResponse = await sendPostRequest(url, "", {
        username: formData.get("username") as string,
        password: formData.get("password") as string
    }, false);

    if (!apiResponse.status) {
        return {
            message: apiResponse.message,
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

    const isAdmin = claims.permissions.includes(ADMIN_ROLE_CODE)
    if (isAdmin) {
        redirect("/admin");
    }
    const isStaff = claims.permissions.includes(STAFF_ROLE_CODE)
    if (isStaff) {
        redirect("/staff");
    }
    redirect("/");
}