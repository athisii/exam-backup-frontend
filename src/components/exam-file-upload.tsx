"use client"

import React, {useRef, useState} from 'react';
import {uploadFile} from "@/app/actions";
import {ApiResponse} from "@/types/types";

interface ExamFileProps {
    examCentreId: number,
    examDateId: number,
    slotId: number,
    fileTypeId: number,
    fileTypeName: string,
    uploaded: boolean,
    userUploadedFilename: string | null
}


const ExamFileUpload: React.FC<ExamFileProps> = ({
                                                     examCentreId,
                                                     examDateId,
                                                     slotId,
                                                     fileTypeId,
                                                     fileTypeName,
                                                     uploaded,
                                                     userUploadedFilename
                                                 }) => {
    const [status, setStatus] = useState(false);
    const [userSelectedFilename, setUserSelectedFilename] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);
    const inputFileRef = useRef<HTMLInputElement>(null);
    const userUploadedFilenameRef = useRef<string | null>(null); // initialize only once, but React does hydration in two passes

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // enable/disable button based on file selection/de-selection
            if (files[0]) {
                setUserSelectedFilename(files[0].name);
                setDisabledBtn(false)
                setStatus(false);
            } else {
                setDisabledBtn(true)
                setStatus(false);
            }
        }
    };

    const handleSubmit = async (formData: FormData) => {
        const apiResponse: ApiResponse = await uploadFile(formData);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error uploading exam file.");
        }
        setStatus(apiResponse.status);
        userUploadedFilenameRef.current = userSelectedFilename;
        setDisabledBtn(true)
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }

    return (
        <div className="w-full p-2 border-b-2 border-gray-300">
            <form action={handleSubmit} className="grid w-full grid-cols-3 gap-1 sm:grid-cols-12">
                <div className="col-span-1 flex items-center justify-center sm:col-span-3">
                    <label>{fileTypeName}</label>
                </div>
                <div className="col-span-2 flex items-center justify-center sm:col-span-3">
                    <input name="file" type="file" onChange={handleFileChange} ref={inputFileRef}
                           className="w-full cursor-pointer rounded bg-gray-100 text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-500 file:py-1 file:text-white file:hover:bg-gray-700"/>
                </div>
                <div className="col-span-1 flex items-center justify-center sm:col-span-2">
                    <button type="submit" disabled={disabledBtn}
                            className="w-full rounded-md bg-blue-700 px-5 py-2.5 text-center text-sm font-bold text-white disabled:bg-gray-200 disabled:text-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto ">Upload
                    </button>
                </div>
                <div className="col-span-2 flex items-center justify-center sm:col-span-3">
                    <p className="w-full rounded text-gray-500 overflow-hidden ">
                        {
                            uploaded && userUploadedFilenameRef.current === null ? userUploadedFilename : userUploadedFilenameRef.current
                        }
                    </p>
                </div>
                <div
                    className="col-span-2 flex items-center justify-center sm:col-span-1">
                    {
                        status || uploaded ?
                            <svg className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="12"/>
                                <path d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9" fill="none"/>
                            </svg>
                            : ""
                    }
                </div>
                <input type="hidden" name="examCentreId" value={examCentreId} readOnly/>
                <input type="hidden" name="examDateId" value={examDateId} readOnly/>
                <input type="hidden" name="slotId" value={slotId} readOnly/>
                <input type="hidden" name="fileTypeId" value={fileTypeId} readOnly/>
            </form>
        </div>
    );
};

export default ExamFileUpload;