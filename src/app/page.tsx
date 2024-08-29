import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse, ApiResponsePage, IExamCentre} from "@/types/types";
import UserMainSection from "@/components/user-main-section";
import UserHeader from "@/components/user-header";


const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export default async function Page() {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    // if admin tries to access home apiResponsePage(/) of user then redirect to /admin as admin has different home apiResponsePage
    if (idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/admin")
    }

    const examCentreCode = idContext.tokenClaims?.sub as string
    const token = idContext.token as string;

    // fetch exam centre details
    let examCentreUrl = `${API_URL}/exam-centres/query?code=${examCentreCode}`;

    const examCentreApiRes: ApiResponse = await sendGetRequest(examCentreUrl, token);
    if (!examCentreApiRes.status) {
        console.log(`error: status=${examCentreApiRes.status}, message=${examCentreApiRes.message}`);
        throw new Error("Error fetching exam centres.");
    }
    const examCentreApiResponsePage = examCentreApiRes.data as ApiResponsePage;
    if (examCentreApiResponsePage.numberOfElements === 0) {
        throw new Error("Exam centre not found");
    }

    const examCentre: IExamCentre = examCentreApiResponsePage.items[0] as IExamCentre;


    const examDateUrl = `${API_URL}/exam-dates/query?examCentreId=${examCentre.id}`;
    const examDatesApiRes = await sendGetRequest(examDateUrl, token)
    if (!examDatesApiRes.status) {
        console.log(`error: status=${examDatesApiRes.status}, message=${examDatesApiRes.message}`);
        throw new Error("Error fetching exam dates.");
    }
    const examDatesApiResponsePage = examDatesApiRes.data as ApiResponsePage;

    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[80vw]">
                <UserHeader examCentre={examCentre}/>
                <UserMainSection examCentre={examCentre}
                                 examDates={examDatesApiResponsePage.items}/>
            </div>
        </main>
    );
};
