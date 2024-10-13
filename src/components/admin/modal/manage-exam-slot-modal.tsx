import React, {useState} from 'react';
import Loading from "@/components/admin/loading";
import MultiSelect from "@/components/admin/multi-select";
import {IExamDate, IMultiSelect, IRegionExamDateSlotArray} from "@/types/types";


const ManageExamSlotModal = ({
                                 title,
                                 regionExamDateSlotArray,
                                 cancelClickHandler
                             }: {
    title: string,
    regionExamDateSlotArray: IRegionExamDateSlotArray
    cancelClickHandler: () => void
}) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedRegions, setSelectedRegions] = useState<(IMultiSelect)[]>([]);
    const [selectedCenters, setSelectedCenters] = useState<IMultiSelect[]>([]);
    const [selectedDates, setSelectedDates] = useState<IMultiSelect[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<IMultiSelect[]>([]);


    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        // async function
    };

    function handleCancelClick(event: React.MouseEvent<HTMLButtonElement>) {
        clearErrorMessage();
        cancelClickHandler();
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

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
                        {errorMessage && <div className="text-red-500">
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
                                    options={[]}
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
                                    options={[]}
                                    selectedOptions={selectedCenters}
                                    changeSelectedOptions={setSelectedCenters}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3">
                                <label className="text-m font-bold text-black-700">
                                    Exam Slots
                                </label>
                                <MultiSelect
                                    className="text-center"
                                    dropDownName="Select Slots"
                                    options={[]}
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
                                    options={[]}
                                    selectedOptions={selectedDates}
                                    changeSelectedOptions={setSelectedDates}
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