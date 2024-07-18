import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import React from "react";
import Header from "@/components/header";
import {sendGetRequest, sendPostRequest} from "@/utils/api";
import MainSection from "@/components/main-section";


const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}


export default async function Page() {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    // use try-catch block / just show error page -- fails when server is down.
    // fetch exam centre based on examCentreCode
    // check if exam centre exists
    // what error to display if not exists?
    // fetch slots list, file types
    // fetch exam files based on examCentreCode, date, slot, etc


    const examCentreCode = idContext.tokenClaims?.sub as string
    const token = idContext.token as string;

    // fetch exam centre details
    let examCentreUrl = `${API_URL}/exam-centres/search/code`;
    // fetch exam slot list
    const examSlotsUrl = `${API_URL}/exam-slots`;
    // fetch exam file type list
    const fileTypesUrl = `${API_URL}/file-types`;

    // Fetch concurrently
    const [examCentreApiRes, slotsApiRes, fileTypesApiRes] = await Promise.all([
        sendPostRequest(examCentreUrl, token, {code: examCentreCode}),
        sendGetRequest(examSlotsUrl, token),
        sendGetRequest(fileTypesUrl, token),
    ]);
    // handle errors
    return (
        <main className="flex justify-center font-[sans-serif]">
            <div className="flex h-screen w-full flex-col items-center gap-2 bg-gray-50 shadow-lg sm:w-[60vw]">
                <Header examCentre={examCentreApiRes.data}/>
                <MainSection examSlots={slotsApiRes.data} examFileTypes={fileTypesApiRes.data}/>
            </div>
        </main>
    );
};
