"use client"

import {IExamFile, IFileType} from "@/types/types";
import ExamFileUpload from "@/components/exam-file-upload";
import React from "react";

interface ExamFileContainerProps {
    examCentreId: number,
    examDateId: number,
    slotId: number,
    fileTypes: IFileType[],
    examFiles: IExamFile[]
}

const ExamFileContainer: React.FC<ExamFileContainerProps> = ({
                                                                 examCentreId,
                                                                 examDateId,
                                                                 slotId,
                                                                 fileTypes,
                                                                 examFiles
                                                             }) => {
    return (
        <>
            {
                fileTypes.map(fileType => {
                    let alreadyUploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                    if (alreadyUploadedExamFile) {
                        return <ExamFileUpload key={fileType.id + " " + examDateId + " " + slotId}
                                               examCentreId={examCentreId}
                                               examDateId={examDateId}
                                               slotId={slotId}
                                               fileTypeId={fileType.id}
                                               fileTypeName={fileType.name}
                                               uploaded={true}
                                               userUploadedFilename={alreadyUploadedExamFile.userUploadedFilename}
                        />;
                    }
                    return <ExamFileUpload key={fileType.id + " " + examDateId + " " + slotId}
                                           examCentreId={examCentreId}
                                           examDateId={examDateId}
                                           slotId={slotId}
                                           fileTypeId={fileType.id}
                                           fileTypeName={fileType.name}
                                           uploaded={false}
                                           userUploadedFilename={null}
                    />;
                })
            }
        </>
    );
};


export default ExamFileContainer;