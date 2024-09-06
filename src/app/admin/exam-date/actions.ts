'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {ApiResponse, IExamDate, SortOrder} from "@/types/types";
import {sendGetRequest, sendPostRequest} from "@/utils/api";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export async function fetchExamDatesAsPage(pageNumber: number, pageSize: number = 8, sortBy: string = "date", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    // page number is zero-based in backend API. So page = pageNumber - 1 (only for PAGINATION UI)
    let url = `${API_URL}/exam-dates/page?page=${pageNumber - 1}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendGetRequest(url, token);
}

export async function saveExamDate(examDate: IExamDate): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-dates/create`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, examDate);
}

export async function deleteExamDateById(id: number): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-dates/soft-delete/${id}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, {});
}