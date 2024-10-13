import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from "react";
import {IMultiSelect} from "@/types/types";

interface MultiSelectProps {
    className?: string,
    dropDownName: string,
    options: IMultiSelect[],
    selectedOptions: IMultiSelect[],
    changeSelectedOptions: Dispatch<SetStateAction<IMultiSelect[]>>
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                     className,
                                                     dropDownName,
                                                     options,
                                                     selectedOptions,
                                                     changeSelectedOptions
                                                 }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleOption = (option: IMultiSelect) => {
        if (selectedOptions.find(selectedOption => selectedOption.id === option.id)) {
            changeSelectedOptions(prevState=> prevState.filter((o) => o.id !== option.id));
        } else {
            changeSelectedOptions([...selectedOptions, option]);
        }
    };

    const selectAllOptions = () => {
        if (selectedOptions.length === options.length) {
            changeSelectedOptions([]); // Deselect all if all are already selected
        } else {
            changeSelectedOptions(options); // Select all
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
                    selectedOptions.length === 0 ? dropDownName : selectedOptions.length + " item(s) selected"
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
                            selectedOptions.length === options.length ? "bg-gray-100" : ""
                        }`}
                        onClick={selectAllOptions}
                    >
                        {selectedOptions.length === options.length ? "Deselect All" : "Select All"}
                    </div>

                    {options.map(option => (
                        <div
                            key={option.id}
                            className={`cursor-pointer p-2 border-t-1 border-gray-500 hover:text-white hover:bg-blue-500 ${
                                selectedOptions.find(selectedOption => selectedOption.id === option.id) ? "bg-green-500 text-white border-white" : ""
                            }`}
                            onClick={() => toggleOption(option)}>
                            {option.value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelect;
