'use client';

import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { fetchRegions, fetchExamCentresByRegions, fetchSlots, fetchExamDates, constructSearchUrl, saveExamCentre, IExamCentre } from '@/app/admin/exam-mapping/actions';
import { IExamDate } from "@/types/types";
import { ICenter } from './multi-select';
import MultiSelect from './multi-select'; 
import Swal from 'sweetalert2';

const MappingContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<(IExamDate | ICenter)[]>([]);
    const [selectedCenters, setSelectedCenters] = useState<(IExamDate | ICenter)[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<(IExamDate | ICenter)[]>([]);
    const [selectedDates, setSelectedDates] = useState<(IExamDate | ICenter)[]>([]);

    const [regionsOptions, setRegionsOptions] = useState<IExamDate[]>([]);
    const [centersOptions, setCentersOptions] = useState<ICenter[]>([]); // Ensure this uses the correct type
    const [slotsOptions, setSlotsOptions] = useState<IExamDate[]>([]);
    const [datesOptions, setDatesOptions] = useState<IExamDate[]>([]);

    useEffect(() => {
        fetchRegionsData();
        fetchSlotsData();
        fetchExamDatesData();
    }, []);

    const fetchRegionsData = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetchRegions();
            if (apiResponse.status) {
                const regions = apiResponse.data.map((region: { id: any; name: any; }) => ({ id: region.id, date: region.name }));
                setRegionsOptions(regions);
            } else {
                throw new Error(apiResponse.message);
            }
        } catch (error) {
            toast.error(`Failed to fetch regions`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSlotsData = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetchSlots();
            if (apiResponse.status) {
                const slots = apiResponse.data.map((slot: { id: any; name: any; }) => ({ id: slot.id, date: slot.name }));
                setSlotsOptions(slots);
            } else {
                throw new Error(apiResponse.message);
            }
        } catch (error) {
            toast.error(`Failed to fetch slots`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchExamDatesData = async () => {
        setIsLoading(true);
        try {
            const apiResponse = await fetchExamDates();
            if (apiResponse.status) {
                const dates = apiResponse.data.map((date: { id: any; date: any; }) => ({ id: date.id, date: date.date }));
                setDatesOptions(dates);
            } else {
                throw new Error(apiResponse.message);
            }
        } catch (error) {
            toast.error(`Failed to fetch exam dates`);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCentersData = async (selectedRegions: IExamDate[]) => {
        setIsLoading(true);
        try {
            const selectedRegionIds = selectedRegions.map(region => region.id);
            const centers = await fetchExamCentresByRegions(selectedRegionIds);
            setCentersOptions(centers); 
        } catch (error) {
            toast.error(`Failed to fetch centers`);
        } finally {
            setIsLoading(false);
        }
    };
    
    

    const handleSubmit = async () => {
        setIsLoading(true); // Set loading to true when submit is initiated
    
        if (selectedCenters.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one exam center.'
            });
            setIsLoading(false); // Set loading to false before returning
            return;
        }
        
        if (selectedDates.length === 0 || selectedSlots.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one date and one slot.'
            });
            setIsLoading(false); // Set loading to false before returning
            return;
        }
        
        const submissionPromises = selectedCenters.map(async (center) => {
            const selectedCode = center.code; 
    
            if (selectedCode === undefined) {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Selected code is undefined for one of the centers.'
                });
                return null; 
            }
    
            const searchResponse = await constructSearchUrl(selectedCode);
            const searchData = await searchResponse;           
    
            if (searchData.status && searchData.data && Array.isArray(searchData.data.items) && searchData.data.items.length > 0) {
                const examCentre = searchData.data.items[0];    
                const payload: IExamCentre = {
                    id: examCentre.id,
                    code: examCentre.code,
                    name: examCentre.name,
                    regionName: examCentre.regionName,
                    mobileNumber: examCentre.mobileNumber,
                    email: examCentre.email,
                    examDateSlots: selectedDates.map(date => ({
                        examDateId: date.id,
                        slotIds: selectedSlots.map(slot => slot.id)
                    })),
                    region: examCentre.region || 'Unknown', 
                    totalFileCount: examCentre.totalFileCount || 0, 
                    uploadedFileCount: examCentre.uploadedFileCount || 0, 
                    createdDate: examCentre.createdDate || new Date().toISOString(), 
                    modifiedDate: examCentre.modifiedDate || new Date().toISOString() 
                };
    
                const response = await saveExamCentre(payload);
    
                if (response.status && response.message === "Your data has been saved successfully.") {
                    return examCentre.code; 
                } else {                    
                    return null; 
                }
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No exam centre details found or unexpected response structure from API for selected center.'
                });
                return null; 
            }
        });
    
        try {           
            const results = await Promise.all(submissionPromises);
            const successfulCenters = results.filter(center => center !== null); 
            if (successfulCenters.length > 0) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Successfully Slot Added for the following centers: ${successfulCenters.join(', ')}!`
                });
                handleReset();
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No centers were submitted successfully.'
                });
            }
        } catch (error) {          
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit one or more forms'
            });
        } finally {
            setIsLoading(false); 
        }
    };
    
    useEffect(() => {
        if (selectedRegions.length > 0) {
            fetchCentersData(selectedRegions as IExamDate[]);
        } else {
            setCentersOptions([]);
        }
    }, [selectedRegions]);

    const handleReset = () => {
        setSelectedRegions([]);
        setSelectedCenters([]);
        setSelectedSlots([]);
        setSelectedDates([]);
        toast.success("Form reset successfully!");
    };

    return (
        <div className="p-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-10 mb-10 ml-150 w-[130%]">
                {/* Exam Regions */}
                <div className="flex items-center mb-8 gap-6">
                    <label htmlFor="regions" className="text-m font-bold text-black-700 w-1/3">Exam Regions</label>
                    <MultiSelect
                        className="w-2/3 text-center"
                        dropDownName="Select Regions"
                        examDates={regionsOptions}
                        selectedExamDates={selectedRegions }
                        changeSelectedExamDates={setSelectedRegions }
                    />
                </div>
                {/* Exam Centers */}
                <div className="flex items-center mb-8 gap-4">
                    <label htmlFor="centers" className="text-m font-bold text-black-700 w-1/3">Exam Centers</label>
                    <MultiSelect
                        className="w-2/3 text-center"
                        dropDownName="Select Centers"
                        examDates={centersOptions}
                        selectedExamDates={selectedCenters}
                        changeSelectedExamDates={setSelectedCenters}
                        isCenterCodes={true}
                    />
                </div>
                {/* Exam Slots */}
                <div className="flex items-center mb-8 gap-4">
                    <label htmlFor="slots" className="text-m font-bold text-black-700 w-1/3">Exam Slots</label>
                    <MultiSelect
                        className="w-2/3 text-center"
                        dropDownName="Select Slots"
                        examDates={slotsOptions}
                        selectedExamDates={selectedSlots}
                        changeSelectedExamDates={setSelectedSlots}
                    />
                </div>
                {/* Exam Dates */}
                <div className="flex items-center mb-8 gap-4">
                    <label htmlFor="dates" className="text-m font-bold text-black-700 w-1/3">Exam Dates</label>
                    <MultiSelect
                        className="w-2/3 text-center"
                        dropDownName="Select Dates"
                        examDates={datesOptions}
                        selectedExamDates={selectedDates}
                        changeSelectedExamDates={setSelectedDates}
                        isCenterCodes={false}
                    />
                </div>
            </div>

            {/* Submit and Reset Buttons */}
            <div className="flex justify-center gap-4">
                <button className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg" onClick={handleSubmit}>
                    Submit
                </button>
                <button className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};

export default MappingContainer;