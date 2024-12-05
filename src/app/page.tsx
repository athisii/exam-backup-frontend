import identityContext from "@/lib/session";
import {redirect} from "next/navigation";
import React from "react";
import {sendGetRequest} from "@/lib/api";
import {ApiResponsePage, IExamCentre, IExamDate, IFileExtension, IFileType} from "@/types/types";
import MainSection from "@/components/uploader/main-section";
import Header from "@/components/uploader/header";
import Logout from "@/components/uploader/logout";

const API_URL = process.env.API_URL as string;
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string;
const STAFF_ROLE_CODE = process.env.STAFF_ROLE_CODE as string;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}
if (!STAFF_ROLE_CODE) {
    throw new Error('STAFF_ROLE_CODE environment variable is not set');
}

export default async function Page() {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    // Redirect admin to /admin
    if (idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/admin");
    }
    // Redirect admin to /staff
    if (idContext.tokenClaims?.permissions.includes(STAFF_ROLE_CODE)) {
        redirect("/staff");
    }

    const examCentreCode = idContext.tokenClaims?.sub as string;
    const token = idContext.token as string;

    const examCentreUrl = `${API_URL}/exam-centres/upload-details/search?code=${examCentreCode}`;
    const fileTypesUrl = `${API_URL}/file-types/page?page=0&size=100&sort=id`;
    const fileExtensionUrl = `${API_URL}/file-extensions/page?page=0&size=100&sort=id`;

    // Fetch data
    const [examCentreApiRes, fileTypesApiRes, fileExtensionsApiRes] = await Promise.all([
        sendGetRequest(examCentreUrl, token),
        sendGetRequest(fileTypesUrl, token),
        sendGetRequest(fileExtensionUrl, token),
    ]);

    if (!examCentreApiRes.status) {
        console.log(`error: status=${examCentreApiRes.status}, message=${examCentreApiRes.message}`);
        redirect("/login");
    }
    if (!fileTypesApiRes.status || fileTypesApiRes.data.numberOfElements <= 0) {
        console.log(`error: status=${fileTypesApiRes.status}, message=${fileTypesApiRes.message}`);
        throw new Error("Error fetching file types or no file types available.");
    }
    if (!fileExtensionsApiRes.status || fileExtensionsApiRes.data.numberOfElements <= 0) {
        console.log(`error: status=${fileExtensionsApiRes.status}, message=${fileExtensionsApiRes.message}`);
        throw new Error("Error fetching file extensions or no file extensions available.");
    }

    const examCentreApiResponsePage = examCentreApiRes.data as ApiResponsePage;
    if (examCentreApiResponsePage.numberOfElements === 0) {
        throw new Error("Exam centre not found");
    }
    const examCentre: IExamCentre = examCentreApiResponsePage.items[0] as IExamCentre;

    const examDateUrl = `${API_URL}/exam-dates/query?examCentreId=${examCentre.id}`;
    const examDateApiResponse = await sendGetRequest(examDateUrl, token);
    if (!examDateApiResponse.status) {
        console.log(`error: status=${examDateApiResponse.status}, message=${examDateApiResponse.message}`);
        throw new Error("Error fetching exam dates.");
    }
    const examDateApiResponsePage = examDateApiResponse.data as ApiResponsePage;
    const examDates: IExamDate[] = examDateApiResponsePage.items as IExamDate[];

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-50 ">
            {/* Header */}
            <header className="w-full bg-[#0056b3] p-2 text-white flex items-center justify-between sticky top-0 ">
                <h1 className="text-xl font-bold">EXAM BACKUP</h1>
                <Logout/>
            </header>

            {/* Content Box */}
            <div className="flex flex-col w-full bg-white shadow-lg font-bold rounded-lg p-1"
                 style={{width: '80vw', height: '40vw'}}>

                <Header examCentre={examCentre}/>

                {/* Main Content */}
                {examDates.length === 0 ? (
                    <div className="text-large font-bold text-center m-auto ">
                        <h2>No exam found!</h2>
                        <h2>Kindly contact the admin to add exam.</h2>
                    </div>
                ) : (
                    <MainSection
                        examCentre={examCentre}
                        fileTypes={fileTypesApiRes.data.items as IFileType[]}
                        fileExtensions={fileExtensionsApiRes.data.items as IFileExtension[]}
                        examDates={examDates.sort((a, b) => a.date.toLowerCase().localeCompare(b.date.toLowerCase()))}
                    />
                )}
            </div>
        </div>
    );
}
