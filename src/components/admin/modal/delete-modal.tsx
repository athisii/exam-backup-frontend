import React, {Dispatch, SetStateAction} from 'react';
import Loading from "@/components/admin/loading";


const AddAndEditModal = ({
                             title,
                             type,
                             isLoading,
                             errorMessage,
                             idToDelete,
                             name,
                             code,
                             errorMessageHandler,
                             deleteClickHandler,
                             cancelClickHandler
                         }: {
    title: string,
    type: string,
    isLoading: boolean,
    errorMessage: string,
    idToDelete: number,
    name: string,
    code: string,
    errorMessageHandler: Dispatch<SetStateAction<string>>,
    deleteClickHandler: (id: number) => void,
    cancelClickHandler: () => void
}) => {

    const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        clearErrorMessage();
        // async function
        deleteClickHandler(idToDelete);
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
                        <h2 className="text-center text-medium text-white p-2 font-bold bg-blue-500 rounded-lg">
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
                                <p>Name: {<b>{name}</b>}</p>
                                <p>Code: {<b>{code}</b>}</p>
                            </div>}
                        <div className="flex justify-center gap-4 p-2 mt-8 text-white">
                            <button
                                className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md disabled:active:bg-green-500 active:bg-green-700 font-bold`}
                                onClick={handleSaveClick}>
                                Delete
                            </button>
                            <button
                                className={`sm:w-[20%] bg-red-500 py-2 px-4 rounded-md disabled:active:bg-red-500 font-bold`}
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