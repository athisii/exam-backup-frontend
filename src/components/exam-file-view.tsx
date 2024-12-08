"use client";

import React, {useState} from 'react';
import {IFile} from "@/types/types";
import {downloadExamFile} from "@/lib/actions/exam-file-actions";
import {base64ToBlob} from "@/lib/base64-util";
import Loading from "@/components/loading";

interface ExamFileProps {
    id?: number,
    fileTypeName: string;
    uploaded: boolean;
    userUploadedFilename: string | null;
    fileSize: number | null;
    filePath: string | null;
}

const ExamFileView: React.FC<ExamFileProps> = ({
                                                   id,
                                                   fileTypeName,
                                                   uploaded,
                                                   userUploadedFilename,
                                                   fileSize,
                                                   filePath
                                               }) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        let file: IFile = await downloadExamFile(id as number);
        let blob = base64ToBlob(file.base64EncodedData, file.mimeType);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.filename);
        document.body.appendChild(link);
        link.click();
        setIsLoading(false);
        document.body.removeChild(link);
    };

    return isLoading ?
        (<div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            <Loading/>
        </div>)
        :
        (<tr className="border-b">
                <td className="px-3 py-4">{fileTypeName}</td>
                <td className="px-3 py-4">
                    {uploaded ? (
                        <svg
                            className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="11"/>
                            <path d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9"
                                  fill="none"/>
                        </svg>
                    ) : (
                        <svg
                            className="h-6 w-6 flex-none fill-red-500 stroke-white stroke-2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="11"/>
                            <path d="M8 8 L16 16 M16 8 L8 16" fill="none"/>
                        </svg>
                    )}
                </td>
                <td className="px-3 py-4">{userUploadedFilename}</td>
                <td className="px-3 py-4">
                    {fileSize ? (fileSize / 1000_000).toFixed(3) : ""}
                </td>
                {uploaded && filePath ? (
                    <td className="px-3 py-4">
                        <div className="col-span-1 flex items-center justify-center sm:col-span-2">
                            <button
                                className="w-full rounded-md bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-500 active:bg-blue-600"
                                onClick={handleDownload}
                            >
                                Download
                            </button>
                        </div>
                    </td>
                ) : null}
            </tr>
        );
};

export default ExamFileView;
