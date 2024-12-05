import React, {Dispatch, SetStateAction} from 'react';
import Loading from "@/components/loading";


const BulkUploadModal = ({
                             title,
                             isLoading,
                             errorMessage,
                             errorMessageHandler,
                             uploadClickHandler,
                             cancelClickHandler
                         }: {
    title: string,
    isLoading: boolean,
    errorMessage: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    uploadClickHandler: (formData: FormData) => void,
    cancelClickHandler: () => void
}) => {

    const handleSubmit = async (formData: FormData) => {
        errorMessageHandler("");
        const file: File = formData.get("file") as File;
        if (!file.name || file.size <= 0) {
            errorMessageHandler("Please select a valid and non-empty CSV file.");
            return;
        }
        uploadClickHandler(formData);
    };

    const handleCancel = (event: React.MouseEvent<HTMLButtonElement>) => {
        errorMessageHandler("");
        event.preventDefault();
        cancelClickHandler();
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading/> :
                <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1">
                        <h2 className="text-center text-medium text-white p-2 font-bold bg-blue-500 rounded-md">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-2 text-center">
                        <div className="text-red-500">
                            {errorMessage}
                        </div>
                        <div className="flex flex-col justify-center items-center gap-3 p-2 mt-4">
                            <form action={handleSubmit} className="flex gap-8 flex-col justify-center items-center">
                                <div>
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".csv"
                                        onChange={event => errorMessageHandler("")}
                                        className="w-full cursor-pointer rounded bg-gray-300 text-gray-500 file:mr-4 file:cursor-pointer file:border-0 file:bg-blue-500 file:py-1 file:text-white file:hover:bg-gray-700"/>
                                </div>
                                <div className="flex justify-center gap-8 text-white">
                                    <button type="submit"
                                            className={`bg-green-500 py-2 px-4 rounded-md disabled:active:bg-green-500 active:bg-green-700 font-bold`}>
                                        Upload
                                    </button>
                                    <button
                                        className={`bg-red-500 py-2 px-4 rounded-md disabled:active:bg-red-500 font-bold`}
                                        onClick={event => handleCancel(event)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default BulkUploadModal;
