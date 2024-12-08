'use server'

import {redirect} from "next/navigation";
import identityContext from "@/lib/session";
import {sendGetRequest, sendPostRequest} from "@/lib/api";
import {ApiResponse, IFile} from "@/types/types";
import {byteArrayToBase64} from "@/lib/base64-util";

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

export async function downloadExamFile(id: number) {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE) || idContext.tokenClaims?.permissions.includes(STAFF_ROLE_CODE)) {
        const token = idContext.token as string;
        let url = `${API_URL}/exam-files/download/${id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Error downloading exam file.");
        }
        let blob = await response.blob();

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename;
        if (contentDisposition && contentDisposition.includes('filename=')) {
            filename = contentDisposition.split("filename=")[1];
        }
        const arrayBuffer = await blob.arrayBuffer();
        return {
            base64EncodedData: Buffer.from(arrayBuffer).toString("base64"),
            filename: filename ? filename : "default",
            mimeType: blob.type
        } as IFile;
    }
    redirect("/login")
}