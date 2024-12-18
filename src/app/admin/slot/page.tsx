import React from 'react';
import identityContext from "@/lib/session";
import {redirect} from "next/navigation";
import SlotContainer from "@/components/admin/slot-container";

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
    return (
        <>
            <div className='flex bg-[#0056b3] w-full justify-center p-2 text-white rounded-lg '>
                <h2 className='font-bold'>SLOT</h2>
            </div>
            <SlotContainer/>
        </>
    );
};

export default Page;