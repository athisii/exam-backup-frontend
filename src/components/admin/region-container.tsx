'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IRegion} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/admin/modal/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";
import AddAndEditModal from "@/components/admin/modal/add-and-edit-modal";
import Region from "@/components/admin/region";
import {deleteRegionById, fetchRegionsAsPage, saveRegion} from "@/app/admin/region/actions";

const PAGE_SIZE = 8;

const RegionContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedRegion, setSelectedRegion] = useState<IRegion>({code: "", name: ""} as IRegion);
    const [regions, setRegions] = useState<IRegion[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchRegions(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedRegion]);


    const fetchRegions = async (page: number) => {
        const apiResponse: ApiResponse = await fetchRegionsAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching regions.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setRegions(() => apiResponsePage.items);
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
            setErrorMessage("'Name' should not be empty.");
            return false;
        }
        if (code.trim().length === 0 || Number.parseInt(code) <= 0) {
            setErrorMessage("'Code' should be a non-negative number.");
            return false;
        }
        return true;
    };

    const editHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const updatedRegion: IRegion = {
            ...selectedRegion,
            code,
            name: name.toUpperCase(),
            modifiedDate: convertToLocalDateTime(new Date())
        } as IRegion;

        const apiResponse: ApiResponse = await saveRegion(updatedRegion);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setRegions(prevState => {
            const filteredRegion = prevState.filter(region => region.id != selectedRegion.id);
            const newRegions = [...filteredRegion, updatedRegion]
            newRegions.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newRegions;
        })
        postSuccess("Region updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedRegion({code: "", name: ""} as IRegion)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteRegionById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredRegions = regions.filter(region => region.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchRegions(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setRegions([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setRegions(filteredRegions)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchRegions(pageNumber);
        }
        postSuccess("Region deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedRegion({code: "", name: ""} as IRegion)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveRegion({code, name} as IRegion);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newRegion: IRegion = {
            code,
            name: name.toUpperCase(),
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as IRegion;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setRegions([...regions, newRegion].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (regions.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setRegions([...regions, newRegion].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchRegions(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Region created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedRegion({code: "", name: ""} as IRegion)
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
                    regions.map((region, index) => {
                        return (
                            <Region key={region.id}
                                    region={region}
                                    index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                    changeSelectedRegion={setSelectedRegion}
                                    setShowEditModal={setShowEditModal}
                                    setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody>
            </table>
            <div className="flex justify-center p-3">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedRegion({code: "", name: ""} as IRegion);
                        setShowAddModal(true);
                    }}>
                    Add Region
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    regions.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchRegions(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <AddAndEditModal key={selectedRegion.code + "1"}
                                                  title="Update Region"
                                                  isLoading={isLoading}
                                                  initialName={selectedRegion.name}
                                                  initialCode={selectedRegion.code}
                                                  errorMessage={errorMessage}
                                                  errorMessageHandler={setErrorMessage}
                                                  saveClickHandler={editHandlerModalSaveHandler}
                                                  cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedRegion.code + "1"}
                                                title="Delete Region"
                                                type="Region"
                                                isLoading={isLoading}
                                                idToDelete={selectedRegion.id}
                                                name={selectedRegion.name}
                                                code={selectedRegion.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <AddAndEditModal key={selectedRegion.code + "1"}
                                              title="Add New Region"
                                              isLoading={isLoading}
                                              errorMessage={errorMessage}
                                              errorMessageHandler={setErrorMessage}
                                              saveClickHandler={addHandlerModalSaveHandler}
                                              cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default RegionContainer;