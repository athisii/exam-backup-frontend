import React from "react";
import DashboardExamCentres from "@/components/staff/dashboard-exam-centres";
import {IRegion} from "@/types/types";

const RHDashboard = ({region}: { region: IRegion }) => {
    return (
        <>
            <div className="flex bg-[#0056b3] w-full justify-between p-2 text-white rounded-lg">
                <h2 className="font-bold">EXAM CENTRES</h2>
                <div className="flex gap-3.5">
                    <h2 className="font-bold">Region:</h2>
                    <span className="font-semibold">{region.name}</span>
                </div>
            </div>
            <DashboardExamCentres region={region}/>
        </>
    );
};

export default RHDashboard;
