import React from 'react';
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse} from "@/types/types";
import Admin from "@/components/admin/admin";

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
    const token = idContext.token as string;
    const regionUrl = `${API_URL}/regions`;
    const regionsApiRes: ApiResponse = await sendGetRequest(regionUrl, token);

    return (
        <Admin regions={regionsApiRes.data}/>
    );
};

export default Page;