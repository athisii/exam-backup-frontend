'use client';

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Loading from "@/components/admin/loading";
import { fetchRegions } from "@/app/admin/rh-user/actions";
import { toast } from "sonner";
import Swal from 'sweetalert2';

const AddRHModal = ({
    title,
    isLoading,
    errorMessage,
    errorMessageHandler,
    saveClickHandler,
    cancelClickHandler
}: {
    title: string;
    isLoading: boolean;
    errorMessage: string;
    errorMessageHandler: Dispatch<SetStateAction<string>>;
    saveClickHandler: (name: string, code: string, empMail: string, phn: string, region: string | null) => void;
    cancelClickHandler: () => void;
}) => {
    const [name, setName] = useState('');
    const [empCode, setEmpCode] = useState('');
    const [empMail, setEmpMail] = useState('');
    const [phn, setPhn] = useState('');
   
    const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
    const [regionsOptions, setRegionsOptions] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        fetchRegionsData();
    }, []);

    const fetchRegionsData = async () => {
        // setIsLoading(true);
        try {
            const apiResponse = await fetchRegions();          
            if (apiResponse.status) {
                const regions = apiResponse.data.map((region: { id: string; name: string }) => ({ id: region.id, name: region.name }));
                setRegionsOptions(regions);                  
            } else {
                throw new Error(apiResponse.message);
            }
        } catch (error) {
            toast.error(`Failed to fetch regions`);
        } finally {
            // setIsLoading(false);
        }
    };

    const handleSaveClick = () => {
        if (!name || !selectedRegion || !empCode || !empMail || !phn ) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please fill in all fields.'
            });
            return;
        }
    
        const transformedData = {
            EmployeeId: empCode,
            name: name,
            email: empMail,
            mobile: phn,          
            region_id: selectedRegion
        };
    
        saveClickHandler(
            transformedData.EmployeeId,
            transformedData.name,
            transformedData.email,
            transformedData.mobile,           
            transformedData.region_id
        );
    };
    

    const handleCancelClick = () => {
        cancelClickHandler();
        clearFields();
    };

    const clearFields = () => {
        setName('');
        setEmpCode('');
        setEmpMail('');
        setPhn('');
        setSelectedRegion(null);
        errorMessageHandler(""); // Clear any error message
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-50 backdrop-blur-md flex justify-center items-center">
            {isLoading ? <Loading /> : (
                <div className="sm:w-[40vw] bg-gray-100 flex flex-col shadow-lg rounded-lg">
                    <div className="border-b-1">
                        <h2 className="text-center text-white font-bold text-gray-900 p-2 rounded-md bg-blue-500">
                            {title}
                        </h2>
                    </div>
                    <div className="m-3 p-4 text-center">
                        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Name:</label>
                                <input
                                    type="text"
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Region:</label>
                                <select
                                    value={selectedRegion || ''}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                >
                                    <option value="" disabled>Select Region</option>
                                    {regionsOptions.map(region => (
                                        <option key={region.id} value={region.id}>{region.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Employee Code:</label>
                                <input
                                    type="text"
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={empCode}
                                    onChange={(e) => setEmpCode(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Email:</label>
                                <input
                                    type="email"
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={empMail}
                                    onChange={(e) => setEmpMail(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Phone Number:</label>
                                <input
                                    type="tel"
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={phn}
                                    onChange={(e) => setPhn(e.target.value)}
                                />
                            </div>
                            {/* <div className="flex flex-col mb-4">
                                <label className='font-bold text-left'>Designation:</label>
                                <input
                                    type="text"
                                    className="p-2 rounded bg-gray-50 focus:ring-2 focus:outline-none focus:ring-green-500 hover:border-black border"
                                    value={designation}
                                    onChange={(e) => setDesignation(e.target.value)}
                                />
                            </div> */}
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

export default AddRHModal;
