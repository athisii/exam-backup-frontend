'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, ISlot} from "@/types/types";
import ExamSlot from "@/components/admin/exam-slot";
import {deleteSlotById, fetchSlotsAsPage, saveSlot} from "@/app/admin/slot/actions";
import {Pagination} from "@nextui-org/pagination";
import AddAndEditModal from "@/components/add-and-edit-modal";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";

const PAGE_SIZE = 8;

const ExamSlotContainer = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedExamSlot, setSelectedExamSlot] = useState<ISlot>({code: "", name: ""} as ISlot);
    const [examSlots, setExamSlots] = useState<ISlot[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchExamSlots(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedExamSlot]);


    const fetchExamSlots = async (page: number) => {
        const apiResponse = await fetchSlotsAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam slots.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamSlots(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

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

    const editHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const updatedExamSlot: ISlot = {
            ...selectedExamSlot,
            code,
            name,
            modifiedDate: convertToLocalDateTime(new Date())
        } as ISlot;

        const apiResponse: ApiResponse = await saveSlot(updatedExamSlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setExamSlots(prevState => {
            const filteredExamSlots = prevState.filter(examSlot => examSlot.id != selectedExamSlot.id);
            const newExamSlots = [...filteredExamSlots, updatedExamSlot]
            newExamSlots.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newExamSlots;
        })
        postSuccess("Exam slot updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedExamSlot({code: "", name: ""} as ISlot)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteSlotById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredExamSlots = examSlots.filter(examSlot => examSlot.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchExamSlots(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setExamSlots([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setExamSlots(filteredExamSlots)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchExamSlots(pageNumber);
        }
        postSuccess("Exam Slot deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedExamSlot({code: "", name: ""} as ISlot)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveSlot({code, name} as ISlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newExamSlot: ISlot = {
            code,
            name,
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as ISlot;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setExamSlots([...examSlots, newExamSlot].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (examSlots.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setExamSlots([...examSlots, newExamSlot].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchExamSlots(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Exam slot created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedExamSlot({code: "", name: ""} as ISlot)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs w-full text-gray-700 uppercase bg-gray-100">
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
                    <th scope="col" className="px-6 py-4">
                        Edit
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Delete
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    examSlots.map((examSlot, index) => {
                        return (
                            <ExamSlot key={examSlot.id}
                                      examSlot={examSlot}
                                      index={(pageNumber - 1) * PAGE_SIZE + index + 1}
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
                        setSelectedExamSlot({code: "", name: ""} as ISlot);
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
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchExamSlots(page);
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

            {
                showDeleteModal && <DeleteModal key={selectedExamSlot.code + "1"}
                                                title="Delete Exam Slot"
                                                type="Exam Slot"
                                                isLoading={isLoading}
                                                idToDelete={selectedExamSlot.id}
                                                initialName={selectedExamSlot.name}
                                                initialCode={selectedExamSlot.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
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