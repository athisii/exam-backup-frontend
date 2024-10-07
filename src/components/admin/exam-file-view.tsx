"use client";

import React from 'react';
import Swal from 'sweetalert2';

interface ExamFileProps {
    fileTypeName: string;
    uploaded: boolean;
    userUploadedFilename: string | null;
    fileSize: number | null;
    filePath: string | null;
}

const ExamFileView: React.FC<ExamFileProps> = ({
    fileTypeName,
    uploaded,
    userUploadedFilename,
    fileSize,
    filePath
}) => {
    const handleDownload = async (event: React.MouseEvent<HTMLAnchorElement>) => {
        // Check if the file path is valid
        if (!filePath) {
            Swal.fire({
                icon: 'error',
                title: 'Download Failed',
                text: 'The file path is not available.',
            });
            event.preventDefault(); // Prevent download if path is invalid
            return;
        }

        // Show success alert
        const result = await Swal.fire({
            icon: 'success',
            title: 'Download initiated!',
            text: 'The file is being downloaded. Check your default downloads folder.',
            timer: 2000,
            showConfirmButton: false
        });

        // Check if the user clicked "OK" on the alert
        if (result.isDismissed) {
            // Allow the default behavior to proceed (download the file)
            // The download will be initiated by the anchor tag's href
        } else {
            // Prevent download if the alert was closed in a way that doesn't indicate confirmation
            event.preventDefault();
        }
    };

    return (
        <tr className="border-b">
            <td className="px-3 py-4">{fileTypeName}</td>
            <td className="px-3 py-4">
                {uploaded ? (
                    <svg
                        className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="11" />
                        <path d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9"
                              fill="none" />
                    </svg>
                ) : (
                    <svg
                        className="h-6 w-6 flex-none fill-red-500 stroke-white stroke-2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="11" />
                        <path d="M8 8 L16 16 M16 8 L8 16" fill="none" />
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
                        <a 
                            href={filePath} 
                            download={userUploadedFilename} 
                            className="w-full rounded-md bg-green-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
                            onClick={handleDownload}
                        >
                            Download
                        </a>
                    </div>
                </td>
            ) : null}
        </tr>
    );
};

export default ExamFileView;
