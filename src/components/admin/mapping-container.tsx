'use client';

import React, { useEffect, useState } from 'react';
import { toast } from "sonner";
import { fetchRegions, fetchExamCentresByRegions, fetchSlots, fetchExamDates, constructSearchUrl, saveExamCentre, IExamCentre } from '@/app/admin/exam-mapping/actions';
import { IExamDate } from "@/types/types";
import { ICenter } from './multi-select';
import MultiSelect from './multi-select'; 
import Swal from 'sweetalert2';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';

interface MultiSelectProps {
    dropDownName: string;
    examDates: (IExamDate | ICenter)[];
    selectedExamDates: (IExamDate | ICenter)[];
    changeSelectedExamDates: Dispatch<SetStateAction<(IExamDate | ICenter)[]>>;
    isCenterCodes?: boolean;
}


const MappingContainer = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<(IExamDate | ICenter)[]>([]);
    const [selectedCenters, setSelectedCenters] = useState<ICenter[]>([]); 
    const [selectedDates, setSelectedDates] = useState<ICenter[]>([]);
    const [selectedSlots, setSelectedSlots] = useState<IExamDate[]>([]); 
    

    const [regionsOptions, setRegionsOptions] = useState<IExamDate[]>([]);
    const [centersOptions, setCentersOptions] = useState<ICenter[]>([]); 
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
        setIsLoading(true); 
    
        if (selectedCenters.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one exam center.'
            });
            setIsLoading(false);
            return;
        }
    
        if (selectedDates.length === 0 || selectedSlots.length === 0) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Please select at least one date and one slot.'
            });
            setIsLoading(false);
            return;
        }
    
        const examCentreIds: string[] = [];
        const examDateIds: string[] = [];
        const slotIds: string[] = [];
    
      
        selectedCenters.forEach(center => {
            examCentreIds.push(center.id.toString()); 
        });
    
        selectedDates.forEach(date => {
            examDateIds.push(date.id.toString()); 
        });
    
        selectedSlots.forEach(slot => {
            slotIds.push(slot.id.toString()); 
        });
    
        
        try {
            const response = await saveExamCentre(examCentreIds, examDateIds, slotIds);
    
            if (response.status && response.message === "Your data has been saved successfully.") {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: `Successfully updated the exam slots for the selected centers!`
                });
                handleReset(); 
            } else {
                await Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to save exam centers.'
                });
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit the form.'
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
                    <MultiSelect<IExamDate>
                        className="w-2/3 text-center"
                        dropDownName="Select Regions"
                        examDates={regionsOptions}
                        selectedExamDates={selectedRegions}
                        changeSelectedExamDates={setSelectedRegions}
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
                    <MultiSelect<IExamDate>
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
                    <MultiSelect<IExamDate>
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


