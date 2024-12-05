import React from 'react';
import identityContext from "@/lib/session";
import {redirect} from "next/navigation";
import {sendGetRequest} from "@/lib/api";
import {ApiResponsePage, IRegion} from "@/types/types";
import RHDashboard from "@/components/staff/rh-dashboard";
import Dashboard from "@/components/staff/dashboard";

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
    const regionsUrl = `${API_URL}/regions/page?page=0&size=100`; // get all

    const [appUserApiRes, regionsApiRes] = await Promise.all([
        sendGetRequest(appUserUrl, token),
        sendGetRequest(regionsUrl, token),
    ]);

    if (!appUserApiRes.status) {
        console.log(`error: status=${appUserApiRes.status}, message=${appUserApiRes.message}`);
        redirect("/login");
    }
    if (!regionsApiRes.status) {
        console.log(`error: status=${regionsApiRes.status}, message=${regionsApiRes.message}`);
        throw new Error("Error fetching regions.");
    }
    const regionsApiResponsePage = regionsApiRes.data as ApiResponsePage;

    let errorMessage = '';
    if (regionsApiResponsePage.numberOfElements === 0) {
        errorMessage += 'No regions are available. ';
    }
    const rhRegionId = appUserApiRes.data.regionId;
    const regions = regionsApiResponsePage.items as IRegion[];

    let rhRegion;
    // check if the staff is region head or not
    if (rhRegionId) {
        rhRegion = regions.find(region => region.id === rhRegionId);
        if (!rhRegion) {
            errorMessage = 'No region found with id: ' + rhRegionId;
        }
    }
    return (
        <>
            {errorMessage ?
                <div>
                    <p>{errorMessage}</p>
                    <p>Please contact the admin to add it.</p>
                </div>
                :
                rhRegion ?
                    <RHDashboard region={rhRegion}/>
                    :
                    <Dashboard regions={regions}/>
            }
        </>
    );
};

export default Page;
