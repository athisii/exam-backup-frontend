import React, {Dispatch, SetStateAction} from 'react';

const DeleteModal = ({showModal, setShowModal, message}: {
    showModal: boolean,
    setShowModal: Dispatch<SetStateAction<boolean>>,
    message: string
}) => {
    if (!showModal) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[40vw] flex flex-col">
                <button className="text-white text-xl px-1 place-self-end bg-red-500 rounded hover:bg-red-800"
                        onClick={() => setShowModal(false)}>
                    X
                </button>
                <div className="bg-white p-2 rounded text-center">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;