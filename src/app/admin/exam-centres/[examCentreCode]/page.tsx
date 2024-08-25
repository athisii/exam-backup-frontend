import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import Header from "@/components/header";
import {sendGetRequest} from "@/utils/api";
import AdminMainSection from "@/components/admin/admin-main-section";
import {ApiResponsePage} from "@/types/types";


interface Props {
    params: {
        examCentreCode: string
    }
}

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}


export default async function Page({params}: Props) {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }

    const token = idContext.token as string;

    // fetch exam centre details
    let examCentreUrl = `${API_URL}/exam-centres/search`;
    // fetch exam slot list
    const examSlotsUrl = `${API_URL}/exam-slots`;
    // fetch exam file type list
    const fileTypesUrl = `${API_URL}/file-types`;

    // Fetch concurrently
    const [examCentreApiRes, slotsApiRes, fileTypesApiRes] = await Promise.all([
        sendGetRequest(`${examCentreUrl}?code=${params.examCentreCode}`, token),
        sendGetRequest(examSlotsUrl, token),
        sendGetRequest(fileTypesUrl, token),
    ]);

    const apiResponsePage = examCentreApiRes.data as ApiResponsePage;
    if (apiResponsePage.totalPages === 0) {
        throw new Error("Exam centre not found");
    }
    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[80vw]">
                <Header examCentre={apiResponsePage.items[0]}/>
                <AdminMainSection examCentreCode={params.examCentreCode}
                                  examSlots={slotsApiRes.data}
                                  fileTypes={fileTypesApiRes.data}/>
            </div>
        </main>
    );
};