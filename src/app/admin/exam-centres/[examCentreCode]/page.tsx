import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import {sendGetRequest} from "@/utils/api";
import ExamCentreUploadDetailsMainSection from "@/components/admin/exam-centre-upload-details-main-section";
import {ApiResponsePage} from "@/types/types";
import ExamCentreUploadDetailsHeader from "@/components/admin/exam-centre-upload-details-header";


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
    let examCentreUrl = `${API_URL}/exam-centres/query?code=${params.examCentreCode}`;
    // fetch exam slot list
    const examSlotsUrl = `${API_URL}/exam-slots`;
    // fetch exam file type list
    const fileTypesUrl = `${API_URL}/file-types`;

    // Fetch concurrently
    const [examCentreApiRes, slotsApiRes, fileTypesApiRes] = await Promise.all([
        sendGetRequest(examCentreUrl, token),
        sendGetRequest(examSlotsUrl, token),
        sendGetRequest(fileTypesUrl, token),
    ]);

    if (!examCentreApiRes.status) {
        console.log(`error: status=${examCentreApiRes.status}, message=${examCentreApiRes.message}`);
        throw new Error("Error fetching exam centre.");
    }
    if (!slotsApiRes.status || slotsApiRes.data.length === 0) {
        console.log(`error: status=${slotsApiRes.status}, message=${slotsApiRes.message}`);
        throw new Error("Error fetching exam slots.");
    }
    if (!fileTypesApiRes.status || fileTypesApiRes.data.length === 0) {
        console.log(`error: status=${fileTypesApiRes.status}, message=${fileTypesApiRes.message}`);
        throw new Error("Error fetching file types.");
    }

    const apiResponsePage = examCentreApiRes.data as ApiResponsePage;
    if (apiResponsePage.totalPages === 0) {
        throw new Error("Exam centre not found");
    }
    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[80vw]">
                <ExamCentreUploadDetailsHeader examCentre={apiResponsePage.items[0]}/>
                <ExamCentreUploadDetailsMainSection examCentreCode={params.examCentreCode}
                                                    examSlots={slotsApiRes.data}
                                                    fileTypes={fileTypesApiRes.data}/>
            </div>
        </main>
    );
};