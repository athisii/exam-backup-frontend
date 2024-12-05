import React from 'react';
import identityContext from "@/lib/session";
import {redirect} from "next/navigation";
import UserContainer from "@/components/admin/user-container";
import {ApiResponsePage} from "@/types/types";
import {sendGetRequest} from "@/lib/api";

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
    const rolesUrl = `${API_URL}/roles/page?page=0&size=100`; // get all

    // fetch currently
    const [regionsApiRes, rolesApiRes] = await Promise.all([
        sendGetRequest(regionsUrl, token),
        sendGetRequest(rolesUrl, token),
    ]);

    if (!regionsApiRes.status) {
        console.log(`error: status=${regionsApiRes.status}, message=${regionsApiRes.message}`);
        throw new Error("Error fetching regions.");
    }
    if (!rolesApiRes.status) {
        console.log(`error: status=${rolesApiRes.status}, message=${rolesApiRes.message}`);
        throw new Error("Error fetching roles.");
    }
    const regionsApiResponsePage = regionsApiRes.data as ApiResponsePage;
    const rolesApiResponsePage = rolesApiRes.data as ApiResponsePage;

    let errorMessage = '';
    if (regionsApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No regions are available. ';
    } else if (rolesApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No roles are available. ';
    }
    return (
        <>
            <div className='flex bg-[#0056b3] w-full justify-center p-2 text-white rounded-lg'>
                <h1 className='font-bold'>Users</h1>
            </div>
            {errorMessage ?
                <div>
                    <p>{errorMessage}</p>
                    <p>Please contact the admin to add it.</p>
                </div>
                :
                <UserContainer regions={regionsApiResponsePage.items} roles={rolesApiResponsePage.items}/>
            }
        </>
    );
};

export default Page;