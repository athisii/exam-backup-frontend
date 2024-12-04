import React from 'react';
import identityContext from "@/utils/session";
import {redirect} from "next/navigation";
import {sendGetRequest} from "@/utils/api";
import {ApiResponse, IRegion} from "@/types/types";
import RHDashboard from "@/components/staff/rh-dashboard";

const API_URL = process.env.API_URL as string;

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}


const Page = async () => {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    const token = idContext.token as string;
    const id = idContext.tokenClaims?.id as number;

    const appUserUrl = `${API_URL}/app-users/${id}`;
    const appUserApiRes: ApiResponse = await sendGetRequest(appUserUrl, token);
    const regionId = appUserApiRes.data.regionId;
    // check if the user is regionHead or not
    if (regionId) {
        const regionUrl = `${API_URL}/regions/${regionId}`;
        const regionApiRes: ApiResponse = await sendGetRequest(regionUrl, token);
        const region = regionApiRes.data as IRegion;
        return (
            <RHDashboard region={region}/>
        );
    }
    // for normal staff
    return (
        <div className="h-full flex items-center">
            <h1 className="text-xl">
                You have logged in as Staff without region head permission! We are working for your page. Stay tuned.
            </h1>
        </div>
    )
};

export default Page;
