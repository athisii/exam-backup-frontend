"use client"

import React, {useEffect, useRef, useState} from 'react';
import {useFormState} from "react-dom";
import {uploadFile} from "@/app/actions";

interface ExamFileProps {
    examSlotId: number,
    fileTypeId: number,
    fileTypeName: string,
    uploaded: boolean,
    examDate: string,
    userUploadedFilename: string | null
}

const ExamFile: React.FC<ExamFileProps> = ({
                                               examSlotId,
                                               fileTypeId,
                                               fileTypeName,
                                               uploaded,
                                               examDate,
                                               userUploadedFilename
                                           }) => {

    // state becomes true after uploaded successfully.
    const [state, action] = useFormState(uploadFile, false);
    const [filename, setFilename] = useState('');
    const [disabledBtn, setDisabledBtn] = useState(true);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // enable/disable button based on file selection/de-selection
            if (files[0]) {
                setFilename(files[0].name);
                setDisabledBtn(false)
            } else {
                setDisabledBtn(true)
            }
        }
    }

    useEffect(() => {
        // after successful upload disable button and de-select the file
        setDisabledBtn(true)
        if (inputFileRef.current) {
            inputFileRef.current.value = '';
        }
    }, [state]);

    // console.log(`examDate: ${examDate}, examSlotId: ${examSlotId}, fileTypeId: ${fileTypeId}`)
    return (
        <div className="w-full rounded-md bg-gray-300">
            <form action={action} className="grid w-full grid-cols-3 gap-1 p-1 sm:grid-cols-12">
                <div className="col-span-1 flex items-center justify-center sm:col-span-3">
                    <label>{fileTypeName}</label>
                </div>
                <div className="col-span-2 flex items-center justify-center sm:col-span-3">
                    <input name="file" type="file" onChange={handleFileChange} ref={inputFileRef}
                           className="w-full cursor-pointer rounded bg-gray-100 text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-gray-800 file:py-1 file:text-white file:hover:bg-gray-700"/>
                </div>
                <div className="col-span-1 flex items-center justify-center sm:col-span-2">
                    <button type="submit" disabled={disabledBtn}
                            className="w-full rounded-md bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white disabled:bg-gray-200 disabled:text-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto">Upload
                    </button>
                </div>
                <div className="col-span-2 flex items-center justify-center sm:col-span-3">
                    <p className="w-full rounded bg-gray-100 text-gray-500">
                        {
                            state ? filename : userUploadedFilename
                        }
                    </p>
                </div>
                <div
                    className="col-span-2 flex items-center justify-center sm:col-span-1">
                    {
                        state || uploaded ?
                            <svg className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="11"/>
                                <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9" fill="none"/>
                            </svg>
                            : ""
                    }
                </div>
                <input type="hidden" name="examSlotId" value={examSlotId} readOnly/>
                <input type="hidden" name="fileTypeId" value={fileTypeId} readOnly/>
                <input type="hidden" name="examDate" value={examDate} readOnly/>
            </form>
        </div>
    );
};

export default ExamFile;