import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {IExamDate} from "@/types/types";

interface MultiSelectProps {
    className?: string,
    dropDownName: string,
    examDates: IExamDate[],
    selectedExamDates: IExamDate[],
    changeSelectedExamDates: Dispatch<SetStateAction<IExamDate[]>>
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                     className,
                                                     dropDownName,
                                                     examDates,
                                                     selectedExamDates,
                                                     changeSelectedExamDates
                                                 }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleOption = (examDate: IExamDate) => {
        if (selectedExamDates.includes(examDate)) {
            changeSelectedExamDates(selectedExamDates.filter((o) => o !== examDate));
        } else {
            changeSelectedExamDates([...selectedExamDates, examDate]);
        }
    };

    const selectAllOptions = () => {
        if (selectedExamDates.length === examDates.length) {
            changeSelectedExamDates([]); // Deselect all if all are already selected
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
            <div className="rounded-md p-2 cursor-pointer hover:ring-2 hover:outline-none hover:ring-green-500"
                 onClick={() => setIsDropdownOpen((prev) => !prev)}>
                {
                    selectedExamDates.length === 0 ? dropDownName : selectedExamDates.length + " item(s) selected"
                }
                <svg className="hs-dropdown-open:rotate-180 size-5 inline" width="24"
                     height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </div>

            {isDropdownOpen && (
                <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
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
                            className={`cursor-pointer p-2 border-t-1 border-gray-500 hover:text-white hover:bg-blue-500 ${
                                selectedExamDates.includes(examDate) ? "bg-green-500 text-white border-white" : ""
                            }`}
                            onClick={() => toggleOption(examDate)}>
                            {examDate.date}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
