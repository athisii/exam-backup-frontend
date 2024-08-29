import React from 'react';
import {IExamCentre} from "@/types/types";


interface HeaderProps {
    examCentre: IExamCentre;
}

const UserHeader: React.FC<HeaderProps> = ({examCentre: {regionName, name, code}}) => {
    return (
        <div className="flex w-full text-white items-center justify-between bg-blue-500 p-2">
            <h2>Region: {regionName}</h2>
            <h2>Exam Centre: {name}</h2>
            <h2>Code: {code}</h2>
        </div>
    );
};

export default UserHeader;