'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, ISlot} from "@/types/types";
import Slot from "@/components/admin/slot";
import {deleteSlotById, fetchSlotsAsPage, saveSlot} from "@/lib/actions/slot-actions";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/modal/delete-modal";
import {convertToLocalDateTime} from "@/lib/date-util";
import SlotAddAndEditModal from "@/components/modal/slot-add-edit-modal";

const PAGE_SIZE = 8;

const SlotContainer = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedSlot, setSelectedSlot] = useState<ISlot>({code: "", name: ""} as ISlot);
    const [slots, setSlots] = useState<ISlot[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchSlots(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedSlot]);


    const fetchSlots = async (page: number) => {
        const apiResponse: ApiResponse = await fetchSlotsAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching slots.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setSlots(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const isValid = (name: string, code: string, startTime: string, endTime: string): boolean => {
        if (name.trim().length === 0) {
            setErrorMessage("'Name' should not be empty.");
            return false;
        }
        if (code.trim().length === 0 || Number.parseInt(code) <= 0) {
            setErrorMessage("'Code' should be a non-negative number.");
            return false;
        }
        if (startTime.trim().length === 0) {
            setErrorMessage("'Start Time' should not be empty.");
            return false;
        }
        if (endTime.trim().length === 0) {
            setErrorMessage("'End Time' should not be empty.");
            return false;
        }

        if (Number.parseInt(endTime.split(":")[0]) <= Number.parseInt(startTime.split(":")[0])) {
            setErrorMessage("'End Time' should be after 'Start Time'");
            return false;
        }
        return true;
    };

    const editHandlerModalSaveHandler = async (name: string, code: string, startTime: string, endTime: string) => {
        setIsLoading(true);
        if (!isValid(name, code, startTime, endTime)) {
            setIsLoading(false);
            return;
        }
        const updatedSlot: ISlot = {
            ...selectedSlot,
            code,
            name: name.toUpperCase(),
            startTime,
            endTime,
            modifiedDate: convertToLocalDateTime(new Date())
        } as ISlot;

        const apiResponse: ApiResponse = await saveSlot(updatedSlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setSlots(prevState => {
            const filteredSlots = prevState.filter(slot => slot.id != selectedSlot.id);
            const newSlots = [...filteredSlots, updatedSlot]
            newSlots.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newSlots;
        })
        postSuccess("Slot updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedSlot({code: "", name: ""} as ISlot)
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
        const filteredSlots = slots.filter(slot => slot.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchSlots(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setSlots([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setSlots(filteredSlots)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchSlots(pageNumber);
        }
        postSuccess("Slot deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedSlot({code: "", name: ""} as ISlot)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string, startTime: string, endTime: string) => {
        setIsLoading(true);
        if (!isValid(name, code, startTime, endTime)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveSlot({code, name, startTime, endTime} as ISlot);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newSlot: ISlot = {
            code,
            name: name.toUpperCase(),
            startTime,
            endTime,
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as ISlot;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setSlots([...slots, newSlot].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (slots.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setSlots([...slots, newSlot].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchSlots(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Slot created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedSlot({code: "", name: ""} as ISlot)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg py-4">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs w-full text-gray-700 uppercase bg-gray-100">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        Serial Number
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Code
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Start Time
                    </th>
                    <th scope="col" className="px-6 py-4">
                        End Time
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
                    slots.map((slot, index) => {
                        return (
                            <Slot key={slot.id}
                                  slot={slot}
                                  index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                  changeSelectedSlot={setSelectedSlot}
                                  setShowEditModal={setShowEditModal}
                                  setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody>
            </table>
            <div className="flex justify-center p-3 font-bold rounded-lg">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700 `}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedSlot({code: "", name: ""} as ISlot);
                        setShowAddModal(true);
                    }}>
                    Add Slot
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    slots.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchSlots(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <SlotAddAndEditModal key={selectedSlot.code + "1"}
                                                      title="Update Slot"
                                                      isLoading={isLoading}
                                                      initialStartTime={selectedSlot.startTime}
                                                      initialEndTime={selectedSlot.endTime}
                                                      initialName={selectedSlot.name}
                                                      initialCode={selectedSlot.code}
                                                      errorMessage={errorMessage}
                                                      errorMessageHandler={setErrorMessage}
                                                      saveClickHandler={editHandlerModalSaveHandler}
                                                      cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedSlot.code + "1"}
                                                title="Delete Slot"
                                                type="Slot"
                                                isLoading={isLoading}
                                                idToDelete={selectedSlot.id}
                                                name={selectedSlot.name}
                                                code={selectedSlot.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <SlotAddAndEditModal key={selectedSlot.code + "1"}
                                                  title="Add New Slot"
                                                  isLoading={isLoading}
                                                  errorMessage={errorMessage}
                                                  errorMessageHandler={setErrorMessage}
                                                  saveClickHandler={addHandlerModalSaveHandler}
                                                  cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default SlotContainer;