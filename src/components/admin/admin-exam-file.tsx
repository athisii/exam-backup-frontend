"use client"

import React from 'react';

interface ExamFileProps {
    examSlotId: number,
    fileTypeId: number,
    fileTypeName: string,
    uploaded: boolean,
    examDate: string,
    userUploadedFilename: string | null,
    fileSize: number | null,
    filePath: string | null
}


const downloadByteArray = (byteArray: Uint8Array, fileName: string) => {
    const blob = new Blob([byteArray], {type: 'application/octet-stream'});
    const link = document.createElement('a');
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const AdminExamFile: React.FC<ExamFileProps> = ({
                                                    examSlotId,
                                                    fileTypeId,
                                                    fileTypeName,
                                                    uploaded,
                                                    examDate,
                                                    userUploadedFilename,
                                                    fileSize,
                                                    filePath
                                                }) => {
    const byteArray = new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]); // "Hello World" in byte array
    const fileName = 'hello.txt';

    return (
        <tr>
            <td className="px-3 py-4">
                {fileTypeName}
            </td>
            <td className="px-3 py-4">
                {
                    uploaded ?
                        <svg
                            className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="11"/>
                            <path d="m8 13 2.165 2.165a1 1 0 0 0 1.521-.126L16 9"
                                  fill="none"/>
                        </svg> :
                        <svg
                            className="h-6 w-6 flex-none fill-red-500 stroke-white stroke-2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="11"/>
                            <path d="M8 8 L16 16 M16 8 L8 16" fill="none"/>
                        </svg>
                }
            </td>
            <td className="px-3 py-4">
                {userUploadedFilename}
            </td>
            <td className="px-3 py-4">
                {fileSize ? (fileSize / (1000_000)).toFixed(3) : ""} {/* base 10*/}
            </td>
            <td className="px-3 py-4">
                {uploaded ? filePath?.substring(0, filePath?.lastIndexOf("/")) : ""}
            </td>
            {
                uploaded ? <>
                    <td className="px-3 py-4">
                        <div className="col-span-1 flex items-center justify-center sm:col-span-2">
                            <button disabled
                                    className="w-full rounded-md bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white disabled:bg-gray-200 disabled:text-black hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                                    onClick={event => downloadByteArray(byteArray, fileName)}
                            >Download
                            </button>
                        </div>
                    </td>
                </> : ""
            }

        </tr>
    );
}
export default AdminExamFile;