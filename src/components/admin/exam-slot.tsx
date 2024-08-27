'use client'

import React, {Dispatch, SetStateAction} from 'react';
import {IExamSlot} from "@/types/types";


interface ExamSlotProps {
    examSlot: IExamSlot,
    index: number
    setShowEditModal: Dispatch<SetStateAction<boolean>>
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>
    changeSelectedExamSlot: Dispatch<SetStateAction<IExamSlot>>
}

const ExamSlot = ({
                      examSlot,
                      index,
                      changeSelectedExamSlot,
                      setShowEditModal,
                      setShowDeleteModal
                  }: ExamSlotProps) => {

    const handleEditClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        changeSelectedExamSlot(examSlot);
        setShowEditModal(true)
    };

    const handleDeleteClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        changeSelectedExamSlot(examSlot);
        setShowDeleteModal(true);
    };

    return (
        <>
            <tr key={examSlot.id} className="border-1 hover:bg-gray-100">
                <td className="px-6 py-4 text-center">
                    {index}
                </td>
                <td className="px-6 py-4">
                    {examSlot.name}
                </td>
                <td className="px-6 py-4 text-center">
                    {examSlot.code}
                </td>
                <td className="px-6 py-4 text-center">
                    {examSlot.createdDate?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                    {examSlot.modifiedDate?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                    <button
                        className={`py-2 px-4 rounded-md text-white active:bg-green-300`}
                        onClick={handleEditClick}>
                        <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                        </svg>
                    </button>
                </td>
                <td className="px-6 py-4">
                    {
                        <button
                            className={`py-2 px-4 text-white rounded-md active:bg-red-300`}
                            onClick={handleDeleteClick}>
                            <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                 viewBox="0 0 24 24">
                                <path stroke="red" strokeLinecap="round" strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                            </svg>

                        </button>
                    }
                </td>
            </tr>
        </>
    );
}

export default ExamSlot;