'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IRole} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/admin/modal/delete-modal";
import {convertToLocalDateTime} from "@/utils/date-util";
import {deleteRoleById, fetchRolesAsPage, saveRole} from "@/app/admin/role/actions";
import Role from "@/components/admin/role";
import AddAndEditModal from "@/components/admin/modal/add-and-edit-modal";

const PAGE_SIZE = 8;

const RoleContainer = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    const [selectedRole, setSelectedRole] = useState<IRole>({code: "", name: ""} as IRole);
    const [roles, setRoles] = useState<IRole[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetchRoles(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedRole]);


    const fetchRoles = async (page: number) => {
        const apiResponse: ApiResponse = await fetchRolesAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching roles.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setRoles(() => apiResponsePage.items);
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
        const updatedRole: IRole = {
            ...selectedRole,
            code,
            name: name.toUpperCase(),
            modifiedDate: convertToLocalDateTime(new Date())
        } as IRole;

        const apiResponse: ApiResponse = await saveRole(updatedRole);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setRoles(prevState => {
            const filteredRoles = prevState.filter(role => role.id != selectedRole.id);
            const newRoles = [...filteredRoles, updatedRole]
            newRoles.sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code))
            return newRoles;
        })
        postSuccess("Role updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false); // de-initialize modal state.
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedRole({code: "", name: ""} as IRole)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteRoleById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredRoles = roles.filter(role => role.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchRoles(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setRoles([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setRoles(filteredRoles)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            // delete in between, then reload current page.
            fetchRoles(pageNumber);
        }
        postSuccess("Role deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedRole({code: "", name: ""} as IRole)
        setShowDeleteModal(false);
    }

    const addHandlerModalSaveHandler = async (name: string, code: string) => {
        setIsLoading(true);
        if (!isValid(name, code)) {
            setIsLoading(false);
            return;
        }
        const apiResponse: ApiResponse = await saveRole({code, name} as IRole);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        const newRole: IRole = {
            code,
            name: name.toUpperCase(),
            createdDate: convertToLocalDateTime(date),
            modifiedDate: convertToLocalDateTime(date),
            id: apiResponse.data.id
        } as IRole;

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setRoles([...roles, newRole].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (roles.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setRoles([...roles, newRole].sort((a, b) => Number.parseInt(a.code) - Number.parseInt(b.code)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchRoles(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Role created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedRole({code: "", name: ""} as IRole)
        setShowAddModal(false);
    }

    return (
        <div className="shadow-md sm:rounded-lg py-4">
            <Toaster position="top-right" richColors duration={3000}/>
            <table className="w-full text-sm text-left text-gray-500">
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
                    roles.map((role, index) => {
                        return (
                            <Role key={role.id}
                                  role={role}
                                  index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                                  changeSelectedRole={setSelectedRole}
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
                        setSelectedRole({code: "", name: ""} as IRole);
                        setShowAddModal(true);
                    }}>
                    Add Role
                </button>
            </div>
            <div className="flex justify-center p-1">
                {
                    roles.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchRoles(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <AddAndEditModal key={selectedRole.code + "1"}
                                                  title="Update Role"
                                                  isLoading={isLoading}
                                                  initialName={selectedRole.name}
                                                  initialCode={selectedRole.code}
                                                  errorMessage={errorMessage}
                                                  errorMessageHandler={setErrorMessage}
                                                  saveClickHandler={editHandlerModalSaveHandler}
                                                  cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedRole.code + "1"}
                                                title="Delete Role"
                                                type="Role"
                                                isLoading={isLoading}
                                                idToDelete={selectedRole.id}
                                                name={selectedRole.name}
                                                code={selectedRole.code}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <AddAndEditModal key={selectedRole.code + "1"}
                                              title="Add New Role"
                                              isLoading={isLoading}
                                              errorMessage={errorMessage}
                                              errorMessageHandler={setErrorMessage}
                                              saveClickHandler={addHandlerModalSaveHandler}
                                              cancelClickHandler={addHandlerModalCancelHandler}/>
            }
        </div>
    );
}

export default RoleContainer;