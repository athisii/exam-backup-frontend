import React from 'react';
import identityContext from "@/lib/session";
import {redirect} from "next/navigation";
import FileTypeContainer from "@/components/admin/file-type-container";
import {sendGetRequest} from "@/lib/api";
import {IFileExtension} from "@/types/types";

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
    const fileExtensionUrl = `${API_URL}/file-extensions/page?page=0&size=100&sort=id`;
    const fileExtensionsApiRes = await sendGetRequest(fileExtensionUrl, idContext.token as string);
    if (!fileExtensionsApiRes.status || fileExtensionsApiRes.data.numberOfElements <= 0) {
        console.log(`error: status=${fileExtensionsApiRes.status}, message=${fileExtensionsApiRes.message}`);
        throw new Error("Error fetching file extensions or no file extensions available.");
    }
    return (
        <>
            <div className='flex bg-[#0056b3] w-full justify-center p-2 text-white rounded-lg'>
                <h1 className='font-bold'>File Type</h1>
            </div>
            <FileTypeContainer fileExtensions={fileExtensionsApiRes.data.items as IFileExtension[]}/>
        </>
    );
};

export default Page;