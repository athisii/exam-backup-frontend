'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IExamSlot} from "@/types/types";
import ExamSlot from "@/components/admin/exam-slot";
import {fetchExamSlotsByPage, saveExamSlot} from "@/app/admin/exam-slot/actions";
import {Pagination} from "@nextui-org/pagination";
import Modal from "@/components/admin/modal";
import AddAndEditModal from "@/components/add-and-edit-modal";
import {toast, Toaster} from "sonner";

const PAGE_SIZE = 8;

const ExamSlotContainer = () => {

    const [isLoading, setIsLoading] = useState(false);
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

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const editHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        clearErrorMessage();
        const apiResponse: ApiResponse = await saveExamSlot({...selectedExamSlot, code, name} as IExamSlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        postSuccess("Exam slot updated successfully.")
        setShowEditModal(false);
    };

    const editHandlerModalCancelHandler = () => {
        clearErrorMessage();
        setSelectedExamSlot({code: "", name: ""} as IExamSlot)
        setShowEditModal(false);
    }

    const isValid = (name: string, code: string): boolean => {
        if (name.trim().length === 0) {
            setErrorMessage("Name should not be empty.");
            return false;
        }
        if (code.trim().length === 0 || Number.parseInt(code) <= 0) {
            setErrorMessage("Code should be a non-negative number.");
            return false;
        }
        return true;
    }

    const addHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        clearErrorMessage();
        const apiResponse: ApiResponse = await saveExamSlot({code, name,} as IExamSlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        postSuccess("Exam slot created successfully.")
        setShowAddModal(false);
    };

    const postSuccess = (message: string) => {
        setPageNumber(0);
        fetchExamSlots(0); // re-fetch from the server, avoid pagination issue
        setIsLoading(false);
        toast.success(message);
    }

    const addHandlerModalCancelHandler = () => {
        clearErrorMessage();
        setSelectedExamSlot({code: "", name: ""} as IExamSlot)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg">
            <Toaster position="top-right" richColors duration={3000}/>
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
                showEditModal && <AddAndEditModal key={selectedExamSlot.code + "1"}
                                                  title="Update Exam Slot"
                                                  isLoading={isLoading}
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
            {showAddModal && <AddAndEditModal key={selectedExamSlot.code + "1"}
                                              title="Add New Exam Slot"
                                              isLoading={isLoading}
                                              errorMessage={errorMessage}
                                              errorMessageHandler={setErrorMessage}
                                              saveClickHandler={addHandlerModalSaveHandler}
                                              cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default ExamSlotContainer;