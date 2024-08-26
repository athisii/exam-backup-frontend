'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponsePage, IExamSlot} from "@/types/types";
import ExamSlot from "@/components/admin/exam-slot";
import {fetchExamSlotsByPage, saveExamSlot} from "@/app/admin/exam-slot/actions";
import {Pagination} from "@nextui-org/pagination";
import Modal from "@/components/admin/modal";
import SaveEditModal from "@/components/admin/save-edit-modal";

const PAGE_SIZE = 8;
type ActionType = "ADD" | "EDIT";

const ExamSlotContainer = () => {
    //TODO; on save, delete success, show bottom notification
    // on failure, stay on the modal

    const [errorMessage, setErrorMessage] = useState("")

    const [selectedExamSlot, setSelectedExamSlot] = useState<IExamSlot>({code: "", name: ""} as IExamSlot);
    const [examSlots, setExamSlots] = useState<IExamSlot[]>([]);
    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchExamSlots(0);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedExamSlot]);


    const fetchExamSlots = async (page: number) => {
        const apiResponse = await fetchExamSlotsByPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam slots.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamSlots(apiResponsePage.items);
        setTotalPages(apiResponsePage.totalPages);
    }

    const asyncSaveExamSlot = async (examSlot: IExamSlot, actionType: ActionType) => {
        const apiResponse = await saveExamSlot(examSlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            return
        }
        setPageNumber(0);
        fetchExamSlots(0); // re-fetch from the server
        if (actionType == "ADD") {
            setShowAddModal(false);
        } else {
            setShowEditModal(false);
        }
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const editHandlerModalSaveHandler = (name: string, code: string) => {
        if (name.trim().length === 0) {
            setErrorMessage("Name should not be empty.");
            return;
        }
        if (Number.parseInt(code) <= 0) {
            setErrorMessage("Code should be a non-negative number.");
            return;
        }
        clearErrorMessage();
        asyncSaveExamSlot({...selectedExamSlot, code, name} as IExamSlot, "EDIT");
    }

    const editHandlerModalCancelHandler = () => {
        clearErrorMessage();
        setSelectedExamSlot({code: "", name: ""} as IExamSlot)
        setShowEditModal(false);
    }

    const addHandlerModalSaveHandler = (name: string, code: string) => {
        if (name.trim().length === 0) {
            setErrorMessage("Name should not be empty.");
            return;
        }
        if (Number.parseInt(code) <= 0) {
            setErrorMessage("Code should be a non-negative number.");
            return;
        }
        clearErrorMessage();
        asyncSaveExamSlot({code, name,} as IExamSlot, "ADD");
    }

    const addHandlerModalCancelHandler = () => {
        clearErrorMessage();
        setSelectedExamSlot({code: "", name: ""} as IExamSlot)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        SN
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Code
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Created Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Modified Date
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    examSlots.map((examSlot, index) => {
                        return (
                            <ExamSlot key={examSlot.id}
                                      examSlot={examSlot}
                                      index={pageNumber * PAGE_SIZE + index + 1}
                                      changeSelectedExamSlot={setSelectedExamSlot}
                                      setShowEditModal={setShowEditModal}
                                      setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody>
            </table>
            <div className="flex justify-end p-3">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedExamSlot({code: "", name: ""} as IExamSlot);
                        setShowAddModal(true);
                    }}>
                    Add Exam Slot
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    examSlots.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(page - 1);
                            fetchExamSlots(page - 1);
                        }}/>
                }
            </div>

            {
                showEditModal && <SaveEditModal key={selectedExamSlot.code + "1"}
                                                initialName={selectedExamSlot.name}
                                                initialCode={selectedExamSlot.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                saveClickHandler={editHandlerModalSaveHandler}
                                                cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {showDeleteModal && <Modal>
                <div>
                    Delete Exam Slot
                    <p>Name: {selectedExamSlot.name}</p>
                    <p>Code: {selectedExamSlot.code}</p>
                </div>
            </Modal>
            }
            {showAddModal && <SaveEditModal key={selectedExamSlot.code + "1"}
                                            errorMessage={errorMessage}
                                            errorMessageHandler={setErrorMessage}
                                            saveClickHandler={addHandlerModalSaveHandler}
                                            cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default ExamSlotContainer;