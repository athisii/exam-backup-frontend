'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IExamDate} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import {convertToLocalDateTime} from "@/utils/date-util";
import {deleteExamDateById, fetchExamDatesAsPage, saveExamDate} from "@/app/admin/exam-date/actions";
import ExamDateAddAndEditModal from "@/components/admin/modal/exam-date-add-and-edit-modal";
import ExamDate from "@/components/admin/exam-date";
import ExamDateDeleteModal from "@/components/admin/modal/exam-date-delete-modal";

const PAGE_SIZE = 8;

const ExamDateContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedExamDate, setSelectedExamDate] = useState<IExamDate>({date: ""} as IExamDate);
    const [examDates, setExamDates] = useState<IExamDate[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchExamDates(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedExamDate]);


    const fetchExamDates = async (page: number) => {
        const apiResponse: ApiResponse = await fetchExamDatesAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam dates.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamDates(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const isValid = (date: string): boolean => {
        if (date.trim().length === 0) {
            setErrorMessage("'Date' should not be empty.");
            return false;
        }
        const today = new Date();
        if (today.getTime() > new Date(date).getTime()) {
            setErrorMessage("'Date' should not be later than today.");
            return false;
        }
        return true;
    };

    const editHandlerModalSaveHandler = async (date: string) => {
        setIsLoading(true);
        if (!isValid(date)) {
            setIsLoading(false);
            return;
        }
        const updatedExamDate: IExamDate = {
            ...selectedExamDate,
            date: date,
            modifiedDate: convertToLocalDateTime(new Date())
        } as IExamDate;

        const apiResponse: ApiResponse = await saveExamDate(updatedExamDate);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setExamDates(prevState => {
            const filteredExamDate = prevState.filter(examDate => examDate.id != selectedExamDate.id);
            const newExamDates = [...filteredExamDate, updatedExamDate]
            newExamDates.sort((a, b) => a.date.localeCompare(b.date));
            return newExamDates;
        })
        postSuccess("Exam Date updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedExamDate({date: ""} as IExamDate)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteExamDateById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredExamDates = examDates.filter(examDate => examDate.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchExamDates(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setExamDates([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setExamDates(filteredExamDates)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchExamDates(pageNumber);
        }
        postSuccess("Exam Date deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedExamDate({date: ""} as IExamDate)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (date: string) => {
        setIsLoading(true);
        if (!isValid(date)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveExamDate({date} as IExamDate);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const dateObj = new Date();
        const newExamDate: IExamDate = {
            date: date,
            createdDate: convertToLocalDateTime(dateObj),
            modifiedDate: convertToLocalDateTime(dateObj),
            id: apiResponse.data.id
        } as IExamDate;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setExamDates([...examDates, newExamDate].sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (examDates.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setExamDates([...examDates, newExamDate].sort((a, b) => Number.parseInt(a.date) - Number.parseInt(b.date)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchExamDates(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Exam Date created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedExamDate({date: ""} as IExamDate)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs w-full text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        Serial Number
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Created Date
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Modified Date
                    </th>
                    <th scope="col" className="px-9 py-4">
                        Edit
                    </th>
                    <th scope="col" className="px-9 py-4">
                        Delete
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    examDates.map((examDate, index) => {
                        return (
                            <ExamDate key={examDate.id}
                                      examDate={examDate}
                                      index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                      changeSelectedExamDate={setSelectedExamDate}
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
                        setSelectedExamDate({date: ""} as IExamDate);
                        setShowAddModal(true);
                    }}>
                    Add Exam Date
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    examDates.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchExamDates(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <ExamDateAddAndEditModal key={selectedExamDate.date + "1"}
                                                          title="Update Exam Date"
                                                          isLoading={isLoading}
                                                          initialDate={selectedExamDate.date}
                                                          errorMessage={errorMessage}
                                                          errorMessageHandler={setErrorMessage}
                                                          saveClickHandler={editHandlerModalSaveHandler}
                                                          cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <ExamDateDeleteModal key={selectedExamDate.date + "1"}
                                                        title="Delete Exam Date"
                                                        type="Exam Date"
                                                        isLoading={isLoading}
                                                        idToDelete={selectedExamDate.id}
                                                        date={selectedExamDate.date}
                                                        errorMessage={errorMessage}
                                                        errorMessageHandler={setErrorMessage}
                                                        deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                        cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <ExamDateAddAndEditModal key={selectedExamDate.date + "1"}
                                                      title="Add New Exam Date"
                                                      isLoading={isLoading}
                                                      errorMessage={errorMessage}
                                                      errorMessageHandler={setErrorMessage}
                                                      saveClickHandler={addHandlerModalSaveHandler}
                                                      cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default ExamDateContainer;