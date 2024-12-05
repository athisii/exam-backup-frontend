'use client'

import React, {useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IRegion, IRole, IUser} from "@/types/types";
import {Pagination} from "@nextui-org/pagination";
import {toast, Toaster} from "sonner";
import DeleteModal from "@/components/modal/delete-modal";
import {convertToLocalDateTime} from "@/lib/date-util";
import {deleteUserById, fetchUsersAsPage, saveUser, uploadCsvFile} from "@/lib/actions/user-actions";
import BulkUploadModal from "@/components/modal/bulk-upload-modal";
import User from './user';
import UserAddEditModal from "@/components/modal/user-add-edit";

const PAGE_SIZE = 8;

const UserContainer = ({regions, roles}: { regions: IRegion[], roles: IRole[] }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")
    const [selectedUser, setSelectedUser] = useState<IUser>({name: ""} as IUser);
    const [users, setUsers] = useState<IUser[]>([]);
    const [pageNumber, setPageNumber] = useState(1)
    const [numberOfElements, setNumberOfElements] = useState(1)
    const [totalElements, setTotalElements] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBulkModal, setShowBulkUploadModal] = useState(false);

    useEffect(() => {
        fetchUsers(pageNumber);
    }, []);

    useEffect(() => {
        setErrorMessage("");
    }, [selectedUser]);

    const fetchUsers = async (page: number) => {
        const apiResponse: ApiResponse = await fetchUsersAsPage(page);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching users.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setUsers(() => apiResponsePage.items);
        setNumberOfElements(() => apiResponsePage.numberOfElements);
        setTotalElements(() => apiResponsePage.totalElements);
        setTotalPages(() => apiResponsePage.totalPages);
    }

    const clearErrorMessage = () => {
        if (errorMessage) {
            setErrorMessage("");
        }
    };

    const isValid = (name: string, userId: string, email: string, mobileNumber: string): boolean => {
        if (name.trim().length === 0) {
            setErrorMessage("'Name' should not be empty.");
            return false;
        }
        if (mobileNumber.trim().length === 0) {
            setErrorMessage("'Mobile Number' should not be empty.");
            return false;
        }
        if (email.trim().length === 0) {
            setErrorMessage("'Email' should not be empty.");
            return false;
        }
        if (userId.trim().length === 0) {
            setErrorMessage("'Employee Id' should be a non-negative number.");
            return false;
        }
        return true;
    };
    const bulkUploadModalUploadHandler = async (formData: FormData) => {
        setIsLoading(true);
        // to reflect loading animation.
        const uploadFileAsync = async (formData: FormData) => {
            const apiResponse: ApiResponse = await uploadCsvFile(formData);
            if (!apiResponse.status) {
                setErrorMessage(apiResponse.message)
                setIsLoading(false);
                return;
            }
            setPageNumber(1);
            // fetchExamCentres(1);
            fetchUsers(1);
            postSuccess("Users added successfully.");
            setShowBulkUploadModal(false);
        }
        uploadFileAsync(formData);
    };

    const editHandlerModalSaveHandler = async (name: string, userId: string, roleId: number, regionId: number, isRegionHead: boolean, mobileNumber: string, email: string) => {
        setIsLoading(true);
        if (!isValid(name, userId, email, mobileNumber)) {
            setIsLoading(false);
            return;
        }
        const updatedUser: IUser = {
            ...selectedUser,
            name,
            userId,
            roleId,
            regionId: isRegionHead ? regionId : null,
            isRegionHead,
            mobileNumber,
            email,
            modifiedDate: convertToLocalDateTime(new Date())
        } as IUser;

        const apiResponse: ApiResponse = await saveUser(updatedUser);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        setUsers(prevState => {
            const filteredRoles = prevState.filter(role => role.id != selectedUser.id);
            const newUsers = [...filteredRoles, updatedUser]
            newUsers.sort((a, b) => a.name.localeCompare(b.name));
            return newUsers;
        })
        postSuccess("User updated successfully.")
        setShowEditModal(false);
    };

    const postSuccess = (message: string) => {
        setIsLoading(false);
        toast.success(message);
    }

    const editHandlerModalCancelHandler = () => {
        setSelectedUser({name: ""} as IUser)
        setShowEditModal(false);
    }
    const deleteHandlerModalDeleteHandler = async (id: number) => {
        setIsLoading(true);
        const apiResponse: ApiResponse = await deleteUserById(id);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const filteredRoles = users.filter(role => role.id != id);

        if ((numberOfElements - 1) == 0 && pageNumber == totalPages) {
            // last page and last element, has prev page
            if (pageNumber > 1) {
                fetchUsers(pageNumber - 1); // go back one page as current page has no element left.
                setTotalPages(totalPages - 1);
                setPageNumber(pageNumber - 1);
            } else {
                // last page and last element, doesn't have prev
                setUsers([]);
                setPageNumber(0);
                setNumberOfElements(0);
                setTotalElements(0);
                setTotalPages(0);
            }
        } else if (numberOfElements > 1 && pageNumber == totalPages) {
            // last page and more element left, don't reload
            setUsers(filteredRoles)
            setNumberOfElements(prevState => prevState - 1)
            setTotalElements(prevState => prevState - 1);
        } else {
            fetchUsers(pageNumber);
        }
        postSuccess("User deleted successfully.");
        setShowDeleteModal(false);
    };
    const deleteHandlerModalCancelHandler = () => {
        setSelectedUser({name: ""} as IUser)
        setShowDeleteModal(false);
    }


    const addHandlerModalSaveHandler = async (name: string, userId: string, roleId: number, regionId: number, isRegionHead: boolean, mobileNumber: string, email: string) => {
        setIsLoading(true);
        if (!isValid(name, userId, email, mobileNumber)) {
            setIsLoading(false);
            return;
        }
        const user = {
            name,
            userId,
            roleId,
            regionId: isRegionHead ? regionId : null,
            isRegionHead,
            mobileNumber,
            email
        } as IUser;
        const apiResponse: ApiResponse = await saveUser(user);
        if (!apiResponse.status) {
            setErrorMessage(apiResponse.message)
            setIsLoading(false);
            return
        }
        const date = new Date();
        user.id = apiResponse.data.id;
        user.createdDate = convertToLocalDateTime(date);
        user.modifiedDate = convertToLocalDateTime(date);

        // when added for the first time, not need to re-fetch from the server.
        if (totalElements < 1) {
            setUsers([...users, user].sort((a, b) => a.name.localeCompare(b.name)));
            setPageNumber(1);
            setNumberOfElements(1)
            setTotalElements(1);
            setTotalPages(1);
        } else if (users.length < PAGE_SIZE && pageNumber == totalPages) {
            // current page is not filled, and it's the last page, then add here, not needed to re-fetch from the server.
            setUsers([...users, user].sort((a, b) => a.name.localeCompare(b.name)));
            setNumberOfElements(numberOfElements + 1);
            setTotalElements(totalElements + 1);
        } else {
            //go to last page after adding and re-fetch from the server.
            let currentTotalPages = Math.max(Math.ceil((totalElements + 1) / PAGE_SIZE), totalPages);
            fetchUsers(currentTotalPages);
            setTotalPages(currentTotalPages);
            setPageNumber(currentTotalPages);
        }
        postSuccess("Role created successfully.")
        setShowAddModal(false);
    };

    const addHandlerModalCancelHandler = () => {
        setSelectedUser({name: ""} as IUser)
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

                <tbody>
                {users.map((user, index) => {
                    return (
                        <User
                            key={user.id}
                            user={user}
                            index={(pageNumber - 1) * PAGE_SIZE + index + 1}
                            changeSelectedRole={setSelectedUser}
                            setShowEditModal={setShowEditModal}
                            setShowDeleteModal={setShowDeleteModal}
                            regions={regions}
                            roles={roles}
                        />
                    );
                })}
                </tbody>

            </table>
            <div className="flex justify-center p-3 font-bold gap-4">
                <button
                    className={`border-1 disabled:bg-gray-400 bg-green-500 py-2 px-4 rounded-md text-white active:bg-green-700`}
                    onClick={() => {
                        clearErrorMessage();
                        setSelectedUser({name: ""} as IUser);
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
                    users.length && !showAddModal && !showEditModal && !showDeleteModal &&
                    <Pagination
                        className="z-0"
                        showControls
                        color="success"
                        page={pageNumber}
                        total={totalPages}
                        initialPage={1}
                        onChange={page => {
                            setPageNumber(() => page);
                            fetchUsers(page);
                        }}/>
                }
            </div>

            {
                showEditModal && <UserAddEditModal key={selectedUser.id + "1"}
                                                   title="Update User"
                                                   isLoading={isLoading}
                                                   errorMessage={errorMessage}
                                                   errorMessageHandler={setErrorMessage}
                                                   user={selectedUser}
                                                   roles={roles}
                                                   regions={regions}
                                                   saveClickHandler={editHandlerModalSaveHandler}
                                                   cancelClickHandler={editHandlerModalCancelHandler}/>
            }

            {
                showDeleteModal && <DeleteModal key={selectedUser.id + "1"}
                                                title="Delete User"
                                                type=" User"
                                                isLoading={isLoading}
                                                idToDelete={selectedUser.id}
                                                name={selectedUser.name}
                                                code={selectedUser.userId}
                                                errorMessage={errorMessage}
                                                errorMessageHandler={setErrorMessage}
                                                deleteClickHandler={deleteHandlerModalDeleteHandler}
                                                cancelClickHandler={deleteHandlerModalCancelHandler}/>
            }
            {showAddModal && <UserAddEditModal key={selectedUser.id + "1"}
                                               title="Add New User"
                                               isLoading={isLoading}
                                               errorMessage={errorMessage}
                                               errorMessageHandler={setErrorMessage}
                                               user={selectedUser}
                                               roles={roles}
                                               regions={regions}
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

export default UserContainer;