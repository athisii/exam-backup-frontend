import React, {Dispatch, SetStateAction, useState} from 'react';
import Loading from "@/components/admin/loading";


const SlotAddAndEditModal = ({
                                 title,
                                 isLoading,
                                 errorMessage,
                                 initialStartTime,
                                 initialEndTime,
                                 initialName,
                                 initialCode,
                                 errorMessageHandler,
                                 saveClickHandler,
                                 cancelClickHandler
                             }: {
    title: string,
    isLoading: boolean,
    errorMessage: string,
    initialStartTime?: string,
    initialEndTime?: string,
    initialName?: string,
    initialCode?: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    saveClickHandler: (name: string, code: string, startTime: string, endTime: string) => void,
    cancelClickHandler: () => void
}) => {
    const [name, setName] = useState(initialName ? initialName : "")
    const [code, setCode] = useState(initialCode ? initialCode : "")
    const [startTime, setStartTime] = useState(initialStartTime ? initialStartTime : "")
    const [endTime, setEndTime] = useState(initialEndTime ? initialEndTime : "")

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        // async function
        saveClickHandler(name, code, startTime, endTime);
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

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading/> :
                <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1 border-gray-500 ">
                        <h2 className="text-center text-medium bg-blue-500 text-white rounded-lg p-2 font-bold ">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-2 text-center">
                        {errorMessage && <div className="text-red-500">
                            {errorMessage}
                        </div>}

                        <div className="flex justify-center text-end items-center gap-3 p-2 mt-4">
                            <label className='font-bold'>Name:</label>
                            <input
                                autoFocus
                                className="w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={name}
                                onChange={event => {
                                    clearErrorMessage();
                                    setName(event.target.value);
                                }}/>
                        </div>
                        <div className="flex text-end justify-center items-center gap-3 p-2">
                            <label className='font-bold'>Code:</label>
                            <input
                                type="number"
                                className="w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={code}
                                onChange={event => {
                                    clearErrorMessage();
                                    setCode(event.target.value);
                                }}/>
                        </div>
                        <div className="flex text-end justify-center items-center gap-3 p-2 mt-4">
                            <label className='font-bold'>Start Time:</label>
                            <input
                                type="time"
                                className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={startTime}
                                onChange={event => {
                                    clearErrorMessage();
                                    setStartTime(event.target.value);
                                }}/>
                        </div>
                        <div className="flex text-end justify-center items-center gap-3 p-2">
                            <label className='font-bold'>End Time:</label>
                            <input
                                type="time"
                                className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={endTime}
                                onChange={event => {
                                    clearErrorMessage();
                                    setEndTime(event.target.value);
                                }}/>
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

export default SlotAddAndEditModal;