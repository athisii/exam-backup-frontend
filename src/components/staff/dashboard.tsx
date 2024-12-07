"use client"

import React, {useState} from 'react';
import DashboardExamCentres from "@/components/staff/dashboard-exam-centres";
import {IRegion} from "@/types/types";

const Dashboard = ({regions}: {
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
            <div className='flex bg-[#0056b3] w-full justify-between p-2 text-white rounded-lg'>
                <h2 className='font-bold '>EXAM CENTRES</h2>
                <div className='flex gap-3.5'>
                    <h2 className='font-bold'>Region:</h2>
                    <select
                        className='bg-white-500 hover:bg-gray-300 text-black hover:text-blue hover:rounded-md rounded-lg'
                        onChange={handleRegionChange}
                    >
                        {regions.map(region => <option key={region.id}>{region.name}</option>)}
                    </select>
                </div>
            </div>
            <DashboardExamCentres isRegionHead={false} key={region.id} region={region}/>
        </>
    );
};

export default Dashboard;