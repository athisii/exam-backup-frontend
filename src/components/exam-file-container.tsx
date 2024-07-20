"use client"

import {FileType, IExamFile} from "@/types/types";
import {useEffect, useState} from "react";
import {fetchExamFile} from "@/app/actions";
import ExamFile from "@/components/exam-file";

const ExamFileContainer = ({examSlotId, examDate, fileTypes}: {
    examSlotId: number,
    examDate: string,
    fileTypes: FileType[]
}) => {
    const [examFiles, setExamFiles] = useState<IExamFile[]>([])
    useEffect(() => {
        const fetchExamFiles = async () => {
            const resExamFiles = await fetchExamFile(examSlotId, examDate);
            setExamFiles(resExamFiles);
        }
        fetchExamFiles()
    }, [])

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