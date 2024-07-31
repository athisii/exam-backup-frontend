"use client"

import {FileType, IExamFile} from "@/types/types";
import ExamFile from "@/components/exam-file";
import React from "react";

interface ExamFileContainerProps {
    examSlotId: number,
    examDate: string,
    fileTypes: FileType[],
    examFiles: IExamFile[]
}

const ExamFileContainer: React.FC<ExamFileContainerProps> = ({examSlotId, examDate, fileTypes, examFiles}) => {
    return (
        <>
            {
                fileTypes.map(fileType => {
                    let uploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                    if (uploadedExamFile) {
                        return <ExamFile key={fileType.id + " " + examSlotId + " " + examDate}
                                         examSlotId={examSlotId}
                                         fileTypeId={fileType.id}
                                         fileTypeName={fileType.name}
                                         uploaded={true}
                                         examDate={examDate}
                                         userUploadedFilename={uploadedExamFile.userUploadedFilename}
                        />;
                    }
                    return <ExamFile key={fileType.id + " " + examSlotId + " " + examDate}
                                     examSlotId={examSlotId}
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