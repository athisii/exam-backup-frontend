import React from 'react';
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import ExamCentreContainer from "@/components/admin/exam-centre-container";
import {sendGetRequest} from "@/utils/api";
import {ApiResponsePage, IExamDate, IRegion, IRegionExamDateSlotArray, ISlot} from "@/types/types";

const API_URL = process.env.API_URL as string
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}


const Page = async () => {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/")
    }
    const token = idContext.token as string;

    const regionsUrl = `${API_URL}/regions/page?page=0&size=100`; // get all
    const examDatesUrl = `${API_URL}/exam-dates/page?page=0&size=100`; // get all
    const slotsUrl = `${API_URL}/slots/page?page=0&size=100`; // get all

    // fetch currently
    const [regionsApiRes, examDatesApiRes, slotsApiRes] = await Promise.all([
        sendGetRequest(regionsUrl, token),
        sendGetRequest(examDatesUrl, token),
        sendGetRequest(slotsUrl, token),
    ]);

    if (!regionsApiRes.status) {
        console.log(`error: status=${regionsApiRes.status}, message=${regionsApiRes.message}`);
        throw new Error("Error fetching regions.");
    }
    if (!examDatesApiRes.status) {
        console.log(`error: status=${examDatesApiRes.status}, message=${examDatesApiRes.message}`);
        throw new Error("Error fetching exam dates.");
    }
    if (!slotsApiRes.status) {
        console.log(`error: status=${slotsApiRes.status}, message=${slotsApiRes.message}`);
        throw new Error("Error fetching slots.");
    }
    const regionsApiResponsePage = regionsApiRes.data as ApiResponsePage;
    const examDatesApiResponsePage = examDatesApiRes.data as ApiResponsePage;
    const slotsApiResponsePage = slotsApiRes.data as ApiResponsePage;
    let errorMessage = '';
    if (regionsApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No regions are available. ';
    }
    if (examDatesApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No exam dates are available. ';
    }
    if (slotsApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No slots available. ';
    }
    return (
        <>
            <div className='flex bg-[#0056b3] w-full justify-center p-2 text-white rounded-lg'>
                <h1 className='font-bold'>Exam Centre</h1>
            </div>
            {errorMessage ?
                <div>
                    <p>{errorMessage}</p>
                    <p>Please contact the admin to add it.</p>
                </div>
                :
                <ExamCentreContainer
                    regionExamDateSlotArray={{
                        regions: regionsApiResponsePage.items as IRegion[],
                        examDates: examDatesApiResponsePage.items as IExamDate[],
                        slots: slotsApiResponsePage.items as ISlot[]
                    } as IRegionExamDateSlotArray}
                />
            }
        </>
    );
};

export default Page;