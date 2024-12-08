"use client"

import React, {Suspense, useEffect, useState} from "react";
import {
    ApiResponse,
    ApiResponsePage,
    IExamCentre,
    IExamDate,
    IExamFile,
    IFileExtension,
    IFileType,
    ISlot
} from "@/types/types";
import {fetchExamFiles} from "@/lib/actions/app-actions";
import {fetchSlotsForExam} from "@/lib/actions/slot-actions";
import ExamFileUploadContainer from "@/components/uploader/exam-file-upload-container";


interface CompProp {
    examCentre: IExamCentre,
    examDates: IExamDate[],
    fileTypes: IFileType[],
    fileExtensions: IFileExtension[]
}


const MainSection: React.FC<CompProp> = ({examCentre, fileTypes, examDates, fileExtensions}) => {
    const [examDate, setExamDate] = useState<IExamDate>(examDates[0]);
    const [slot, setSlot] = useState<ISlot>({id: 0, name: "", code: ""} as ISlot);
    const [slots, setSlots] = useState<ISlot[]>([]);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);

    useEffect(() => {
        fetchSlotAsync()
    }, [examDate]);

    useEffect(() => {
        if (slot.id != 0) {
            fetchExamFilesAsync();
        }
    }, [slot]);

    const handleExamDateDropdown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
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

    const fetchSlotAsync = async () => {
        const slotsApiResponse: ApiResponse = await fetchSlotsForExam(examCentre.id, examDate.id);
        if (!slotsApiResponse.status) {
            console.log(`error: status=${slotsApiResponse.status}, message=${slotsApiResponse.message}`);
            throw new Error("Error fetching slots.");
        }
        const slotsApiResponsePage: ApiResponsePage = slotsApiResponse.data as ApiResponsePage;
        const fetchedSlots: ISlot[] = slotsApiResponsePage.items as ISlot[];
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
            <div className='flex justify-center items-center gap-5 py-4'>
                <div>
                    <label className="mr-4">Select Exam Date:</label>
                    <select className="bg-green-500 rounded text-white active:bg-white active:text-black h-[40px]"
                            name="examDateDropdown"
                            onChange={handleExamDateDropdown}>
                        {examDates.map(examDate => (
                            <option key={examDate.id}>{examDate.date}</option>))}
                    </select>
                </div>
                <div>
                    <label className="mr-4">Select Slot:</label>
                    <select className="bg-green-500 rounded text-white active:bg-white active:text-black h-[40px]"
                            name="slotDropdown"
                            onChange={handleSlopDropdown}>
                        {slots.map(slot => (<option key={slot.id + " " + examDate.id}> {slot.name}</option>))}
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
                        <div>
                            <ExamFileUploadContainer
                                examCentreId={examCentre.id}
                                examDateId={examDate.id}
                                slotId={slot.id}
                                fileTypes={fileTypes}
                                examFiles={examFiles}
                                fileExtensions={fileExtensions}
                            />
                        </div>
                    </Suspense>
            }
        </>
    );
}

export default MainSection;