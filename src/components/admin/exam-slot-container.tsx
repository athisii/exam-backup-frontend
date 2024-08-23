'use client'

import React, {useState} from 'react';
import {IExamSlot} from "@/types/types";
import ExamSlot from "@/components/admin/exam-slot";

const ExamSlotContainer = ({examSlots}: { examSlots: IExamSlot[] }) => {
    const [editExamSlotId, setEditExamSlotId] = useState<number>(0)
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        SN
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Code
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Created Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Modified Date
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    examSlots.map((examSlot, index) => {
                        return (
                            <ExamSlot key={examSlot.id}
                                      examSlot={examSlot}
                                      index={index}
                                      changeEditExamSlotId={setEditExamSlotId}
                                      editExamSlotId={editExamSlotId}
                            />
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    )
}

export default ExamSlotContainer;