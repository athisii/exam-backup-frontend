"use client"

import React, {Suspense, useEffect, useState} from "react";
import {ExamSlot, FileType, IExamFile} from "@/types/types";
import ExamFileContainer from "@/components/exam-file-container";
import {fetchExamFile} from "@/app/actions";


interface MainProps {
    examCentreCode: string;
    examSlots: ExamSlot[];
    fileTypes: FileType[];
}

const returnInHtmlInputDateFormat = (date: Date) => {
    const dateSplit = date.toLocaleDateString().split("/");
    const twoDigitMonth = dateSplit[0].length === 1 ? "0" + dateSplit[0] : dateSplit[0]
    const twoDigitDate = dateSplit[1].length === 1 ? "0" + dateSplit[1] : dateSplit[1]
    return `${dateSplit[2]}-${twoDigitMonth}-${twoDigitDate}`;
};

const MainSection: React.FC<MainProps> = ({examCentreCode, examSlots, fileTypes}) => {
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    const [examDate, setExamDate] = useState<string>(returnInHtmlInputDateFormat(today));
    const [examSlotId, setExamSlotId] = useState<number>(1);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);


    const fetchExamFiles = async () => {
        const resExamFiles = await fetchExamFile(examCentreCode, examSlotId, examDate);
        setExamFiles(resExamFiles);
    }

    useEffect(() => {
        fetchExamFiles()
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
                        <option defaultChecked={examSlot.id === examSlotId}
                                key={examSlot.id}>{examSlot.id}</option>))}
                </select>
            </div>
            < Suspense fallback={<p>Loading....</p>}>
                <ExamFileContainer examDate={examDate}
                                   examSlotId={examSlotId}
                                   fileTypes={fileTypes}
                                   examFiles={examFiles}
                />
            </Suspense>
        </>
    );
}

export default MainSection