'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {sendPostRequest} from "@/utils/api";
import {ApiResponse} from "@/types/types";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

const defaultTime = " 10:30" // time also expected to be sent to the server

export async function uploadFile(formData: FormData) {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    let url = `${API_URL}/exam-files/create`;
    const token = idContext.token as string;
    formData.append("examCentreCode", idContext.tokenClaims?.sub as string);
    formData.set("examDate", formData.get("examDate") + defaultTime)

    // fetch might throw connection refused/timeout
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${idContext.token}`,
        },
        body: formData,
        cache: "no-store",
    });

    if (!response.ok) {
        console.log(`API-${url} response status code: ${response.status}`);
        return false;
    }
    const apiResponse: ApiResponse = await response.json();
    return apiResponse.status;

}

export async function fetchExamFiles(examCentreCode: string, selectedSlotId: number, examDate: string): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    let url = `${API_URL}/exam-files/query`;
    const token = idContext.token as string;

    return await sendPostRequest(url, token, {
        examCentreCode,
        examSlotId: selectedSlotId,
        examDate: examDate + defaultTime,

    });
}