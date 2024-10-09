import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Loading from "@/components/admin/loading";
import { getFileExtension } from '@/app/admin/file-type/actions';

const AddAndEditModal = ({
    title,
    isLoading,
    errorMessage,
    initialName,
    initialCode,
    initialExtensionId,
    errorMessageHandler,
    saveClickHandler,
    cancelClickHandler
}: {
    title: string,
    isLoading: boolean,
    errorMessage: string,
    initialName?: string,
    initialCode?: string,
    initialExtensionId?: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    saveClickHandler: (name: string, code: string, fileExtensionId: string) => void,
    cancelClickHandler: () => void
}) => {
    const [name, setName] = useState(initialName || "");
    const [code, setCode] = useState(initialCode || "");
    const [fileExtensionId, setFileType] = useState(initialExtensionId || "");
    const [fileExtensions, setFileExtensions] = useState<{ id: string; name: string }[]>([]);
    const [fetchingExtensions, setFetchingExtensions] = useState(true);

    useEffect(() => {
        const fetchFileExtensions = async () => {
            try {
                const response = await getFileExtension();                
                
                if (Array.isArray(response.data)) {
                    setFileExtensions(response.data.map(ext => ({ id: ext.id, name: ext.name })));
                } else {
                    errorMessageHandler("Unexpected response structure: 'data' is not an array");
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    errorMessageHandler(error.message || "Failed to load file extensions");
                } else {
                    errorMessageHandler("An unexpected error occurred");
                }
            } finally {
                setFetchingExtensions(false);
            }
        };
    
        fetchFileExtensions();
    }, [errorMessageHandler]);
    
    

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        saveClickHandler(name, code, fileExtensionId);
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
            {isLoading || fetchingExtensions ? (
                <Loading />
            ) : (
                <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1">
                        <h2 className="text-center text-white font-bold text-gray-900 p-2 rounded-md bg-blue-500">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-2 text-center">
                        {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                        <div className="flex justify-center items-center gap-3 p-2 mt-4">
                            <label className='font-bold'>Name:</label>
                            <input
                                autoFocus
                                className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={name}
                                onChange={event => {
                                    clearErrorMessage();
                                    setName(event.target.value);
                                }}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-3 p-2">
                            <label className='font-bold'>Code:</label>
                            <input
                                type="number"
                                className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={code}
                                onChange={event => {
                                    clearErrorMessage();
                                    setCode(event.target.value);
                                }}
                            />
                        </div>
                        <div className="flex justify-center items-center gap-3 p-2">
                            <label className='font-bold'>File Type:</label>
                            <select
                                className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                value={fileExtensionId}
                                onChange={event => {
                                    clearErrorMessage();
                                    setFileType(event.target.value);
                                }}
                            >
                                <option value="" disabled>Select a file type</option>
                                {fileExtensions.map(extension => (
                                    <option key={extension.id} value={extension.id}>
                                        {extension.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-center gap-4 p-2 mt-8 text-white font-bold">
                            <button
                                className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md`}
                                onClick={handleSaveClick}
                            >
                                Save
                            </button>
                            <button
                                className={`sm:w-[20%] bg-red-500 py-2 px-4 rounded-md`}
                                onClick={handleCancelClick}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddAndEditModal;




