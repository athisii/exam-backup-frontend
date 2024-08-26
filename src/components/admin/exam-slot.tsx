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
            <tr key={examSlot.id} className="border-b hover:bg-gray-100">
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
                        className={`bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                        onClick={handleEditClick}>
                        Edit
                    </button>
                </td>
                <td className="px-3 py-4">
                    {
                        <button
                            className={`py-2 px-4 text-white bg-red-500 rounded-md active:bg-red-700`}
                            onClick={handleDeleteClick}>
                            Delete
                        </button>
                    }
                </td>
            </tr>
        </>
    );
}

export default ExamSlot;