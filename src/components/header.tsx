import React from 'react';

type ExamCentre = {
    regionName: string,
    name: string,
    code: string,
};

interface HeaderProps {
    examCentre: ExamCentre;
}

const Header: React.FC<HeaderProps> = ({examCentre: {regionName, name, code}}) => {
    return (
        <div className="flex w-full items-center justify-between bg-blue-500 p-2">
            <h2>Region: {regionName}</h2>
            <h2>Exam Centre: {name}</h2>
            <h2>Code: {code}</h2>
        </div>
    );
};

export default Header;