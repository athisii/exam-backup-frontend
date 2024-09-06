export interface ApiResponse {
    status: boolean,
    message: string,
    data?: any
}

export interface ApiResponsePage {
    page: number,
    numberOfElements: number,
    totalElements: number,
    totalPages: number,
    items: any[]
}

export interface TokenClaims {
    "sub": string,
    "iss": string,
    "iat": number,
    "exp": number,
    "permissions": string[],
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
    filePath: string
    examDate: {
        id: number
    }
    examCentre: {
        id: number
    },
    slot: {
        id: number
    },
    fileType: {
        id: number
    },
}

export interface IExamDate {
    id: number,
    date: string;
}

export interface IFileType {
    id: number,
    name: string,
    code: string,
    createdDate: string | null,
    modifiedDate: string | null
}

export interface IRegion {
    id: number,
    name: string,
    code: string,
    createdDate: string | null,
    modifiedDate: string | null,
}

export interface IExamCentre {
    id: number,
    name: string,
    code: string,
    regionName: string,
    region: IRegion,
    totalFileCount: number,
    uploadedFileCount: number
}

export interface ISlot {
    id: number,
    active: boolean,
    createdDate: string | null,
    modifiedDate: string | null,
    code: string,
    name: string,
    startTime: string,
    endTime: string
}

export interface IRole {
    id: number,
    active: boolean,
    createdDate: string | null,
    modifiedDate: string | null,
    code: string,
    name: string
}

export type SortOrder = "ASC" | "DESC"
export type UploadStatusFilterType = "DEFAULT" | "UPLOADED" | "NOT_UPLOADED"
