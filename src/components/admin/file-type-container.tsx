'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IFileExtension, IFileType} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/admin/modal/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";
import FileTypeAddAndEditModal from "@/components/admin/modal/file-type-add-edit";
import FileType from "@/components/admin/file-type";
import {deleteFileTypeById, fetchFileTypesAsPage, saveFileType} from "@/app/admin/file-type/actions";

const PAGE_SIZE = 8;

interface FileTypeContainerProps {
    fileExtensions: IFileExtension[]
}

const FileTypeContainer = ({fileExtensions}: FileTypeContainerProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedFileType, setSelectedFileType] = useState<IFileType>({
        code: "",
        name: "",
        fileExtensionId: 0
    } as IFileType);
    const [fileTypes, setFileTypes] = useState<IFileType[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchFileTypes(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedFileType]);


    const fetchFileTypes = async (page: number) => {
        const apiResponse: ApiResponse = await fetchFileTypesAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching file types.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setFileTypes(() => apiResponsePage.items);
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

    const editHandlerModalSaveHandler = async (name: string, code: string, fileExtensionId: number) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const updatedFileType: IFileType = {
            ...selectedFileType,
            code,
            name: name.toUpperCase(),
            fileExtensionId,
            modifiedDate: convertToLocalDateTime(new Date())
        } as IFileType;

        const apiResponse: ApiResponse = await saveFileType(updatedFileType);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setFileTypes(prevState => {
            const filteredFileType = prevState.filter(fileType => fileType.id != selectedFileType.id);
            const newFileTypes = [...filteredFileType, updatedFileType]
            newFileTypes.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newFileTypes;
        })
        postSuccess("File Type updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedFileType({code: "", name: "", fileExtensionId: 0} as IFileType)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteFileTypeById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredFileTypes = fileTypes.filter(fileType => fileType.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchFileTypes(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setFileTypes([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setFileTypes(filteredFileTypes)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchFileTypes(pageNumber);
        }
        postSuccess("File Type deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedFileType({code: "", name: "", fileExtensionId: 0} as IFileType)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string, fileExtensionId: number) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveFileType({code, name, fileExtensionId} as IFileType);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newFileType: IFileType = {
            code,
            name: name.toUpperCase(),
            fileExtensionId,
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as IFileType;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setFileTypes([...fileTypes, newFileType].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (fileTypes.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setFileTypes([...fileTypes, newFileType].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchFileTypes(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("File Type created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedFileType({code: "", name: "", fileExtensionId: 0} as IFileType)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500 ">
                <thead className="text-xs w-full text-black uppercase bg-gray-100 ">
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
                    fileTypes.map((fileType, index) => {
                        return (
                            <FileType key={fileType.id}
                                      fileType={fileType}
                                      index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                      changeSelectedFileType={setSelectedFileType}
                                      setShowEditModal={setShowEditModal}
                                      setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody>
            </table>
            <div className="flex justify-center p-3 font-bold">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedFileType({code: "", name: "", fileExtensionId: 0} as IFileType);
                        setShowAddModal(true);
                    }}>
                    Add File Type
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    fileTypes.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchFileTypes(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <FileTypeAddAndEditModal key={selectedFileType.code + "1"}
                                                          title="Update File Type"
                                                          isLoading={isLoading}
                                                          fileType={selectedFileType}
                                                          fileExtensions={fileExtensions}
                                                          errorMessage={errorMessage}
                                                          errorMessageHandler={setErrorMessage}
                                                          saveClickHandler={editHandlerModalSaveHandler}
                                                          cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedFileType.code + "1"}
                                                title="Delete File Type"
                                                type="File Type"
                                                isLoading={isLoading}
                                                idToDelete={selectedFileType.id}
                                                name={selectedFileType.name}
                                                code={selectedFileType.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <FileTypeAddAndEditModal key={selectedFileType.code + "1"}
                                                      title="Add New File Type"
                                                      isLoading={isLoading}
                                                      fileType={selectedFileType}
                                                      fileExtensions={fileExtensions}
                                                      errorMessage={errorMessage}
                                                      errorMessageHandler={setErrorMessage}
                                                      saveClickHandler={addHandlerModalSaveHandler}
                                                      cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default FileTypeContainer;