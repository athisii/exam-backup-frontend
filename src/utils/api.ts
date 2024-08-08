import "server-only"

import {ApiResponse} from "@/types/types";

// throws error if response status code is not 200 and response status if false.
export async function sendGetRequest(url: string, token: string): Promise<ApiResponse> {
    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`API-${url} response status code: ${response.status}`);
    }

    const apiRes = await response.json();
    if (!apiRes.status) {
        throw new Error(`API-${url} response status: false`)
    }
    return apiRes;
}

// throws error if response status code is not 200 and response status if false.
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

    if (!response.ok) {
        throw new Error(`API-${url} response status code: ${response.status}`);
    }

    const apiRes = await response.json();
    if (!apiRes.status) {
        throw new Error(`API-${url} response status: false`)
    }
    return apiRes;
}