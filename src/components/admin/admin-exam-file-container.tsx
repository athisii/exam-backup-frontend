"use client"

import {FileType, IExamFile} from "@/types/types";
import React from "react";
import AdminExamFile from "@/components/admin/admin-exam-file";

interface ExamFileContainerProps {
    examSlotId: number,
    examDate: string,
    fileTypes: FileType[],
    examFiles: IExamFile[]
}

const AdminExamFileContainer: React.FC<ExamFileContainerProps> = ({examSlotId, examDate, fileTypes, examFiles}) => {
    return (
        <>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="p-3">
                            File Type Name
                        </th>
                        <th scope="col" className="p-3">
                            Status
                        </th>
                        <th scope="col" className="p-3">
                            Uploaded Filename
                        </th>
                        <th scope="col" className="p-3">
                            File Size (MB)
                        </th>
                        <th scope="col" className="p-3">
                            File Path
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        fileTypes.map(fileType => {
                            let uploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                            if (uploadedExamFile) {
                                return (
                                    <AdminExamFile key={fileType.id + " " + examSlotId + " " + examDate}
                                                   examSlotId={examSlotId}
                                                   fileTypeId={fileType.id}
                                                   fileTypeName={fileType.name}
                                                   uploaded={true}
                                                   examDate={examDate}
                                                   userUploadedFilename={uploadedExamFile.userUploadedFilename}
                                                   fileSize={uploadedExamFile.fileSize}
                                                   filePath={uploadedExamFile.filePath}
                                    />
                                )
                            }
                            return (
                                <AdminExamFile key={fileType.id + " " + examSlotId + " " + examDate}
                                               examSlotId={examSlotId}
                                               fileTypeId={fileType.id}
                                               fileTypeName={fileType.name}
                                               uploaded={false}
                                               examDate={examDate}
                                               userUploadedFilename={null}
                                               fileSize={null}
                                               filePath={null}
                                />
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        </>
    );
};


export default AdminExamFileContainer;