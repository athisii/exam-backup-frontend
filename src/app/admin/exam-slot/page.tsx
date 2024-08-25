import React from 'react';
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse, ApiResponsePage} from "@/types/types";
import ExamSlotContainer from "@/components/admin/exam-slot-container";

const API_URL = process.env.API_URL;
const ADMIN_ROLE_CODE_STR = process.env.ADMIN_ROLE_CODE
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE_STR) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}
const ADMIN_ROLE_CODE = Number.parseInt(ADMIN_ROLE_CODE_STR, 10)

const Page = async () => {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }
    return (
        <>
            <div className='flex bg-blue-500 w-full justify-center p-2 text-white'>
                <h2>EXAM SLOT</h2>
            </div>
            <ExamSlotContainer />
        </>
    );
};

export default Page;