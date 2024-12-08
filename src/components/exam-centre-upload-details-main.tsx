"use client"

import React, {Suspense, useEffect, useState} from "react";
import {ApiResponse, ApiResponsePage, IExamDate, IExamFile, IFileType, ISlot} from "@/types/types";
import {fetchExamFiles} from "@/lib/actions/exam-file-actions";
import {fetchSlotsForExam} from "@/lib/actions/slot-actions";
import ExamFileView from "@/components/exam-file-view";


interface MainProps {
    examCentreId: number;
    examDates: IExamDate[];
    fileTypes: IFileType[];
}

const ExamCentreUploadDetailsMain: React.FC<MainProps> = ({examCentreId, examDates, fileTypes}) => {
    const [examDate, setExamDate] = useState<IExamDate>(examDates[0]);
    const [slot, setSlot] = useState<ISlot>({id: 0, code: "", name: ""} as ISlot);
    const [slots, setSlots] = useState<ISlot[]>([]);
    const [examFiles, setExamFiles] = useState<IExamFile[]>([]);


    const fetchExamFilesAsync = async () => {
        const apiResponse: ApiResponse = await fetchExamFiles(examCentreId, examDate.id, slot.id);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam files.");
        }
        setExamFiles(apiResponse.data);
    }
    useEffect(() => {
        fetchSlotAsync()
    }, [examDate]);

    useEffect(() => {
        if (slot.id !== 0) {
            fetchExamFilesAsync();
        }
    }, [slot])

    const handleSlopDropdown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSlot = slots.find(slot => slot.name === event.target.value)
        if (!selectedSlot) {
            return;
        }
        setSlot(() => selectedSlot);
    }

    const handleExamDateDropdown = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedExamDate = examDates.find(ed => ed.date === event.target.value)
        if (!selectedExamDate) {
            return;
        }
        setExamDate(() => selectedExamDate);
    }

    const fetchSlotAsync = async () => {
        const apiResponse: ApiResponse = await fetchSlotsForExam(examCentreId, examDate.id);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching slots.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        const fetchedSlots: ISlot[] = apiResponsePage.items as ISlot[];
        setSlots(() => fetchedSlots.sort((x, y) => x.name.toLowerCase().localeCompare(y.name.toLowerCase())));
        if (fetchedSlots.length == 0) {
            setSlot(() => {
                return {id: 0, name: "", code: ""} as ISlot
            })
        } else {
            setSlot(() => fetchedSlots[0]);
        }
    }
    return (
        <>
            <div className='flex justify-center items-center gap-5 py-4'>
                <div>
                    <label className="mr-2 font-bold">Select Exam Date:</label>
                    <select className="bg-blue-500 rounded text-white active:bg-white active:text-black h-8 font-bold"
                            name="examDateDropdown"
                            onChange={handleExamDateDropdown}>
                        {examDates.map(examDate => (
                            <option key={examDate.id}>{examDate.date}</option>))}
                    </select>
                </div>
                <div>
                    <label className="mr-2 font-bold">Select Slot:</label>
                    <select className="bg-blue-500 rounded text-white active:bg-white h-8 active:text-black font-bold"
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
                            <h2> Kindly add slot.</h2>
                        </div>)
                    :
                    < Suspense fallback={<p>Loading....</p>}>
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-600">
                                <thead className="text-l text-black uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="p-3">
                                        File Type Name
                                    </th>
                                    <th scope="col" className="p-3">
                                        Status
                                    </th>
                                    <th scope="col" className="p-3">
                                        Uploaded Filename
                                    </th>
                                    <th scope="col" className="p-3">
                                        File Size (MB)
                                    </th>
                                    <th scope="col" className="p-3">
                                        Download
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    fileTypes.map(fileType => {
                                        let uploadedExamFile = examFiles.find(examFile => examFile.fileType.id === fileType.id);
                                        if (uploadedExamFile) {
                                            return (
                                                <ExamFileView key={fileType.id + " " + slot.id + " " + examDate.id}
                                                              fileTypeName={fileType.name}
                                                              uploaded={true}
                                                              userUploadedFilename={uploadedExamFile.userUploadedFilename}
                                                              fileSize={uploadedExamFile.fileSize}
                                                              filePath={uploadedExamFile.filePath}
                                                />
                                            )
                                        }
                                        return (
                                            <ExamFileView key={fileType.id + " " + slot.id + " " + examDate.id}
                                                          fileTypeName={fileType.name}
                                                          uploaded={false}
                                                          userUploadedFilename={null}
                                                          fileSize={null}
                                                          filePath={null}
                                            />
                                        );
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    </Suspense>
            }
        </>
    );
}

export default ExamCentreUploadDetailsMain;