'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {ApiResponsePage, SortOrder} from "@/types/types";
import {sendGetRequest} from "@/utils/api";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export async function fetchExamSlotsByPage(pageNumber: number, pageSize: number = 11, sortBy: string = "id", sortOrder: SortOrder = "ASC"): Promise<ApiResponsePage> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-slots/page?page=${pageNumber}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    const apiResponse = await sendGetRequest(url, token);
    return apiResponse.data as ApiResponsePage;
}

export async function updateExamSlot(pageNumber: number, pageSize: number = 11, sortBy: string, sortOrder: SortOrder): Promise<ApiResponsePage> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-slots/query?page=${pageNumber}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    const apiResponse = await sendGetRequest(url, token);
    return apiResponse.data as ApiResponsePage;
}

export async function deleteExamSlot(searchTerm: string, pageNumber: number, pageSize: number = 11, regionId: number, sortBy: string, sortOrder: SortOrder): Promise<ApiResponsePage> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-slots/search?searchTerm=${searchTerm}&regionId=${regionId}&page=${pageNumber}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    const apiResponse = await sendGetRequest(url, token);
    return apiResponse.data as ApiResponsePage;
}