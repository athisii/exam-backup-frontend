import React, {Dispatch, SetStateAction, useState} from 'react';
import Loading from "@/components/loading";


const AddAndEditModal = ({
                             title,
                             type,
                             isLoading,
                             errorMessage,
                             idToDelete,
                             initialName,
                             initialCode,
                             errorMessageHandler,
                             deleteClickHandler,
                             cancelClickHandler
                         }: {
    title: string,
    type: string,
    isLoading: boolean,
    errorMessage: string,
    idToDelete: number,
    initialName?: string,
    initialCode?: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    deleteClickHandler: (id: number) => void,
    cancelClickHandler: () => void
}) => {
    const [id, setId] = useState(idToDelete)
    const [name, setName] = useState(initialName ? initialName : "")
    const [code, setCode] = useState(initialCode ? initialCode : "")

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        // async function
        deleteClickHandler(id);
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
                    <div className="border-b-1 border-gray-500">
                        <h2 className="text-center text-medium text-gray-900 p-2">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-2 text-center">
                        {errorMessage ?
                            <div className="text-red-500">
                                {errorMessage}
                            </div> :
                            <div className="flex flex-col justify-center items-center gap-3 p-2 mt-4">
                                <label>Are you sure to delete <b>{type}</b>?</label>
                                <p>Name: {initialName}</p>
                                <p>Code: {initialCode}</p>
                            </div>}
                        <div className="flex justify-center gap-4 p-2 mt-8 text-white">
                            <button
                                className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md disabled:active:bg-green-500 active:bg-green-700`}
                                onClick={handleSaveClick}>
                                Delete
                            </button>
                            <button
                                className={`sm:w-[20%] bg-yellow-500 py-2 px-4 rounded-md disabled:active:bg-yellow-500`}
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

export default AddAndEditModal;