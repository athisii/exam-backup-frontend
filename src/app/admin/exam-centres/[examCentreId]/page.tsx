import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import {sendGetRequest} from "@/utils/api";
import ExamCentreUploadDetailsMain from "@/components/admin/exam-centre-upload-details-main";
import ExamCentreUploadDetailsHeader from "@/components/admin/exam-centre-upload-details-header";
import {ApiResponsePage, IExamCentre, IExamDate} from "@/types/types";


interface Props {
    params: {
        examCentreId: number
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

    const examCentreUrl = `${API_URL}/exam-centres/${params.examCentreId}`;
    const examDateUrl = `${API_URL}/exam-dates/query?examCentreId=${params.examCentreId}`;
    const fileTypesUrl = `${API_URL}/file-types`;

    // Fetch concurrently
    const [examCentreApiRes, examDateApiRes, fileTypesApiRes] = await Promise.all([
        sendGetRequest(examCentreUrl, token),
        sendGetRequest(examDateUrl, token),
        sendGetRequest(fileTypesUrl, token),
    ]);


    if (!examCentreApiRes.status) {
        console.log(`error: status=${examCentreApiRes.status}, message=${examCentreApiRes.message}`);
        throw new Error("Error fetching exam centre.");
    }
    if (!examDateApiRes.status) {
        console.log(`error: status=${examDateApiRes.status}, import React from 'react';

        const ForgotPassword = () => {
            return (
                <div>
                    <h2>Welcome to forgot password page</h2>
                </div>
            );
        };
        
        export default ForgotPassword;message=${examDateApiRes.message}`);
        throw new Error("Error fetching exam dates.");
    }

    if (!fileTypesApiRes.status || fileTypesApiRes.data.length === 0) {
        console.log(`error: status=${fileTypesApiRes.status}, message=${fileTypesApiRes.message}`);
        throw new Error("Error fetching file types.");
    }
    const examCentre = examCentreApiRes.data as IExamCentre;
    const examDateApiResponsePage = examDateApiRes.data as ApiResponsePage;
    const examDates: IExamDate[] = examDateApiResponsePage.items as IExamDate[];

    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[80vw]">
                <ExamCentreUploadDetailsHeader examCentre={examCentre}/>
                {
                    examDates.length === 0 ?
                        <div className="text-large font-bold text-center justify-center items-center m-auto">
                            <h2>No exam found for exam centre code: {examCentre.code}!</h2>
                            <h2> Kindly add exam.</h2>
                        </div>
                        :
                        <ExamCentreUploadDetailsMain examCentreId={examCentre.id}
                                                     fileTypes={fileTypesApiRes.data}
                                                     examDates={examDates.sort((a, b) => a.date.toLowerCase().localeCompare(b.date.toLowerCase()))}
                        />
                }
            </div>
        </main>
    );
};