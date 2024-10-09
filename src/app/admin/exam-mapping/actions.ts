'use server'

import { redirect } from "next/navigation";
import identityContext from "@/utils/session";
import { ApiResponse } from "@/types/types";
import { sendGetRequest ,sendPostRequest} from "@/utils/api";

import {IExamDateSlot,IRegion} from "@/types/types"






const API_URL = process.env.API_URL as string;
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string;

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

// Fetch all regions
export async function fetchRegions(): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

    const url = `${API_URL}/regions`;
    const token = idContext.token as string;

    try {
        const response = await sendGetRequest(url, token); 
        
        if (!response.status) {
        
            throw new Error("Unable to fetch regions");
        }
        return response;
    } catch (error) {    
        throw new Error("Unable to fetch regions");
    }
}

// Fetch Slots
export async function fetchSlots(): Promise<ApiResponse> {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login");
    }
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

    const url = `${API_URL}/slots`;
    const token = idContext.token as string;

    try {
        return await sendGetRequest(url, token);
    } catch (error) {       
        throw new Error("Unable to fetch slots");
    }
}


export async function fetchExamDates(): Promise<ApiResponse> {
    const idContext = identityContext();  
    if (!idContext.authenticated) {
        redirect("/login");
    }
    
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");   }    
    const url = `${API_URL}/exam-dates`;    
    const token = idContext.token as string;
    try {
        const response = await sendGetRequest(url, token);

        return response;
    } catch (error) {       
        throw new Error("Unable to fetch exam dates");
    }
}



// export async function fetchExamCentresByRegions(regionIds: number | number[]): Promise<ApiResponse[]> {
//     const idContext = identityContext();
//     if (!idContext.authenticated) {
//         redirect("/login");
//     }

//     if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE.toString())) {
//         redirect("/");
//     }

//     const regionsToFetch = Array.isArray(regionIds) ? regionIds : [regionIds];
//     const responses: ApiResponse[] = [];

//     for (const regionId of regionsToFetch) {
//         let currentPage = 0;
//         let hasMorePages = true; 
//                while (hasMorePages) {
//             const url = `${API_URL}/exam-centres/query?regionId=${regionId}&page=${currentPage}`;
//             const token = idContext.token as string;

//             try {
//                 const response = await sendGetRequest(url, token);

//                 if (response.status) {
                    
//                     responses.push(response);

                   
//                     const totalElements = response.data.totalElements;
//                     const numberOfElementsFetched = response.data.items.length;
                    
//                     // Update the flag for whether more pages exist
//                     hasMorePages = responses.length < totalElements;
//                     currentPage++; 
//                 } else {
//                     hasMorePages = false; 
//                 }
//             } catch (error) {
//                 hasMorePages = false; 
//             }
//         }
//     }

//     return responses; 
// }

export async function fetchExamCentresByRegions(regionIds: number | number[]): Promise<any[]> {
    const idContext = identityContext();

   
    if (!idContext.authenticated) {
        redirect("/login");
    }

    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE.toString())) {
        redirect("/");
    }

    const regionsToFetch = Array.isArray(regionIds) ? regionIds : [regionIds];
    const allCenters: any[] = [];

    for (const regionId of regionsToFetch) {
        let currentPage = 0;
        let hasMorePages = true;

        while (hasMorePages) {
            const url = `${API_URL}/exam-centres/query?regionId=${regionId}&page=${currentPage}`;
            const token = idContext.token as string;

            try {
                const response = await sendGetRequest(url, token);

                if (response.status) {
                    const items = response.data.items || [];
                    allCenters.push(...items); 

                    const totalElements = response.data.totalElements; 
                    const numberOfElementsFetched = items.length; 

                  
                    hasMorePages = (currentPage + 1) * 10 < totalElements; 
                    currentPage++; 
                } else {
                    hasMorePages = false; 
                }
            } catch (error) {
                console.error("Error fetching exam centers:", error);
                hasMorePages = false; // Stop fetching on error
            }
        }
    }

    return allCenters; 
}




export async function uploadExamCentre(formData: FormData): Promise<ApiResponse> {
    const idContext = identityContext();  

    if (!idContext.authenticated) {
        redirect("/login");
    }

    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

    const url = `${API_URL}/exam-centres/create-from-csv-file`;    
    const token = idContext.token as string;  

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                // Content-Type should not be set
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(`Error: ${errorData.message || "Unknown error"}. Status: ${response.status}`);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Upload Error:", error); 
        throw new Error("Unable to upload exam center data."); 
    }
}


export async function constructSearchUrl(selectedCode: number): Promise<ApiResponse> {
    const idContext = identityContext();  

    
    if (!idContext.authenticated) {
        redirect("/login");
    }

   
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

  
    const url = `${API_URL}/exam-centres/search?searchTerm=${encodeURIComponent(selectedCode.toString())}`;    
    const token = idContext.token as string;

    try {
        // Send a GET request and return the response
        const response = await sendGetRequest(url, token);
        return response;
    } catch (error) {           
        throw new Error("Unable to fetch exam center data.");
    }
}




export interface IExamCentre {
    id: number;
    name: string;
    code: string;
    regionName: string;
    region: IRegion;
    totalFileCount: number;
    uploadedFileCount: number;
    createdDate: string | null;
    modifiedDate: string | null;
    mobileNumber: string | null;
    email: string | null;
    examDateSlots: IExamDateSlot[];
}

export interface ICenter {
    id: number;
    code: string;
    name: string;
}

export async function saveExamCentre(examCentreIds: string[], examDateIds: string[], slotIds: string[]): Promise<ApiResponse> {
    const idContext = identityContext();
    
   
    if (!idContext.authenticated) {
        redirect("/login");
    }
    
    if (!idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE)) {
        redirect("/");
    }

    const url = `${API_URL}/exam-centres/update-only-slot`; 
    const token = idContext.token as string;

   
    const payload = {
        examCentreIds,
        examDateIds,
        slotIds,
    };

    try {
        return await sendPostRequest(url, token, payload);
    } catch (error) {
        throw new Error("Failed to save exam center. Please try again.");
    }
}