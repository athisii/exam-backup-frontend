import identityContext from "@/utils/session";
import { redirect } from "next/navigation";
import React from "react";
import { sendGetRequest } from "@/utils/api";
import { ApiResponsePage, IExamCentre, IExamDate, IFileType } from "@/types/types";
import UserMainSection from "@/components/user-main-section";
import UserHeader from "@/components/user-header";
import { handleLogout } from "@/components/admin/exam-centre-container";
import { faBars, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const API_URL = process.env.API_URL as string;
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string;
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
        redirect("/login");
    }
    // Redirect admin to /admin
    if (idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/admin");
    }

    const examCentreCode = idContext.tokenClaims?.sub as string;
    const token = idContext.token as string;

    const examCentreUrl = `${API_URL}/exam-centres/query?code=${examCentreCode}`;
    const fileTypesUrl = `${API_URL}/file-types`;

    // Fetch data
    const [examCentreApiRes, fileTypesApiRes] = await Promise.all([
        sendGetRequest(examCentreUrl, token),
        sendGetRequest(fileTypesUrl, token),
    ]);

    if (!examCentreApiRes.status) {
        console.log(`error: status=${examCentreApiRes.status}, message=${examCentreApiRes.message}`);
        throw new Error("Error fetching exam centres.");
    }
    if (!fileTypesApiRes.status || isEmpty(fileTypesApiRes.data as IFileType[])) {
        console.log(`error: status=${fileTypesApiRes.status}, message=${fileTypesApiRes.message}`);
        throw new Error("Error fetching file types or no file types available.");
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
            <header className="w-full bg-[#0056b3] p-4 text-white flex items-center justify-between sticky top-0 ">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">EXAM BACKUP</h1>
                </div>               
            </header>

            {/* Content Box */}
            <div className="flex flex-col w-full bg-white shadow-lg font-bold rounded-lg p-4 mt-4" style={{ width: '80vw', height: '40vw' }}>

                <UserHeader examCentre={examCentre} />
                
                {/* Main Content */}
                {examDates.length === 0 ? (
                    <div className="text-large font-bold text-center m-auto ">
                        <h2>No exam found!</h2>
                        <h2>Kindly contact the admin to add exam.</h2>
                    </div>
                ) : (
                    <UserMainSection
                        examCentre={examCentre}
                        fileTypes={fileTypesApiRes.data as IFileType[]}
                        examDates={examDates.sort((a, b) => a.date.toLowerCase().localeCompare(b.date.toLowerCase()))}
                    />
                )}
                
                {/* Logout Button */}
                <div className="flex justify-center mt-8">
                    <button
                        className="bg-primary-700 hover:bg-primary-800 text-white border border-gray-300 rounded-lg focus:ring focus:outline-none focus:ring-primary-300 font-bold px-8 py-4 text-sm"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
