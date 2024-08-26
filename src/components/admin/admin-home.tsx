"use client"

import React, {useState} from 'react';
import ExamCentreContainer from "@/components/admin/exam-centre-container";
import {Region} from "@/types/types";

const AdminHome = ({regions}: {
    regions: Region[]
}) => {
    // sync state between header and body
    const [region, setRegion] = useState<Region>(regions[0]);

    const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = regions.find(region => region.name === event.target.value) as Region;
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
                        {regions.map(mRegion => (<option key={mRegion.id}
                                                         defaultChecked={mRegion.id === region.id}>{mRegion.name}</option>))}
                    </select>
                </div>
            </div>
            <ExamCentreContainer key={region.id} region={region}/>
        </>
    );
};

export default AdminHome;