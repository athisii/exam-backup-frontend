import React, {Dispatch, SetStateAction, useRef, useState} from 'react';
import Loading from "@/components/admin/loading";
import {IFileExtension, IFileType} from "@/types/types";

const FileTypeAddAndEditModal = ({
                                     title,
                                     isLoading,
                                     fileType,
                                     fileExtensions,
                                     errorMessage,
                                     errorMessageHandler,
                                     saveClickHandler,
                                     cancelClickHandler
                                 }: {
    title: string,
    isLoading: boolean,
    fileType: IFileType,
    fileExtensions: IFileExtension[]
    errorMessage: string,
    initialExtensionId?: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    saveClickHandler: (name: string, code: string, fileExtensionId: number) => void,
    cancelClickHandler: () => void,
}) => {
    const [name, setName] = useState(fileType.name);
    const [code, setCode] = useState(fileType.code);
    const selectEleRef = useRef<HTMLSelectElement | null>(null);

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        const fileExtension = fileExtensions.find(fileExtension => fileExtension.id === Number.parseInt(selectEleRef.current?.value as string));
        saveClickHandler(name, code, fileExtension?.id as number);
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
            {isLoading ? (<Loading/>)
                :
                (<div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                        <div className="border-b-1">
                            <h2 className="text-center text-white font-bold p-2 rounded-md bg-blue-500">
                                {title}
                            </h2>
                        </div>
                        <div className="m-3 p-2 text-center">
                            {errorMessage && <div className="text-red-500">{errorMessage}</div>}

                            <div className="flex justify-center items-center gap-3 p-2 mt-4">
                                <label className='font-bold'>Name:</label>
                                <input
                                    autoFocus
                                    className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:border-none focus:outline-none focus:ring-green-500 hover:border-black border"
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
                                    className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:border-none focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={code}
                                    onChange={event => {
                                        clearErrorMessage();
                                        setCode(event.target.value);
                                    }}
                                />
                            </div>
                            <div className="flex justify-center items-center gap-3 p-2">
                                <label className='font-bold'>Select File Type:</label>
                                <select
                                    ref={selectEleRef}
                                    defaultValue={fileType.fileExtensionId}
                                    className="sm:w-[50%] p-2 rounded bg-gray-50 focus:ring-2 focus:border-none focus:outline-none focus:ring-green-500 hover:border-black border">
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

export default FileTypeAddAndEditModal;




