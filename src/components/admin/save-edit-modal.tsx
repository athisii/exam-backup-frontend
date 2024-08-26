import React, {Dispatch, SetStateAction, useState} from 'react';


const SaveEditModal = ({
                           initialName,
                           initialCode,
                           errorMessage,
                           errorMessageHandler,
                           saveClickHandler,
                           cancelClickHandler
                       }: {
    initialName?: string,
    initialCode?: string,
    errorMessage: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    saveClickHandler: (name: string, code: string) => void,
    cancelClickHandler: () => void
}) => {

    const [name, setName] = useState(initialName ? initialName : "")
    const [code, setCode] = useState(initialCode ? initialCode : "")

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        saveClickHandler(name, code);
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
            <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                <div className="m-3 p-2 text-center">
                    {errorMessage && <div className="text-red-500">
                        {errorMessage}
                    </div>}

                    <div className="flex justify-center items-center gap-3 p-2 mt-4">
                        <label>Name:</label>
                        <input
                            autoFocus
                            className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500"
                            value={name}
                            onChange={event => {
                                clearErrorMessage();
                                setName(event.target.value);
                            }}/>
                    </div>
                    <div className="flex justify-center items-center gap-3 p-2">
                        <label>Code:</label>
                        <input
                            type="number"
                            className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500"
                            value={code}
                            onChange={event => {
                                clearErrorMessage();
                                setCode(event.target.value);
                            }}/>
                    </div>
                    <div className="flex justify-center gap-4 p-2 mt-8 text-white">
                        <button
                            className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md active:bg-green-700`}
                            onClick={handleSaveClick}>
                            Save
                        </button>
                        <button
                            className={`sm:w-[20%] bg-yellow-500 py-2 px-4 rounded-md active:bg-yellow-700`}
                            onClick={handleCancelClick}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaveEditModal;