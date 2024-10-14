'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {ApiResponse, IExamCentre, SortOrder} from "@/types/types";
import {sendGetRequest, sendPostRequest} from "@/utils/api";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export async function fetchExamCentresAsPage(pageNumber: number, pageSize: number = 8, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    // page number is zero-based in backend API. So page = pageNumber - 1 (only for PAGINATION UI)
    let url = `${API_URL}/exam-centres/page?page=${pageNumber - 1}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendGetRequest(url, token);
}

export async function saveExamCentre(examCentre: IExamCentre): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-centres/create`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, examCentre);
}

export async function deleteExamCentreById(id: number): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    let url = `${API_URL}/exam-centres/soft-delete/${id}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendPostRequest(url, token, {});
}

export async function searchExamCentres(searchTerm: string, pageNumber: number, pageSize: number = 8, sortBy: string = "code", sortOrder: SortOrder = "ASC"): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }
    // page number is zero-based in backend API. So page = pageNumber - 1
    let url = `${API_URL}/exam-centres/search?searchTerm=${encodeURIComponent(searchTerm)}&page=${pageNumber - 1}&size=${pageSize}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    return await sendGetRequest(url, token);
}

export async function fetchExamCentresByRegions(regionIds: number[]): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE.toString())) {
        redirect("/");
    }
    const token = idContext.token as string;
    const url = `${API_URL}/exam-centres/all-by-region-ids`;
    return await sendPostRequest(url, token, regionIds);
}


export async function updateOnlySlot(examCentreIds: number[], examDateIds: number[], slotIds: number[]): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }
    const url = `${API_URL}/exam-centres/update-only-slot`;
    const token = idContext.token as string;
    return await sendPostRequest(url, token, {examCentreIds, examDateIds, slotIds});
}

export async function uploadExamCentre(formData: FormData): Promise<ApiResponse> {
    const idContext = identityContext();

    if (!idContext.authenticated) {
        redirect("/login");
    }

    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

    const url = `${API_URL}/exam-centres/create-from-csv-file`;
    const token = idContext.token as string;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Content-Type should not be set
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(`Error: ${errorData.message || "Unknown error"}. Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Upload Error:", error);
        throw new Error("Unable to upload exam center data.");
    }
}