"use client"

import React, {useState} from 'react';
import ExamCentreContainer from "@/components/admin/exam-centre-container";
import {IRegion} from "@/types/types";

const AdminDashboard = ({regions}: {
    regions: IRegion[]
}) => {
    // sync state between header and body
    const [region, setRegion] = useState<IRegion>(regions[0]);

    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = regions.find(region => region.name === event.target.value) as IRegion;
        setRegion(selectedRegion);
    }

    return (
        <>
            <div className='flex bg-blue-500 w-full justify-between p-2 text-white'>
                <h2>EXAM CENTRES</h2>
                <div className='flex gap-0.5'>
                    <h2>Region:</h2>
                    <select className='bg-blue-500 hover:bg-gray-200 hover:text-black hover:rounded-md'
                            onChange={handleRegionChange}
                    >
                        {regions.map(region => <option key={region.id}>{region.name}</option>)}
                    </select>
                </div>
            </div>
            <ExamCentreContainer key={region.id} region={region}/>
        </>
    );
};

export default AdminDashboard;