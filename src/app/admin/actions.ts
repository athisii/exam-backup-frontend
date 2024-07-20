'use server'

import {redirect} from "next/navigation";
import identityContext from "@/utils/session";
import {ApiResponse, SortOrder} from "@/types/types";
import {sendGetRequest} from "@/utils/api";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

const defaultTime = " 10:30" // time also expected to be sent to the server

export async function fetchExamCentresByRegion(pageNumber: number, regionId: number, sortBy: string, sortOrder: SortOrder) {
    /*
    // String examCentreCode, Long examSlotId, Long fileTypeId, examDate //examDate pattern -> "yyyy-MM-dd HH:mm a"
    a. call save ExamFile api
       1. Authorization: Bearer ${token}
       2. Body --> multipart/form-data + examCentreCode + examSlotId +fileTypeId + examDate
     */

    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    let url = `${API_URL}/exam-centres/search?regionId=${regionId}&page=${pageNumber}&sort=${sortBy},${sortOrder}`;
    const token = idContext.token as string;

    // fetch might throw connection refused/timeout
    const apiResponse: ApiResponse = await sendGetRequest(url, token);
    return apiResponse.data
}