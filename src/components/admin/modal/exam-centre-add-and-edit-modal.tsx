import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Loading from "@/components/admin/loading";
import {IExamCentre, IExamDate, IExamDateSlot, IRegionExamDateSlotArray, ISlot} from "@/types/types";
import MultiSelect from "@/components/admin/multi-select";


function returnSelectedExamDates(examDates: IExamDate[], examDateSlots: IExamDateSlot[]): IExamDate[] {
    return examDates.filter(examDate => examDateSlots.some(examDateSlot => examDateSlot.examDateId == examDate.id));
}

const ExamCentreAddAndEditModal = ({
                                       title,
                                       isLoading,
                                       errorMessage,
                                       examCentre,
                                       regionExamDateSlotArray,
                                       errorMessageHandler,
                                       saveClickHandler,
                                       cancelClickHandler
                                   }: {
    title: string,
    isLoading: boolean,
    errorMessage: string,
    examCentre?: IExamCentre,
    regionExamDateSlotArray: IRegionExamDateSlotArray,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    saveClickHandler: (name: string, code: string, regionName: string, mobileNumber: string, email: string, selectedExamDatesSlots: IExamDateSlot[]) => void,
    cancelClickHandler: () => void
}) => {
    const [name, setName] = useState(examCentre ? examCentre.name : "")
    const [code, setCode] = useState(examCentre ? examCentre.code : "")
    const [email, setEmail] = useState<string>(examCentre && examCentre.email ? examCentre.email : "")
    const [mobileNumber, setMobileNumber] = useState<string>(examCentre && examCentre.mobileNumber ? examCentre.mobileNumber : "")
    const [regionName, setRegionName] = useState<string>(examCentre ? examCentre.regionName : regionExamDateSlotArray.regions[0].name)
    const [selectedExamDates, setSelectedExamDates] = useState<IExamDate[]>(returnSelectedExamDates(regionExamDateSlotArray.examDates, examCentre ? examCentre.examDateSlots : []));
    const [selectedExamDatesSlots, setSelectedExamDatesSlots] = useState<IExamDateSlot[]>(examCentre ? examCentre.examDateSlots : []);

    useEffect(() => {
        setSelectedExamDatesSlots(prevState => {
            // convert into map for easy access.
            const prevStateMap = new Map(prevState.map(item => [item.examDateId, item]));
            const filteredExamDateSlots = selectedExamDates.flatMap(examDate => {
                if (prevStateMap.has(examDate.id)) {
                    return [] // skip it
                }
                return [{examDateId: examDate.id, slotIds: []}]
            });
            return [...prevState, ...filteredExamDateSlots]
        });
    }, [selectedExamDates]);


    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        // async function
        saveClickHandler(name, code, regionName, mobileNumber, email, selectedExamDatesSlots);
    };

    function handleCancelClick(event: React.MouseEvent<HTMLButtonElement>) {
        clearErrorMessage();
        cancelClickHandler();
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            errorMessageHandler("");
        }
    };

    function handleSlotClick(examDate: IExamDate, slot: ISlot) {
        const examDateSlotIndex = selectedExamDatesSlots.findIndex(examDateSlot => examDateSlot.examDateId === examDate.id);
        if (examDateSlotIndex !== -1) {
            // avoid direct mutation, should always create new object to be detected by React
            const newState = [...selectedExamDatesSlots];
            const selectedExamDateSlot = newState[examDateSlotIndex];

            const newSlotIds = selectedExamDateSlot.slotIds.includes(slot.id)
                ? selectedExamDateSlot.slotIds.filter(id => id !== slot.id)
                : [...selectedExamDateSlot.slotIds, slot.id];

            // Update the slot data in the copied state
            newState[examDateSlotIndex] = {
                ...selectedExamDateSlot,
                slotIds: newSlotIds
            };
            setSelectedExamDatesSlots(newState)
        }
    }

    const examDateSlotMap = new Map(selectedExamDatesSlots.map(item => [item.examDateId, item]));

    function toggleSelectAll(examDate: IExamDate) {
        const selectedExamDateIndex = selectedExamDatesSlots.findIndex(examDateSlot => examDateSlot.examDateId === examDate.id);
        if (selectedExamDateIndex !== -1) {
            const newState = [...selectedExamDatesSlots];
            const examDateSlots = newState[selectedExamDateIndex];
            if (examDateSlots.slotIds.length === 0) {
                newState[selectedExamDateIndex] = {
                    examDateId: examDate.id,
                    slotIds: regionExamDateSlotArray.slots.map(slot => slot.id)
                }
            } else {
                newState[selectedExamDateIndex] = {examDateId: examDate.id, slotIds: []}
            }
            setSelectedExamDatesSlots(newState);
        }
    }

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading/> :
                <div className="sm:w-[70vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1">
                    <h2 className="text-center text-medium text-white font-bold bg-blue-500 p-2 rounded-md">
                        {title}
                    </h2>

                    </div>
                    <div className="sm:w-full flex flex-col justify-center text-center">
                        {errorMessage && <div className="text-red-500">
                            {errorMessage}
                        </div>}
                        <div className="flex sm:w-full justify-between items-center mt-3 p-3 gap-4">
                        
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold">Name:</label>
                            <textarea
                              autoFocus
                              className="w-full h-10 p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                              value={name}
                              onChange={event => {
                                clearErrorMessage();
                                setName(event.target.value);
                              }}
                            />
                          </div>
                          
                         
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold">Code:</label>
                            <input
                              type="number"
                              className="p-2 w-full rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                              value={code}
                              onChange={event => {
                                clearErrorMessage();
                                setCode(event.target.value);
                              }}
                            />
                          </div>
                          
                   
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold">Region:</label>
                            <select
                              defaultValue={regionName}
                              className="w-full rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 cursor-pointer h-10 hover:border-black border"
                              onChange={event => {
                                clearErrorMessage();
                                setRegionName(event.target.value);
                              }}
                            >
                              {regionExamDateSlotArray.regions.map(region => (
                                <option key={region.id}>{region.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex sm:w-full justify-between items-center mt-3 p-3 gap-3">
                        
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold whitespace-nowrap">Mobile Number:</label>
                            <input
                              className="w-[60%] p-1 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                              value={mobileNumber}
                              onChange={event => {
                                clearErrorMessage();
                                setMobileNumber(event.target.value);
                              }}
                            />
                          </div>
                          
                    
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold">Email:</label>
                            <input
                              type="email"
                              className="w-[80%] p-1 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                              value={email}
                              onChange={event => {
                                clearErrorMessage();
                                setEmail(event.target.value);
                              }}
                            />
                          </div>
                          
                        
                          <div className="flex sm:w-1/3 justify-start items-center gap-3">
                            <label className="font-bold whitespace-nowrap">Exam Date:</label>
                            <MultiSelect
                              className="w-[80%] bg-gray-50"
                              dropDownName="Select"
                              changeSelectedExamDates={setSelectedExamDates}
                              selectedExamDates={selectedExamDates}
                              examDates={regionExamDateSlotArray.examDates}
                            />
                          </div>
                        </div>

                        <div
                            className="flex sm:w-full justify-end border-t-1 border-b-1 border-gray-500 items-center mt-3 p-3">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-black uppercase bg-blue-100 ">
                                <tr>
                                    <th scope="col" className="px-8 py-3">
                                        Exam Date
                                    </th>
                                    {regionExamDateSlotArray.slots.map(slot => (
                                        <th key={slot.id} scope="col" className="px-8 py-3">
                                            {slot.name}
                                        </th>))}
                                    <th scope="col" className="px-8 py-3">
                                        All
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    selectedExamDates.map(examDate => {
                                            const examDateSlot = examDateSlotMap.get(examDate.id);
                                            return (
                                                <tr key={examDate.id}
                                                    className="bg-white border-b hover:bg-gray-50">
                                                    <td scope="col" className="px-8 py-4">
                                                        {examDate.date}
                                                    </td>
                                                    {regionExamDateSlotArray.slots.map(slot => {
                                                        return (
                                                            <td key={slot.id} scope="col" className="px-8 py-4">
                                                                {examDateSlot && examDateSlot.slotIds.includes(slot.id) ?
                                                                    <svg
                                                                        onClick={event => handleSlotClick(examDate, slot)}
                                                                        className="h-6 w-6 flex-none fill-green-500 stroke-white stroke-2 cursor-pointer"
                                                                        strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="11"/>
                                                                        <path
                                                                            d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9"
                                                                            fill="none"/>
                                                                    </svg>
                                                                    :
                                                                    <svg
                                                                        onClick={event => handleSlotClick(examDate, slot)}
                                                                        className="h-6 w-6 flex-none fill-red-500 stroke-white stroke-2 cursor-pointer"
                                                                        strokeLinecap="round" strokeLinejoin="round">
                                                                        <circle cx="12" cy="12" r="11"/>
                                                                        <path d="M8 8 L16 16 M16 8 L8 16" fill="none"/>
                                                                    </svg>
                                                                }
                                                            </td>);
                                                    })}
                                                    <td scope="col" className="px-8 py-4">
                                                        {
                                                            examDateSlot && examDateSlot.slotIds.length === regionExamDateSlotArray.slots.length ?
                                                                <svg
                                                                    onClick={event => toggleSelectAll(examDate)}
                                                                    className="h-6 w-6 flex-none fill-blue-500 stroke-white stroke-2 cursor-pointer"
                                                                    strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="12" cy="12" r="13"/>
                                                                    <path
                                                                        d="m8 13 2.165 2.165 a1 1 0 0 0 1.521 -.126 L16 9"
                                                                        fill="none"/>
                                                                </svg>
                                                                :
                                                                <svg
                                                                    onClick={event => toggleSelectAll(examDate)}
                                                                    className="h-6 w-6 flex-none fill-red-500 stroke-white stroke-2 cursor-pointer"
                                                                    strokeLinecap="round" strokeLinejoin="round">
                                                                    <circle cx="12" cy="12" r="13"/>
                                                                    <path d="M8 8 L16 16 M16 8 L8 16" fill="none"/>
                                                                </svg>

                                                        }

                                                    </td>
                                                </tr>
                                            )
                                        }
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-center gap-4 p-2 mt-8 text-white font-bold">
                            <button
                                className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md disabled:active:bg-green-500 active:bg-green-700`}
                                onClick={handleSaveClick}>
                                Save
                            </button>
                            <button
                                className={`sm:w-[20%] bg-red-500 py-2 px-4 rounded-md disabled:active:bg-red-500`}
                                onClick={handleCancelClick}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default ExamCentreAddAndEditModal;