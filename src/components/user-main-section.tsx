"use client"

import React, {Suspense, useEffect, useState} from "react";
import {ApiResponse, ApiResponsePage, IExamCentre, IExamDate, IExamFile, IFileType, ISlot} from "@/types/types";
import {fetchExamFiles, fetchSlotsForExam} from "@/app/actions";
import ExamFileContainer from "@/components/exam-file-container";


interface MainProps {
    examCentre: IExamCentre;
    examDates: IExamDate[];
    fileTypes: IFileType[]
}


const UserMainSection: React.FC<MainProps> = ({examCentre, fileTypes, examDates}) => {
    const [examDate, setExamDate] = useState<IExamDate>(examDates[0]);
    const [slot, setSlot] = useState<ISlot>({id: 0, name: "", code: ""} as ISlot);
    const [slots, setSlots] = useState<ISlot[]>([]);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);

    useEffect(() => {
        fetchExamSlotAsync()
    }, [examDate]);

    useEffect(() => {
        if (slot.id != 0) {
            fetchExamFilesAsync();
        }
    }, [slot]);

    useEffect(() => {
        console.log("examFilesChanged::examFiles", examFiles);
    }, [examFiles]);

    async function handleExamDateDropdown(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedExamDate = examDates.find(ed => ed.date === event.target.value)
        if (!selectedExamDate) {
            return;
        }
        setExamDate(() => selectedExamDate);
    }

    const handleSlopDropdown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSlot = slots.find(slot => slot.name === event.target.value)
        if (!selectedSlot) {
            return;
        }
        setSlot(() => selectedSlot);
    }

    const fetchExamSlotAsync = async () => {
        const apiResponse: ApiResponse = await fetchSlotsForExam(examCentre.id, examDate.id);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching slots.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        const fetchedSlots: ISlot[] = apiResponsePage.items as ISlot[];
        setSlots(() => fetchedSlots.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())));
        if (fetchedSlots.length == 0) {
            setSlot(() => {
                return {id: 0, name: "", code: ""} as ISlot
            })
        } else {
            setSlot(() => fetchedSlots[0]);
        }
    }

    const fetchExamFilesAsync = async () => {
        const apiResponse: ApiResponse = await fetchExamFiles(examCentre.id, examDate.id, slot.id);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam files.");
        }
        setExamFiles(apiResponse.data);
    }

    return (
        <>
            <div className='flex justify-center items-center gap-3'>
                <div>
                    <label className="mr-2">Select Exam Date:</label>
                    <select className="bg-blue-500 rounded text-white active:bg-white active:text-black"
                            name="examDateDropdown"
                            onChange={handleExamDateDropdown}>
                        {examDates.map(examDate => (
                            <option key={examDate.id}>{examDate.date}</option>))}
                    </select>
                </div>
                <div>
                    <label className="mr-2">Select Slot:</label>
                    <select className="bg-blue-500 rounded text-white active:bg-white active:text-black"
                            name="slotDropdown"
                            onChange={handleSlopDropdown}>
                        {slots.map(slot => (<option key={slot.id}> {slot.name}</option>))}
                    </select>
                </div>
            </div>
            {
                slots.length == 0 ? (
                        <div className="text-large font-bold text-center justify-center items-center m-auto">
                            <h2>No slot found for exam date: {examDate.date}</h2>
                            <h2> Kindly contact the admin to slot exam.</h2>
                        </div>)
                    :
                    < Suspense fallback={<p>Loading....</p>}>
                        <ExamFileContainer
                            examCentreId={examCentre.id}
                            examDateId={examDate.id}
                            slotId={slot.id}
                            fileTypes={fileTypes}
                            examFiles={examFiles}
                        />
                    </Suspense>
            }
        </>
    );
}

export default UserMainSection