'use client';

import React, {Dispatch, SetStateAction, useState} from 'react';
import Loading from "@/components/admin/loading";
import {IRegion, IRole, IUser} from "@/types/types";

const UserAddEditModal = ({
                              title,
                              isLoading,
                              errorMessage,
                              errorMessageHandler,
                              user,
                              regions,
                              roles,
                              saveClickHandler,
                              cancelClickHandler
                          }: {
    title: string;
    isLoading: boolean;
    errorMessage: string;
    errorMessageHandler: Dispatch<SetStateAction<string>>;
    user: IUser;
    roles: IRole[];
    regions: IRegion[];
    saveClickHandler: (name: string, userId: string, roleId: number, regionId: number, isRegionHead: boolean, mobileNumber: string, email: string) => void;
    cancelClickHandler: () => void;
}) => {
    const [name, setName] = useState(user.name ? user.name : '');
    const [userId, setUserId] = useState(user.userId ? user.userId : '');
    const [email, setEmail] = useState(user.email ? user.email : '');
    const [mobileNumber, setMobileNumber] = useState(user.mobileNumber ? user.mobileNumber : '');
    const [roleId, setRoleId] = useState(user.roleId ? user.roleId : roles[0].id);
    const [regionId, setRegionId] = useState(user.regionId ? user.regionId : regions[0].id);
    const [isRegionHead, setIsRegionHead] = useState(user.isRegionHead ? user.isRegionHead : false);

    const handleSaveClick = () => {
        clearErrorMessage();
        saveClickHandler(name, userId, roleId, regionId, isRegionHead, mobileNumber, email);
    };

    const handleCancelClick = () => {
        clearErrorMessage();
        cancelClickHandler();
    };

    const clearErrorMessage = () => {
        if (errorMessage) {
            errorMessageHandler("");
        }
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading/> : (
                <div className="md:w-[60vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1">
                        <h2 className="text-center text-medium text-white font-bold bg-blue-500 p-2 rounded-md">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-4 text-center">
                        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-10">
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Name</label>
                                <input
                                    type="text"
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Is Region Head</label>
                                <select
                                    value={isRegionHead ? 1 : 0}
                                    onChange={(e) => setIsRegionHead(e.target.value === "1")}
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                >
                                    {[false, true].map(val => (
                                        <option key={val ? 1 : 2} value={val ? 1 : 0}>{val ? "YES" : "NO"}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Region</label>
                                <select
                                    disabled={!isRegionHead}
                                    value={regionId}
                                    onChange={(e) => setRegionId(Number.parseInt(e.target.value))}
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                >
                                    {regions.map(region => (
                                        <option key={region.id} value={region.id}>{region.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Employee Id</label>
                                <input
                                    type="text"
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={userId}
                                    onChange={(e) => setUserId(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Email</label>
                                <input
                                    type="email"
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Mobile Number</label>
                                <input
                                    type="tel"
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Role</label>
                                <select
                                    value={roleId}
                                    onChange={(e) => setRoleId(Number.parseInt(e.target.value))} // Cast to UserRoleType
                                    className="p-2 rounded bg-gray-50 focus:border-none focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                        <div className="flex justify-center gap-4 p-2 mt-8 text-white font-bold">
                            <button
                                className={`sm:w-[20%] bg-green-500 py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleSaveClick}
                                disabled={isLoading}
                            >
                                Save
                            </button>
                            <button
                                className={`sm:w-[20%] bg-red-500 py-2 px-4 rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={handleCancelClick}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserAddEditModal;
