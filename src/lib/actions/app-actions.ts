'use server'

import {redirect} from "next/navigation";
import identityContext from "@/lib/session";
import {sendGetRequest, sendPostRequest} from "@/lib/api";
import {ApiResponse, SortOrder} from "@/types/types";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}


export async function uploadFile(formData: FormData): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    let url = `${API_URL}/exam-files/create`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, formData, true);
}

export async function fetchExamFiles(examCentreId: number, examDateId: number, slotId: number): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    const token = idContext.token as string;
    return await sendGetRequest(`${API_URL}/exam-files/query?examCentreId=${examCentreId}&examDateId=${examDateId}&slotId=${slotId}`, token);
}

export async function fetchSlotsForExam(examCentreId: number, examDateId: number, pageNumber: number = 0, pageSize: number = 10, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    const token = idContext.token as string;
    return await sendGetRequest(`${API_URL}/slots/query?examCentreId=${examCentreId}&examDateId=${examDateId}&page=${pageNumber}&size=${pageSize}`, token);
}