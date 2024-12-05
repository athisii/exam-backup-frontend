'use server'

import {redirect} from "next/navigation";
import identityContext from "@/lib/session";
import {ApiResponse, SortOrder, UploadStatusFilterType} from "@/types/types";
import {sendGetRequest} from "@/lib/api";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}


export async function fetchExamCentresByRegion(query: string, pageNumber: number, pageSize: number = 11, regionId: number, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated && !idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/login")
    }
    // page number is zero-based in backend API. So page = pageNumber - 1
    let url = `${API_URL}/exam-centres/upload-details/search?query=${query}&regionId=${regionId}&page=${pageNumber - 1}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendGetRequest(url, token);
}


export async function filterExamCentresWithSearchTermAndRegion(query: string, filterType: UploadStatusFilterType, pageNumber: number, pageSize: number = 11, regionId: number, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }
    // page number is zero-based in backend API. So page = pageNumber - 1
    let url = `${API_URL}/exam-centres/upload-details/filter?query=${query}&filterType=${filterType}&regionId=${regionId}&page=${pageNumber - 1}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendGetRequest(url, token);
}