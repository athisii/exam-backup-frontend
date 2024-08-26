"use client"

import React, {Suspense, useEffect, useState} from "react";
import {ApiResponse, ExamSlot, FileType, IExamFile} from "@/types/types";
import {fetchExamFiles} from "@/app/actions";
import AdminExamFileContainer from "@/components/admin/admin-exam-file-container";
import {returnInHtmlInputDateFormat} from "@/utils/date-util";


interface MainProps {
    examCentreCode: string;
    examSlots: ExamSlot[];
    fileTypes: FileType[];
}

const ExamCentreUploadDetailsMainSection: React.FC<MainProps> = ({examCentreCode, examSlots, fileTypes}) => {
    const today = new Date();
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(today.getMonth() - 2);

    const [examDate, setExamDate] = useState<string>(returnInHtmlInputDateFormat(today));
    const [examSlotId, setExamSlotId] = useState<number>(1);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);


    const fetchExamFilesOnValueChanged = async () => {
        const apiResponse: ApiResponse = await fetchExamFiles(examCentreCode, examSlotId, examDate);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam files.");
        }
        setExamFiles(apiResponse.data);
    }

    useEffect(() => {
        fetchExamFilesOnValueChanged()
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
                <AdminExamFileContainer examDate={examDate}
                                        examSlotId={examSlotId}
                                        fileTypes={fileTypes}
                                        examFiles={examFiles}
                />
            </Suspense>
        </>
    );
}

export default ExamCentreUploadDetailsMainSection