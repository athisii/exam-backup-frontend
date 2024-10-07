'use client'

import React, {ChangeEvent, useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IExamCentre, IExamDateSlot, IRegionExamDateSlotArray} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/admin/modal/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";
import Swal from 'sweetalert2';

import {
    deleteExamCentreById,
    fetchExamCentresAsPage,
    saveExamCentre,
    searchExamCentres
} from "@/app/admin/exam-centre/actions";
import ExamCentre from "@/components/admin/exam-centre";
import useDebounce from "@/hooks/useDebounce";
import ExamCentreAddAndEditModal from "@/components/admin/modal/exam-centre-add-and-edit-modal";
import BulkUploadModal from "@/components/admin/modal/bulk-upload-modal"; 
import {uploadExamCentre} from "@/app/admin/exam-mapping/actions";




const PAGE_SIZE = 6;

const ExamCentreContainer = ({regionExamDateSlotArray}: { regionExamDateSlotArray: IRegionExamDateSlotArray }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebounce(searchTerm);


    const [selectedExamCentre, setSelectedExamCentre] = useState<IExamCentre>({code: "", name: ""} as IExamCentre);
    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchExamCentres(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedExamCentre]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            searchExamCentresAsync(1);
            setPageNumber(1);
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setSearchTerm(value);
        // empty searchTerm
        if (!value) {
            fetchExamCentres(1);
            setPageNumber(1);
        }
    };

    const searchExamCentresAsync = async (page: number) => {
        const apiResponse: ApiResponse = await searchExamCentres(debouncedSearchTerm, page, PAGE_SIZE);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam centres.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamCentres(apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const fetchExamCentres = async (page: number) => {
        const apiResponse: ApiResponse = await fetchExamCentresAsPage(page, PAGE_SIZE);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam centres.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamCentres(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const isValid = (name: string, code: string, regionName: string): boolean => {
        if (name.trim().length === 0) {
            setErrorMessage("'Name' should not be empty.");
            return false;
        }
        if (regionName.trim().length === 0) {
            setErrorMessage("'Region' should not be empty.");
            return false;
        }
        if (code.trim().length === 0 || Number.parseInt(code) <= 0) {
            setErrorMessage("'Code' should be a non-negative number.");
            return false;
        }
        console.log("Need to add more fields")
        return true;
    };

    const bulkUploadHandler = async (bulkData: File) => {
        setIsLoading(true);
        const createdCenters: string[] = []; 
        const uploadErrors: string[] = [];   
    
        try {
            const fileContent = await readFileContent(bulkData);
            const { results: parsedData, errors } = parseCSV(fileContent);    
       
            if (errors.length > 0) {
                await Swal.fire({
                    icon: 'error',
                    title: 'CSV Parsing Errors',
                    html: errors.join('<br>'),
                    confirmButtonText: 'OK',
                });
                return;
            }
    
            if (!parsedData || parsedData.length === 0) {
                await Swal.fire({
                    icon: 'error',
                    text: 'No valid data found in the uploaded file.',
                    confirmButtonText: 'OK',
                });
                return;
            }
               
            for (const item of parsedData) {
                const apiResponse: ApiResponse = await uploadExamCentre(item);
                if (apiResponse.status) {
                    createdCenters.push(item.code); // Push successful upload center code
                } else {
                    uploadErrors.push(`Error uploading ${item.code}: ${apiResponse.message}`);
                }
            }    
       
            if (createdCenters.length > 0) {
                await Swal.fire({
                    icon: 'success',
                    text: `Bulk upload successful. Created centers: ${createdCenters.join(', ')}`,
                    confirmButtonText: 'OK',
                });
            }
    
            if (uploadErrors.length > 0) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Upload Errors',
                    html: uploadErrors.join('<br>'),
                    confirmButtonText: 'OK',
                });
            }  
            fetchExamCentres(pageNumber);
            setShowBulkModal(false);
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                text: 'An error occurred during the bulk upload.',
                confirmButtonText: 'OK',
            });
        } finally {
            setIsLoading(false);
        }
    };
      
       

    const readFileContent = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    resolve(event.target.result as string);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    };
       
    
    const parseCSV = (csvContent: string) => {
        const results: any[] = [];
        const errors: string[] = []; 
        const rows = csvContent.split('\n'); 
        const headers = rows[0].split(',').map(header => header.trim().toLowerCase()); 
    
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',').map(field => field.trim());
    
            if (row.length === headers.length) {
                const rowData: any = {};
                let isValid = true;
                let missingFields: string[] = []; 
    
                headers.forEach((header, index) => {
                    rowData[header] = row[index];
                    
                    // Check if any field is empty
                    if (!row[index]) {
                        missingFields.push(header); 
                        isValid = false;
                    }
                });
    
                if (!isValid) {
                    errors.push(`Error: Missing ${missingFields.join(', ')} for center code: ${rowData['center_code']}`);
                }
    
                if (isValid) {
                    results.push({
                        code: rowData['center_code'], 
                        name: rowData['name'],
                        regionName: rowData['region'],
                        mobileNumber: rowData['mobile'],
                        email: rowData['email'],
                    });
                }
            } else {               
                null;
            }
        }
    
        if (errors.length > 0) {
            console.error("CSV Parsing Errors:", errors);
            return { results, errors }; 
        }
    
        return { results, errors: [] }; 
    };
    
    

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    // const editHandlerModalSaveHandler = async (name: string, code: string, regionName: string, mobileNumber: string, email: string, examDateSlots: IExamDateSlot[]) => {
    //     setIsLoading(true);
    //     if (!isValid(name, code, regionName)) {
    //         setIsLoading(false);
    //         return;
    //     }
    //     const updatedExamCentre: IExamCentre = {
    //         ...selectedExamCentre,
    //         code,
    //         name,
    //         regionName,
    //         mobileNumber,
    //         email,
    //         examDateSlots,
    //         modifiedDate: convertToLocalDateTime(new Date())
    //     } as IExamCentre;

    //     const apiResponse: ApiResponse = await saveExamCentre(updatedExamCentre);
    //     if (!apiResponse.status) {
    //         setErrorMessage(apiResponse.message)
    //         setIsLoading(false);
    //         return
    //     }
    //     setExamCentres(prevState => {
    //         const filteredExamCentres = prevState.filter(examCentre => examCentre.id != selectedExamCentre.id);
    //         const newExamCentres = [...filteredExamCentres, updatedExamCentre]
    //         newExamCentres.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
    //         return newExamCentres;
    //     })
    //     postSuccess("Exam Centre updated successfully.")
    //     setShowEditModal(false);
    // };

    const editHandlerModalSaveHandler = async (name: string, code: string, regionName: string, mobileNumber: string, email: string, examDateSlots: IExamDateSlot[]) => {
        setIsLoading(true);
    
        // Update examDateSlots with proper 'deleted' status
        const updatedExamDateSlots = examDateSlots.map(slot => ({
            ...slot,
            // If no slotIds, set deleted to true, otherwise set it to false
            deleted: slot.slotIds.length === 0 ? true : false
        }));
    
        console.log("Updated Exam Date Slots with deleted status:", updatedExamDateSlots); // Debugging purposes
    
        if (!isValid(name, code, regionName)) {
            setIsLoading(false);
            return;
        }
    
        const updatedExamCentre: IExamCentre = {
            ...selectedExamCentre,
            code,
            name,
            regionName,
            mobileNumber,
            email,
            examDateSlots: updatedExamDateSlots,  // Use updated exam slots
            modifiedDate: convertToLocalDateTime(new Date())
        } as IExamCentre;
    
        const apiResponse: ApiResponse = await saveExamCentre(updatedExamCentre);
        console.log("API Response:", apiResponse); // Debugging purposes
    
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message);
            setIsLoading(false);
            return;
        }
    
        setExamCentres(prevState => {
            const filteredExamCentres = prevState.filter(examCentre => examCentre.id !== selectedExamCentre.id);
            const newExamCentres = [...filteredExamCentres, updatedExamCentre];
            newExamCentres.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code));
            return newExamCentres;
        });
    
        postSuccess("Exam Centre updated successfully.");
        setShowEditModal(false);
    };
    
    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedExamCentre({code: "", name: ""} as IExamCentre)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteExamCentreById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredExamCentres = examCentres.filter(examCentre => examCentre.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchExamCentres(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setExamCentres([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setExamCentres(filteredExamCentres)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchExamCentres(pageNumber);
        }
        postSuccess("Exam Centre deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedExamCentre({code: "", name: ""} as IExamCentre)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string, regionName: string, mobileNumber: string, email: string, examDateSlots: IExamDateSlot[]) => {
        setIsLoading(true);
        if (!isValid(name, code, regionName)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveExamCentre({
            code,
            name,
            regionName,
            mobileNumber,
            email,
            examDateSlots
        } as IExamCentre);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newExamCentre: IExamCentre = {
            code,
            name,
            regionName,
            mobileNumber,
            email,
            examDateSlots,
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as IExamCentre;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setExamCentres([...examCentres, newExamCentre].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (examCentres.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setExamCentres([...examCentres, newExamCentre].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchExamCentres(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Exam Centre created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedExamCentre({code: "", name: ""} as IExamCentre)
        setShowAddModal(false);
    }

    return (
        <div className="grid justify-center items-center">
            <Toaster position="top-right" richColors duration={3000}/>
            <div className="mb-1 relative flex justify-between items-center px-0">
                <div
                    className="absolute inset-y-3 left-0 flex items-cmobilenter ps-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor"
                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </div>
                <input type="text" id="search"
                       className="flex-grow p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-3 focus:outline-none focus:ring-primary-300"
                       placeholder="Search by exam centre code or name"
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
            </div>
            <div className="shadow-md">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs w-full text-black uppercase bg-gray-100">
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
                        examCentres.map((fileType, index) => {
                            return (
                                <ExamCentre key={fileType.id}
                                            examCentre={fileType}
                                            index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                            changeSelectedExamCentre={setSelectedExamCentre}
                                            setShowEditModal={setShowEditModal}
                                            setShowDeleteModal={setShowDeleteModal}
                                />
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center p-3 font-bold gap-4">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedExamCentre({code: "", name: ""} as IExamCentre);
                        setShowAddModal(true);
                    }}>
                    Add Exam Centre
                </button>
                <button
                    onClick={() => setShowBulkModal(true)} // Open bulk modal
                    className="p-2 ml-4 bg-blue-500 text-white rounded"
                >
                    Bulk Upload
                </button>                
            </div>
            <div className="flex justify-center p-1">
                {
                    examCentres.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            if (searchTerm) {
                                searchExamCentresAsync(page)
                            } else {
                                fetchExamCentres(page);
                            }
                        }}/>
                }
            </div>
            {
                showEditModal && <ExamCentreAddAndEditModal key={selectedExamCentre.code + "1"}
                                                            title="Update Exam Centre"
                                                            isLoading={isLoading}
                                                            examCentre={selectedExamCentre}
                                                            regionExamDateSlotArray={regionExamDateSlotArray}
                                                            errorMessage={errorMessage}
                                                            errorMessageHandler={setErrorMessage}
                                                            saveClickHandler={editHandlerModalSaveHandler}
                                                            cancelClickHandler={editHandlerModalCancelHandler}/>
            }
            {
                showDeleteModal && <DeleteModal key={selectedExamCentre.code + "1"}
                                                title="Delete Exam Centre"
                                                type="Exam Centre"
                                                isLoading={isLoading}
                                                idToDelete={selectedExamCentre.id}
                                                name={selectedExamCentre.name}
                                                code={selectedExamCentre.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <ExamCentreAddAndEditModal key={selectedExamCentre.code + "1"}
                                                        title="Add New Exam Centre"
                                                        isLoading={isLoading}
                                                        regionExamDateSlotArray={regionExamDateSlotArray}
                                                        errorMessage={errorMessage}
                                                        errorMessageHandler={setErrorMessage}
                                                        saveClickHandler={addHandlerModalSaveHandler}
                                                        cancelClickHandler={addHandlerModalCancelHandler}/>
            }
            {showBulkModal && (
                <BulkUploadModal
                    onClose={() => setShowBulkModal(false)}
                    onSubmit={bulkUploadHandler}
                />
            )}
        </div>
    );
}

export default ExamCentreContainer;