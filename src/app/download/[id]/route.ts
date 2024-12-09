import {NextResponse} from "next/server";
import identityContext from "@/lib/session";
import {redirect} from "next/navigation";

const API_URL = process.env.API_URL;
if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
const ADMIN_ROLE_CODE = process.env.ADMIN_ROLE_CODE as string
const STAFF_ROLE_CODE = process.env.STAFF_ROLE_CODE as string

if (!API_URL) {
    throw new Error('API_URL environment variable is not set');
}
if (!ADMIN_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}
if (!STAFF_ROLE_CODE) {
    throw new Error('ADMIN_ROLE_CODE environment variable is not set');
}

export async function GET(
    request: Request,
    {params}: { params: { id: number } }
) {
    const idContext = identityContext();
    if (!idContext.authenticated) {
        redirect("/login")
    }
    if (idContext.tokenClaims?.permissions.includes(ADMIN_ROLE_CODE) || idContext.tokenClaims?.permissions.includes(STAFF_ROLE_CODE)) {
        const token = idContext.token as string;
        let url = `${API_URL}/exam-files/download/${params.id}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            cache: "no-store",
        })

        if (!response.ok) {
            throw new Error("Error downloading exam file.");
        }
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = "default";
        if (contentDisposition && contentDisposition.includes('filename=')) {
            filename = contentDisposition.split("filename=")[1];
        }
        return new NextResponse(response.body, {
            headers: {
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Type": "application/octet-stream",
            },
        });
    }
    redirect("/login")
}
