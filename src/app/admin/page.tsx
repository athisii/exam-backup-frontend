import React from 'react';
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse} from "@/types/types";
import Admin from "@/components/admin/admin";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}

const Page = async () => {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }

    const token = idContext.token as string;
    const regionUrl = `${API_URL}/regions`;
    const regionsApiRes: ApiResponse = await sendGetRequest(regionUrl, token);

    return (
        <Admin regions={regionsApiRes.data}/>
    );
};

export default Page;