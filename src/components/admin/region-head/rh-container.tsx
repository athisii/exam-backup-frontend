'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IRHData} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/admin/modal/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";
import {deleteRegionHeadById, fetchRegHeadsAsPage, saveRH} from "@/app/admin/rh-user/actions";
import BulkUploadModal from "@/components/admin/modal/bulk-upload-modal";
import RegionHead from './rh';

// import {bulkUploadModalUploadHandler} from "@/components/admin/exam-centre-container";
// import Role from "@/components/admin/role";
import AddRHContainer from "./rh-add-edit";

const PAGE_SIZE = 8;

const RHContainer = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedRH, setSelectedRH] = useState<IRHData>({ code: "", name: "", mobile: "", email: "", employeeId: ""} as unknown as IRHData);
    const [rhData, setRHData] = useState<IRHData[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBulkModal, setShowBulkUploadModal] = useState(false);

    useEffect(() => {
        fetchRHData(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedRH]);


    

    const fetchRHData = async (page: number) => {
        const apiResponse: ApiResponse = await fetchRegHeadsAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching Users.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setRHData(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };
    

    const isValid = (name: string, code: string, mobile: number, email: string, employeeId: string): boolean => {
        if (name.trim().length === 0) {
            setErrorMessage("'Name' should not be empty.");
            return false;
        }
        if (code.trim().length === 0 || Number.parseInt(code) <= 0) {
            setErrorMessage("'Code' should be a non-negative number.");
            return false;
        }        
        if (email.trim().length === 0) {
            setErrorMessage("'email' should not be empty.");
            return false;
        }
        if (employeeId.trim().length === 0 || Number.parseInt(employeeId) <= 0) {
            setErrorMessage("'Code' should be a non-negative number.");
            return false;
        }
      
        
        return true;
    };

    const editHandlerModalSaveHandler = async (name: string, code: string, mobile: number, email: string, employeeId: string) => {
        setIsLoading(true);
        if (!isValid(name, code, mobile, email, employeeId)) {
            setIsLoading(false);
            return;
        }
        const updatedRole: IRHData = {
            ...selectedRH,
            code,
            name,
            mobile, 
            email, 
            employeeId,
            modifiedDate: convertToLocalDateTime(new Date())
        } as IRHData;

        const apiResponse: ApiResponse = await saveRH(updatedRole);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setRHData(prevState => {
            const filteredRoles = prevState.filter(role => role.id != selectedRH.id);
            const newRoles = [...filteredRoles, updatedRole]
            newRoles.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newRoles;
        })
        postSuccess("Region Head Data updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedRH({code: "", name: ""} as IRHData)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteRegionHeadById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredRoles = rhdata.filter(role => role.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchRHData(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setRHData([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setRHData(filteredRoles)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
          
            fetchRHData(pageNumber);
        }
        postSuccess("Role deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedRH({code: "", name: ""} as IRHData)
        setShowDeleteModal(false);
    }

 


    const addHandlerModalSaveHandler = async (name: string, code: string, mobile: number, email: string, employeeId: string) => {
        setIsLoading(true);
        if (!isValid(name, code, mobile, email, employeeId)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveRH({code, name, mobile, email, employeeId} as IRHData);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newRole: IRHData = {
            code,
            name,
            mobile,
            email,
            employeeId,
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as IRHData;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setRHData([...rhData, newRole].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (rhData.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setRHData([...rhData, newRole].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchRHData(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Role created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedRH({ code: "", name: "", mobile: "", email: "", employeeId: ""} as unknown as IRHData)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg py-4">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs w-full text-black uppercase bg-gray-100 ">
                <tr>
                    <th scope="col" className="px-6 py-4">
                        SN
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Employee Id
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Role
                    </th>
                    <th scope="col" className="px-6 py-4">
                        Region
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
                {/* <tbody>
                {
                    rhData.map((role, index) => {
                        return (
                            <RegionHead key={role.id}
                                  role={role}
                                  index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                  changeSelectedRole={setSelectedRH}
                                  setShowEditModal={setShowEditModal}
                                  setShowDeleteModal={setShowDeleteModal}
                            />
                        );
                    })
                }
                </tbody> */}

<tbody>
  {rhData.map((role, index) => {
    const roleName = role.isRegionHead ? 'Region Head' : 'Admin';
    const regionName = role.region?.name || 'No Region'; // Use region name directly, fallback to 'No Region'
    const createdDate = role.createdDate ? new Date(role.createdDate).toLocaleDateString() : 'N/A';
    const modifiedDate = role.modifiedDate ? new Date(role.modifiedDate).toLocaleDateString() : 'N/A';

    return (
      <tr key={role.id} className="border-b">
        <td className="px-6 py-4">{(pageNumber - 1) * PAGE_SIZE + index + 1}</td>
        <td className="px-6 py-4">{role.name || 'N/A'}</td>
        <td className="px-6 py-4">{role.userId}</td>
        <td className="px-6 py-4">{roleName}</td>
        <td className="px-6 py-4">{regionName}</td>
        <td className="px-6 py-4">{createdDate}</td>
        <td className="px-6 py-4">{modifiedDate}</td>
        
        <td className="px-6 py-4">
          <button 
            className="text-blue-600 hover:underline" 
            onClick={() => { setSelectedRH(role); setShowEditModal(true); }}
          >
            Edit
          </button>
        </td>
        <td className="px-6 py-4">
          <button 
            className="text-red-600 hover:underline" 
            onClick={() => { setSelectedRH(role); setShowDeleteModal(true); }}
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
</tbody>




            </table>
            <div className="flex justify-center p-3 font-bold gap-4">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedRH({code: "", name: ""} as IRHData);
                        setShowAddModal(true);
                    }}>
                    Add User
                </button>
                <button
                    onClick={() => setShowBulkUploadModal(true)} // Open bulk modal
                    className="p-2 px-4 hover:bg-green-600 bg-green-500 text-white rounded-md active:bg-green-700"
                >
                    Bulk Upload
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    rhData.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchRHData(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <AddRHContainer key={selectedRH.code + "1"}
                                                  title="Update Region Head"
                                                  isLoading={isLoading}
                                                  initialName={selectedRH.name}
                                                  initialCode={selectedRH.code}
                                                  errorMessage={errorMessage}
                                                  errorMessageHandler={setErrorMessage}
                                                  saveClickHandler={editHandlerModalSaveHandler}
                                                  cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedRH.code + "1"}
                                                title="Delete Region Head"
                                                type="Region Head"
                                                isLoading={isLoading}
                                                idToDelete={selectedRH.id}
                                                name={selectedRH.name}
                                                code={selectedRH.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <AddRHContainer key={selectedRH.code + "1"}
                                              title="Add New Region Head"
                                              isLoading={isLoading}
                                              errorMessage={errorMessage}
                                              errorMessageHandler={setErrorMessage}
                                              saveClickHandler={addHandlerModalSaveHandler}
                                              cancelClickHandler={addHandlerModalCancelHandler}/>
            }
            {showBulkModal && (
                <BulkUploadModal
                    title="Upload CSV File"
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    errorMessageHandler={setErrorMessage}
                    uploadClickHandler={bulkUploadModalUploadHandler}
                    cancelClickHandler={() => setShowBulkUploadModal(false)}
                />
            )}

        </div>
    );
}

export default RHContainer;