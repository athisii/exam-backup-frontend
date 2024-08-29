"use client"

import React, {Suspense, useState} from "react";
import {ApiResponse, ApiResponsePage, IExamCentre, IExamDate, IExamFile, ISlot} from "@/types/types";
import {fetchSlotsForExam} from "@/app/actions";


interface MainProps {
    examCentre: IExamCentre;
    examDates: IExamDate[];
}


const UserMainSection: React.FC<MainProps> = ({examCentre, examDates}) => {
    const [examDate, setExamDate] = useState<IExamDate | null>(null);
    const [slot, setSlot] = useState<ISlot | null>(null);
    const [slots, setSlots] = useState<ISlot[]>([]);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);


    // const fetchExamFilesOnValueChange = async () => {
    //     const apiResponse: ApiResponse = await fetchExamFiles(examCentreId, slotId, examDateId);
    //     if (!apiResponse.status) {
    //         console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
    //         throw new Error("Error fetching exam files.");
    //     }
    //     setExamFiles(apiResponse.data);
    // }
    //
    // useEffect(() => {
    //     fetchExamFilesOnValueChange()
    // }, [examDate, slotId])

    async function handleExamDateDropdown(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedExamDate = examDates.find(ed => ed.date === event.target.value)
        if (!selectedExamDate) {
            return;
        }
        setExamDate(() => selectedExamDate);
        const apiResponse: ApiResponse = await fetchSlotsForExam(examCentre.id, selectedExamDate.id);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching slots.");
        }
        const apiResponsePage = apiResponse.data as ApiResponsePage;
        setSlots(() => apiResponsePage.items);
    }

    const handleSlopDropdown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(event.target.value)
    }

    return (
        <>
            <div className='flex justify-end items-center p-1 gap-1'>
                <label>Select Exam Date:</label>
                <select name="examDateDropdown" onChange={handleExamDateDropdown}>
                    {examDates.map(examDate => (
                        <option key={examDate.id}>{examDate.date}</option>))}
                </select>
                <label>Select Slot</label>
                <select name="slotDropdown" onChange={handleSlopDropdown}>
                    {slots.map(slot => (<option key={slot.id}> {slot.name}</option>))}
                </select>
            </div>
            < Suspense fallback={<p>Loading....</p>}>
                {/*<ExamFileContainer examDate={examDate}*/}
                {/*                   slotId={slotId}*/}
                {/*                   fileTypes={fileTypes}*/}
                {/*                   examFiles={examFiles}*/}
                {/*/>*/}
            </Suspense>
        </>
    );
}

export default UserMainSection