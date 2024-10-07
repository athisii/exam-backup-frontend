import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
// import { IExamDate } from "@/types/types";

export interface ICenter {
    id: number;
    code: string;
    name: string;
    date?: string;
}

export interface IExamDate {
    id: number;
    date?: string; 
    code?: string; 
    name?: string; 
}

interface MultiSelectProps {
    className?: string;
    dropDownName: string;
    examDates: (IExamDate | ICenter)[];
    selectedExamDates: (IExamDate | ICenter)[];
    changeSelectedExamDates: Dispatch<SetStateAction<(IExamDate | ICenter)[]>>;
    isCenterCodes?: boolean; 
}

const MultiSelect: React.FC<MultiSelectProps> = ({
    className,
    dropDownName,
    examDates,
    selectedExamDates,
    changeSelectedExamDates,
    isCenterCodes = false // Default to false
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleOption = (examDate: IExamDate | ICenter) => {
        if (selectedExamDates.includes(examDate)) {
            changeSelectedExamDates(selectedExamDates.filter((o) => o !== examDate));
        } else {
            changeSelectedExamDates([...selectedExamDates, examDate]);
        }
    };

    const selectAllOptions = () => {
        if (selectedExamDates.length === examDates.length) {
            changeSelectedExamDates([]); // Deselect all if all are selected
        } else {
            changeSelectedExamDates(examDates); // Select all
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <div
                className="rounded-md p-2 cursor-pointer hover:ring-2 hover:outline-none border border-black hover:ring-green-400 hover:border-white"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
            >
                {selectedExamDates.length === 0 ? dropDownName : `${selectedExamDates.length} item(s) selected`}
                <svg
                    className="hs-dropdown-open:rotate-180 size-5 inline"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>

            {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    <div
                        className={`cursor-pointer p-2 hover:bg-blue-500 hover:text-white ${
                            selectedExamDates.length === examDates.length ? "bg-gray-100" : ""
                        }`}
                        onClick={selectAllOptions}
                    >
                        {selectedExamDates.length === examDates.length ? "Deselect All" : "Select All"}
                    </div>

                    {examDates.map((examDate) => (
                        <div
                            key={examDate.id}
                            className={`cursor-pointer p-2 border-t border-gray-500 hover:text-white hover:bg-blue-500 ${
                                selectedExamDates.includes(examDate) ? "bg-green-500 text-white border-white" : ""
                            }`}
                            onClick={() => toggleOption(examDate)}
                        >
                            {/* Display differently based on isCenterCodes */}
                            {isCenterCodes 
                                ? `${examDate.code}` 
                                : `${examDate.date || ''}`
                            }
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
