"use client"

import React from 'react';
import {IExamCentre} from "@/types/types";
import {logout} from "@/utils/api";


interface HeaderProps {
    examCentre: IExamCentre;
}

const UserHeader: React.FC<HeaderProps> = ({examCentre: {regionName, name, code}}) => {
    return (
        <div className="flex w-full text-white items-center justify-between bg-blue-500 p-2 rounded-lg">
            <h2>Region: {regionName}</h2>
            <h2>{name}</h2>
            <div className="flex items-center justify-between whitespace-nowrap">
                <h2 className="px-3">Code: {code}</h2>
                <button
                    onClick={() => logout()}
                    className={`px-2 py-1.5 rounded-lg bg-blue-600 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center`}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default UserHeader;