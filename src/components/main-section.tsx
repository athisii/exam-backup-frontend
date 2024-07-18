"use client"

import React, {useEffect, useState} from "react";
import ExamFile from "@/components/exam-file";
import {fetchExamFile} from "@/app/actions";
import {ExamSlot, FileType, IExamFile} from "@/types/types";


interface MainProps {
    examSlots: ExamSlot[];
    examFileTypes: FileType[];
}

const returnInHtmlInputDateFormat = (date: Date) => {
    const dateSplit = date.toLocaleDateString().split("/");
    const twoDigitMonth = dateSplit[0].length === 1 ? "0" + dateSplit[0] : dateSplit[0]
    const twoDigitDate = dateSplit[1].length === 1 ? "0" + dateSplit[1] : dateSplit[1]
    return `${dateSplit[2]}-${twoDigitMonth}-${twoDigitDate}`;
};

const MainSection: React.FC<MainProps> = ({examSlots, examFileTypes}) => {
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    const [examDate, setExamDate] = useState<string>(returnInHtmlInputDateFormat(today));
    const [examSlotId, setExamSlotId] = useState<number>(1);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);

    useEffect(() => {
        const updateExamFilesOnUi = async () => {
            const resExamFiles = await fetchExamFile(examSlotId, examDate);
            setExamFiles(resExamFiles);
        }
        updateExamFilesOnUi()
    }, [examDate, examSlotId])


    return (
        <>
            <div className='flex justify-end p-1 gap-1'>
                <label>Select Exam Date:</label>
                <input type="date" name="examDate" value={examDate}
                       onChange={(event) => setExamDate(event.target.value)}
                       min={returnInHtmlInputDateFormat(twoMonthsAgo)}
                       max={returnInHtmlInputDateFormat(today)}/>
                <label>Select Exam Slot</label>
                <select name="slotDropdown"
                        onChange={option => setExamSlotId(Number.parseInt(option.target.value, 10))}>
                    {examSlots.map(examSlot => (
                        <option defaultChecked={examSlot.id === examSlotId ? true : undefined}
                                key={examSlot.id}>{examSlot.id}</option>))}
                </select>
            </div>
            {
                examFileTypes.map(fileType => {
                    let uploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                    if (uploadedExamFile) {
                        return <ExamFile key={fileType.id}
                                         examSlotId={examSlotId}
                                         fileTypeId={fileType.id}
                                         fileTypeName={fileType.name}
                                         uploaded={true}
                                         examDate={examDate}
                                         userUploadedFilename={uploadedExamFile.userUploadedFilename}
                        />;
                    }
                    return <ExamFile key={fileType.id}
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
}

export default MainSection