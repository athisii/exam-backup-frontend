"use client"

import React from 'react';
import {IExamCentre} from "@/types/types";


interface HeaderProps {
    examCentre: IExamCentre;
}

const Header: React.FC<HeaderProps> = ({examCentre: {regionName, name, code}}) => {
    return (
        <div className="flex w-full text-white items-center justify-between bg-blue-500 p-2 rounded-lg">
            <h2>Region: {regionName}</h2>
            <h2>{name}</h2>
            <div className="flex items-center justify-between whitespace-nowrap">
                <h2 className="px-3">Code: {code}</h2>
            </div>
        </div>
    );
};

export default Header;