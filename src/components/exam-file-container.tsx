"use client"

import {IFileType, IExamFile} from "@/types/types";
import ExamFileUpload from "@/components/exam-file-upload";
import React from "react";

interface ExamFileContainerProps {
    slotId: number,
    examDate: string,
    fileTypes: IFileType[],
    examFiles: IExamFile[]
}

const ExamFileContainer: React.FC<ExamFileContainerProps> = ({slotId, examDate, fileTypes, examFiles}) => {
    return (
        <>
            {
                fileTypes.map(fileType => {
                    let uploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                    if (uploadedExamFile) {
                        return <ExamFileUpload key={fileType.id + " " + slotId + " " + examDate}
                                               examSlotId={slotId}
                                               fileTypeId={fileType.id}
                                               fileTypeName={fileType.name}
                                               uploaded={true}
                                               examDate={examDate}
                                               userUploadedFilename={uploadedExamFile.userUploadedFilename}
                        />;
                    }
                    return <ExamFileUpload key={fileType.id + " " + slotId + " " + examDate}
                                           examSlotId={slotId}
                                           fileTypeId={fileType.id}
                                           fileTypeName={fileType.name}
                                           uploaded={false}
                                           examDate={examDate}
                                           userUploadedFilename={null}
                    />;
                })
            }
        </>
    );
};


export default ExamFileContainer;