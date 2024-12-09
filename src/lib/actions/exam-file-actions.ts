'use server'

import {redirect} from "next/navigation";
import identityContext from "@/lib/session";
import {sendGetRequest, sendPostRequest} from "@/lib/api";
import {ApiResponse} from "@/types/types";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
const STAFF_ROLE_CODE = process.env.STAFF_ROLE_CODE as string

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}
if (!STAFF_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}


export async function uploadFile(formData: FormData): Promise<ApiResponse> {
    const idContext = await identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    let url = `${API_URL}/exam-files/create`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, formData, true);
}

export async function fetchExamFiles(examCentreId: number, examDateId: number, slotId: number): Promise<ApiResponse> {
    const idContext = await identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    const token = idContext.token as string;
    return await sendGetRequest(`${API_URL}/exam-files/query?examCentreId=${examCentreId}&examDateId=${examDateId}&slotId=${slotId}`, token);
}
