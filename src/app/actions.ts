'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {sendGetRequest, sendPostRequest} from "@/utils/api";
import {ApiResponse, IExam, SortOrder} from "@/types/types";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}


export async function uploadFile(formData: FormData) {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    let url = `${API_URL}/exam-files/create`;
    const token = idContext.token as string;
    formData.append("examCentreCode", idContext.tokenClaims?.sub as string);
    formData.set("examDate", formData.get("examDate"))

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

export async function fetchExamFiles(examCentreId: number, selectedSlotId: number, examDateId: number): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    let url = `${API_URL}/exam-files/query`;
    const token = idContext.token as string;

    return await sendPostRequest(url, token, {
        examCentreId,
        slotId: selectedSlotId,
        examDateId: examDateId,
    });
}

export async function fetchSlotsForExam(examCentreId: number, examDateId: number, pageNumber: number = 0, pageSize: number = 10, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    const token = idContext.token as string;
    return await sendGetRequest(`${API_URL}/slots/query?examCentreId=${examCentreId}&examDateId=${examDateId}&page=${pageNumber}&size=${pageSize}`, token);
}


