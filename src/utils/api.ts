import "server-only"

import {ApiResponse} from "@/types/types";

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

export async function sendPostRequest(url: string, token: string, body: {}): Promise<ApiResponse> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: "no-store",
        body: JSON.stringify(body)
    });
    return await response.json();
}