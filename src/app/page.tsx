import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse, ApiResponsePage, IExamCentre, IExamDate, IFileType} from "@/types/types";
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

function isEmpty(fileTypes: IFileType[]) {
    return fileTypes.length === 0;
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

    let apiResponse: ApiResponse = await sendGetRequest(examCentreUrl, token);
    if (!apiResponse.status) {
        console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
        throw new Error("Error fetching exam centres.");
    }

    let apiResponsePage = apiResponse.data as ApiResponsePage;
    if (apiResponsePage.numberOfElements === 0) {
        throw new Error("Exam centre not found");
    }
    const examCentre: IExamCentre = apiResponsePage.items[0] as IExamCentre;

    const examDateUrl = `${API_URL}/exam-dates/query?examCentreId=${examCentre.id}`;
    apiResponse = await sendGetRequest(examDateUrl, token)
    if (!apiResponse.status) {
        console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
        throw new Error("Error fetching exam dates.");
    }
    apiResponsePage = apiResponse.data as ApiResponsePage;
    const examDates: IExamDate[] = apiResponsePage.items as IExamDate[];

    const fileTypesUrl = `${API_URL}/file-types`;
    apiResponse = await sendGetRequest(fileTypesUrl, token)
    if (!apiResponse.status || isEmpty(apiResponse.data as IFileType[])) {
        console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
        throw new Error("Error fetching file types or no file types available.");
    }

    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[80vw]">
                <UserHeader examCentre={examCentre}/>
                {
                    examDates.length === 0 ?
                        <div className="text-large font-bold text-center justify-center items-center m-auto">
                            <h2>No exam found!</h2>
                            <h2> Kindly contact the admin to add exam.</h2>
                        </div>
                        :
                        <UserMainSection examCentre={examCentre}
                                         fileTypes={apiResponse.data as IFileType[]}
                                         examDates={examDates.sort((a, b) => a.date.toLowerCase().localeCompare(b.date.toLowerCase()))}/>
                }
            </div>
        </main>
    );
};
