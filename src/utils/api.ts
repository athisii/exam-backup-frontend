'use server'

import "server-only"

import {ApiResponse} from "@/types/types";
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export async function sendGetRequest(url: string, token: string): Promise<ApiResponse> {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: "no-store",
    });
    return await response.json();
}

export async function sendPostRequest(url: string, token: string, body: {}, isMultipart = false): Promise<ApiResponse> {
    const response = await fetch(url, {
        method: 'POST',
        headers: isMultipart ? {
            'Authorization': `Bearer ${token}`,
        } : {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: "no-store",
        body: isMultipart ? body as FormData : JSON.stringify(body),
    });
    return await response.json();
}

export async function logout() {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    // page number is zero-based in backend API. So page = pageNumber - 1
    cookies().delete("refreshToken");
    cookies().delete("token");
    redirect("/")
}