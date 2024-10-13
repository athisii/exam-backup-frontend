"use client"

import {IExamFile, IFileExtension, IFileType} from "@/types/types";
import ExamFileUpload from "@/components/exam-file-upload";
import React from "react";

interface ExamFileContainerProps {
    examCentreId: number,
    examDateId: number,
    slotId: number,
    fileTypes: IFileType[],
    examFiles: IExamFile[],
    fileExtensions: IFileExtension[]
}

const ExamFileUploadContainer: React.FC<ExamFileContainerProps> = ({
                                                                       examCentreId,
                                                                       examDateId,
                                                                       slotId,
                                                                       fileTypes,
                                                                       examFiles,
                                                                       fileExtensions
                                                                   }) => {
    return (
        <>
            {
                fileTypes.map(fileType => {
                    const fileExtension = fileExtensions.find(fileExtension => fileExtension.id === fileType.fileExtensionId);
                    if (!fileExtension) {
                        console.log(`fileExtension with id: ${fileType.fileExtensionId} not found.`);
                        throw new Error(`Could not find fileExtension with id: ${fileType.fileExtensionId} for fileType id: ${fileType.id}.`);
                    }
                    const alreadyUploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                    if (alreadyUploadedExamFile) {
                        return <ExamFileUpload key={fileType.id + " " + examDateId + " " + slotId}
                                               examCentreId={examCentreId}
                                               examDateId={examDateId}
                                               slotId={slotId}
                                               fileType={fileType}
                                               fileExtension={fileExtension}
                                               uploaded={true}
                                               userUploadedFilename={alreadyUploadedExamFile.userUploadedFilename}
                        />;
                    }
                    return <ExamFileUpload key={fileType.id + " " + examDateId + " " + slotId}
                                           examCentreId={examCentreId}
                                           examDateId={examDateId}
                                           slotId={slotId}
                                           fileType={fileType}
                                           fileExtension={fileExtension}
                                           uploaded={false}
                                           userUploadedFilename={null}
                    />;
                })
            }
        </>
    );
};


export default ExamFileUploadContainer;