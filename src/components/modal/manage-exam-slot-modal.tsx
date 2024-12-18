'use client'

import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Loading from "@/components/loading";
import MultiSelect from "@/components/multi-select";
import {ApiResponse, IExamCentre, IMultiSelect, IRegionExamDateSlotArray} from "@/types/types";
import {fetchExamCentresByRegions} from "@/lib/actions/exam-centre-actions";


const ManageExamSlotModal = ({
                                 title,
                                 isLoading,
                                 loadingHandler,
                                 errorMessage,
                                 errorMessageHandler,
                                 regionExamDateSlotArray,
                                 saveClickHandler,
                                 cancelClickHandler
                             }: {
    title: string,
    isLoading: boolean,
    loadingHandler: Dispatch<SetStateAction<boolean>>,
    errorMessage: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    regionExamDateSlotArray: IRegionExamDateSlotArray,
    saveClickHandler: (examCentreIds: number[], examDateIds: number[], slotIds: number[]) => void,
    cancelClickHandler: () => void
}) => {

    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [selectedExamCentres, setSelectedExamCentres] = useState<IMultiSelect[]>([]);
    const [selectedRegions, setSelectedRegions] = useState<IMultiSelect[]>([]);
    const [selectedExamDates, setSelectedExamDates] = useState<IMultiSelect[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<IMultiSelect[]>([]);

    const handleSaveClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        if (selectedRegions.length === 0) {
            errorMessageHandler("Select at least one region.");
            return;
        }
        if (selectedExamCentres.length === 0) {
            errorMessageHandler("Select at least one exam centre.");
            return;
        }
        if (selectedSlots.length === 0) {
            errorMessageHandler("Select at least one slot.");
            return;
        }
        if (selectedExamDates.length === 0) {
            errorMessageHandler("Select at least one exam date.");
            return;
        }
        saveClickHandler(selectedExamCentres.map(examCentre => examCentre.id), selectedExamDates.map(examDate => examDate.id), selectedSlots.map(slot => slot.id));
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

    useEffect(() => {
        errorMessageHandler("");
        loadingHandler(true);
        fetchExamCentresAsync();
    }, [selectedRegions]);

    useEffect(() => {
        errorMessageHandler("");
    }, [selectedExamCentres, selectedExamDates, selectedSlots]);

    const fetchExamCentresAsync = async () => {
        const apiResponse: ApiResponse = await fetchExamCentresByRegions(selectedRegions.map(region => region.id));
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            errorMessageHandler(apiResponse.message);
            loadingHandler(false);
            return;
        }
        setExamCentres(() => {
            const examCentres: IExamCentre[] = apiResponse.data;
            setSelectedExamCentres(prevState => prevState.filter(selectedExamCentre => examCentres.some(examCentre => selectedExamCentre.id === examCentre.id)));
            return examCentres;
        });
        loadingHandler(false);
    }

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading/> :
                <div className="sm:w-[50vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1 ">
                        <h2 className="text-center text-white font-bold p-2 rounded-md bg-blue-500">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-2 text-center">
                        {errorMessage && <div className="pb-3 text-red-500">
                            {errorMessage}
                        </div>}

                        <div className="grid sm:grid-cols-2 gap-10">
                            <div className="flex justify-center items-center gap-3">
                                <label className="text-m font-bold text-black-700">
                                    Exam Regions
                                </label>
                                <MultiSelect
                                    className="text-center"
                                    dropDownName="Select Regions"
                                    options={regionExamDateSlotArray.regions.map(region => ({
                                        id: region.id,
                                        value: region.name
                                    }))}
                                    selectedOptions={selectedRegions}
                                    changeSelectedOptions={setSelectedRegions}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <label className="text-m font-bold text-black-700">
                                    Exam Centers
                                </label>
                                <MultiSelect
                                    className="text-center"
                                    dropDownName="Select Centers"
                                    options={examCentres.map(examCentre => ({
                                        id: examCentre.id,
                                        value: examCentre.code
                                    }))}
                                    selectedOptions={selectedExamCentres}
                                    changeSelectedOptions={setSelectedExamCentres}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <label className="text-m font-bold text-black-700">
                                    Exam Slots
                                </label>
                                <MultiSelect
                                    className="text-center"
                                    dropDownName="Select Slots"
                                    options={regionExamDateSlotArray.slots.map(slot => ({
                                        id: slot.id,
                                        value: slot.name
                                    }))}
                                    selectedOptions={selectedSlots}
                                    changeSelectedOptions={setSelectedSlots}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <label className="text-m font-bold text-black-700">
                                    Exam Dates
                                </label>
                                <MultiSelect
                                    className="text-center"
                                    dropDownName="Select Dates"
                                    options={regionExamDateSlotArray.examDates.map(examDate => ({
                                        id: examDate.id,
                                        value: examDate.date
                                    }))}
                                    selectedOptions={selectedExamDates}
                                    changeSelectedOptions={setSelectedExamDates}
                                />
                            </div>
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

export default ManageExamSlotModal;