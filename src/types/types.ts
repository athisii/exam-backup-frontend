export interface ApiResponse {
    status: boolean,
    message: string,
    data?: any
}

export interface TokenClaims {
    "sub": string,
    "iss": string,
    "iat": number,
    "exp": number,
    "permissions": number[],
    "id": number,
    "name": string,
    "key": string | null
}

export interface IdentityContext {
    authenticated: boolean,
    token: string | null
    tokenClaims: TokenClaims | null
}


export interface IExamFile {
    fileSize: number,
    userUploadedFilename: string,
    examCentre: {
        id: number
    },
    examSlot: {
        id: number
    },
    fileType: {
        id: number
    },
}

export interface ExamSlot {
    id: number,
    name: string,
    code: string,
}
export interface FileType {
    id: number,
    name: string,
    code: string,
}