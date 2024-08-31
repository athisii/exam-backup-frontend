import React from 'react';
import {IExamCentre} from "@/types/types";


type CompProp = {
    examCentre: IExamCentre
}

const ExamCentreUploadDetailsHeader: React.FC<CompProp> = ({examCentre: {name, code, region}}) => {
    return (
        <div className="flex w-full text-white items-center justify-between bg-blue-500 p-2">
            <h2>Region: {region.name}</h2>
            <h2>{name}</h2>
            <h2>Code: {code}</h2>
        </div>
    );
};

export default ExamCentreUploadDetailsHeader;