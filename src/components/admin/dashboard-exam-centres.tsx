"use client"

import React, {ChangeEvent, useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IExamCentre, IRegion, SortOrder, UploadStatusFilterType} from "@/types/types";
import {filterExamCentresWithSearchTermAndRegion} from "@/lib/actions/exam-centre-actions";
import Link from "next/link";
import {Pagination} from "@nextui-org/pagination";
import useDebounce from "@/hooks/useDebounce";
import PieChart from "@/components/pie-chart";

const PAGE_SIZE = 8;

const DashboardExamCentres = ({region}: {
    region: IRegion
}) => {

    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [pageNumber, setPageNumber] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [uploadStatusFilter, setUploadStatusFilter] = useState<UploadStatusFilterType>("DEFAULT")
    const [sortBy, setSortBy] = useState("code") // in case selection allowed on UI
    const [sortOrder, setSortOrder] = useState<SortOrder>("ASC") // in case selection allowed on UI
    const debouncedSearchTerm = useDebounce(searchTerm);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUploadStatusFilter(event.target.value as UploadStatusFilterType);
        setSearchTerm("");
        setPageNumber(1);
        fetchExamCentreFilteredByUploadStatus("", event.target.value as UploadStatusFilterType, 1);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setSearchTerm(value);
        // for empty search term.
        if (!value) {
            setPageNumber(1);
            fetchExamCentreFilteredByUploadStatus(value, uploadStatusFilter, 1);
        }
    };

    const fetchExamCentreFilteredByUploadStatus = async (searchTerm: string, uploadStatusFilter: UploadStatusFilterType, page: number) => {
        const apiResponse: ApiResponse = await filterExamCentresWithSearchTermAndRegion(searchTerm, uploadStatusFilter, page, PAGE_SIZE, region.id, sortBy, sortOrder);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam centres.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamCentres(apiResponsePage.items);
        setTotalPages(apiResponsePage.totalPages);
    };

    useEffect(() => {
        if (debouncedSearchTerm) {
            setPageNumber(1);
            fetchExamCentreFilteredByUploadStatus(debouncedSearchTerm, uploadStatusFilter, 1);
        }
    }, [debouncedSearchTerm]);

    useEffect(() => {
        setPageNumber(1);
        fetchExamCentreFilteredByUploadStatus("", uploadStatusFilter, 1);
    }, [region])

    return (
        <div className='grid justify-center items-center'>
            <div className="mb-1.5 relative flex justify-between items-center">
                <div
                    className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor"
                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </div>
                <input type="text" id="search"
                       className="flex-grow p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:outline-none focus:ring-primary-300"
                       placeholder="Search by exam centre code or name"
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
                <div className="text--700 p-1 justify-center uppercase text-sm py-4">
                    <h3 className="inline font-bold">Filter: </h3>
                    <select className="uppercase text-sm rounded h-[35px]"
                            onChange={handleFilterChange}>
                        <option value="DEFAULT">Default</option>
                        <option value="UPLOADED">Uploaded</option>
                        <option value="NOT_UPLOADED">Not Uploaded</option>
                    </select>
                </div>
            </div>
            <div className="shadow-md">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-l text-black uppercase bg-gray-50 font-bold">
                    <tr>
                        <th scope="col" className="px-8 py-3">
                            Serial Number
                        </th>
                        <th scope="col" className="px-8 py-3">
                            Exam Centre Code
                        </th>
                        <th scope="col" className="px-8 py-3">
                            Exam Centre Name
                        </th>
                        <th scope="col" className="px-8 py-3">
                            Upload Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        examCentres.map((examCentre, index) => (
                            <tr key={examCentre.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-8 py-4 text-center">
                                    <Link href={`/admin/exam-centres/${examCentre.id}`}>
                                        {(pageNumber - 1) * PAGE_SIZE + index + 1}
                                    </Link>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <Link href={`/admin/exam-centres/${examCentre.id}`}>
                                        {examCentre.code}
                                    </Link>
                                </td>
                                <td className="px-8 py-4">
                                    <Link className="w-full" href={`/admin/exam-centres/${examCentre.id}`}>
                                        {examCentre.name}
                                    </Link>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <Link className="w-full" href={`/admin/exam-centres/${examCentre.id}`}>
                                        {
                                            examCentre.totalFileCount > 0 ? (
                                                <PieChart
                                                    data={[
                                                        {
                                                            name: "Not Uploaded",
                                                            value: examCentre.totalFileCount - examCentre.uploadedFileCount
                                                        },
                                                        {name: "Uploaded", value: examCentre.uploadedFileCount}
                                                    ]}
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-500">
                                                    No exams available
                                                </div>
                                            )
                                        }
                                    </Link>
                                </td>

                            </tr>
                        ))
                    }
                    </tbody>

                </table>
            </div>
            <div className="flex justify-center p-1">
                {
                    examCentres.length && (
                        <Pagination
                            showControls
                            color="success"
                            page={pageNumber}
                            total={totalPages}
                            initialPage={1}
                            onChange={page => {
                                setPageNumber(page);
                                fetchExamCentreFilteredByUploadStatus(searchTerm, uploadStatusFilter, page);
                            }
                            }/>)
                }
            </div>
        </div>
    );
};

export default DashboardExamCentres;