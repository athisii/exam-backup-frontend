'use client'

import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {IExamSlot} from "@/types/types";


interface ExamSlotProps {
    examSlot: IExamSlot,
    index: number
    changeEditExamSlotId: Dispatch<SetStateAction<number>>
    editExamSlotId: number
}

const ExamSlot = ({examSlot, index, changeEditExamSlotId, editExamSlotId}: ExamSlotProps) => {
    const [previousName, setPreviousName] = useState<string>(examSlot.name)
    const [previousCode, setPreviousCode] = useState<string>(examSlot.code)

    const [currentName, setCurrentName] = useState<string>(examSlot.name)
    const [currentCode, setCurrentCode] = useState<string>(examSlot.code)
    const [edit, setEdit] = useState<boolean>(false)

    const nameRef = useRef<HTMLInputElement>(null);
    const codeRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editExamSlotId !== examSlot.id) {
            setEdit(false);
            setCurrentName(previousName)
            setCurrentCode(previousCode)
        }
    }, [editExamSlotId, examSlot.id, previousName, previousCode]);

    useEffect(() => {
        if (edit && editExamSlotId === examSlot.id) {
            nameRef.current?.focus();
        }
    }, [edit, editExamSlotId, examSlot.id]);

    return (
        <tr key={examSlot.id} className="border-b">
            <td className="px-6 py-4 text-center">
                {index + 1}
            </td>
            <td className="px-6 py-4">
                <input
                    ref={nameRef}
                    className={`py-2 w-20 rounded focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none ${edit ? "ring-1 ring-blue-100" : "bg-gray-50"}`}
                    type="text"
                    value={currentName}
                    disabled={!(editExamSlotId === examSlot.id && edit)}
                    onChange={event => {
                        setCurrentName(event.target.value)
                    }}/>
            </td>
            <td className="px-6 py-4 text-center">
                <input
                    ref={codeRef}
                    className={`py-2 w-12 rounded focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none ${edit ? "ring-1 ring-blue-100" : "bg-gray-50"}`}
                    type="text"
                    value={currentCode}
                    disabled={!(editExamSlotId === examSlot.id && edit)}
                    onChange={event => {
                        setCurrentCode(event.target.value)
                    }}/>
            </td>
            <td className="px-6 py-4 text-center">
                {examSlot.createdDate.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-center">
                {examSlot.modifiedDate.toLocaleString()}
            </td>
            <td className="px-6 py-4 text-center">
                <button
                    hidden={editExamSlotId !== 0 && editExamSlotId !== examSlot.id}
                    className={`border-1 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700 ${edit && "bg-blue-600"}`}
                    onClick={event => {
                        if (edit) {
                            setPreviousName(currentName)
                            setPreviousCode(currentCode)
                            setEdit(false);
                            changeEditExamSlotId(0);
                            // call save exam slot api
                            // if error show error notification in bottom right
                        } else {
                            setEdit(true);
                            changeEditExamSlotId(examSlot.id);
                        }
                    }}>{editExamSlotId === examSlot.id && edit ? "Save" : "Edit"}
                </button>
            </td>
            <td className="px-3 py-4">
                {
                    (editExamSlotId === examSlot.id && edit) ?
                        <button
                            className='py-2 px-4 rounded-md active:bg-gray-500 ring-1 ring-black active:text-white'
                            onClick={event => {
                                setEdit(false);
                                changeEditExamSlotId(0)
                            }}
                        >Cancel</button>
                        : <button
                            hidden={editExamSlotId !== 0}
                            className={`py-2 px-4 rounded-md active:bg-red-700 ${editExamSlotId === 0 ? "text-white bg-red-500" : "bg-gray-100"}`}>Delete</button>
                }
            </td>
        </tr>
    );
}

export default ExamSlot;