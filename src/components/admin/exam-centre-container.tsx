"use client"

import React, {ChangeEvent, useEffect, useState} from 'react';
import {ApiResponse, ApiResponsePage, IExamCentre, Region, SortOrder, UploadStatusFilterType} from "@/types/types";
import {
    fetchExamCentresByRegion,
    filterExamCentresWithSearchTermAndRegion,
    searchExamCentresWithRegion
} from "@/app/admin/actions";
import Link from "next/link";
import {Pagination} from "@nextui-org/pagination";
import useDebounce from "@/hooks/useDebounce";
import PieChart from "@/components/admin/pie-chart";

const PAGE_SIZE = 11;

const ExamCentreContainer = ({region}: {
    region: Region
}) => {

    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [searchTerm, setSearchTerm] = useState("")
    const [pageNumber, setPageNumber] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [uploadStatusFilter, setUploadStatusFilter] = useState<UploadStatusFilterType>("DEFAULT")
    const [sortBy, setSortBy] = useState("code") // in case selection allowed on UI
    const [sortOrder, setSortOrder] = useState<SortOrder>("ASC") // in case selection allowed on UI
    const debouncedSearchTerm = useDebounce(searchTerm);

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setUploadStatusFilter(event.target.value as UploadStatusFilterType);
        setSearchTerm("");
        fetchExamCentreFilteredByUploadStatus("", event.target.value as UploadStatusFilterType, 0);
        setPageNumber(0);
    };

    useEffect(() => {
        // throw new Error("Error while searching.")
        if (debouncedSearchTerm) {
            if (uploadStatusFilter !== "DEFAULT") {
                fetchExamCentreFilteredByUploadStatus(debouncedSearchTerm, uploadStatusFilter, 0);
                setPageNumber(0);
            } else {
                searchExamCentres(0);
                setPageNumber(0);
            }
        }
    }, [debouncedSearchTerm]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setSearchTerm(value);
        // empty searchTerm
        if (!value) {
            if (uploadStatusFilter !== "DEFAULT") {
                fetchExamCentreFilteredByUploadStatus(value, uploadStatusFilter, 0);
                setPageNumber(0);
            } else {
                fetchExamCentres(0);
                setPageNumber(0);
            }
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

    const fetchExamCentres = async (page: number) => {
        const apiResponse: ApiResponse = await fetchExamCentresByRegion(page, PAGE_SIZE, region.id, sortBy, sortOrder);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam centres.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamCentres(apiResponsePage.items);
        setTotalPages(apiResponsePage.totalPages);
    }

    const searchExamCentres = async (page: number) => {
        const apiResponse: ApiResponse = await searchExamCentresWithRegion(debouncedSearchTerm, page, PAGE_SIZE, region.id, sortBy, sortOrder);
        if (!apiResponse.status) {
            console.log(`error: status=${apiResponse.status}, message=${apiResponse.message}`);
            throw new Error("Error fetching exam centres.");
        }
        const apiResponsePage: ApiResponsePage = apiResponse.data as ApiResponsePage;
        setExamCentres(apiResponsePage.items);
        setTotalPages(apiResponsePage.totalPages);
    }

    useEffect(() => {
        fetchExamCentres(0);
        setPageNumber(0);
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
                       className="sm:w-[60%] p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:outline-none focus:ring-primary-300"
                       placeholder="Search by exam centre code or name"
                       value={searchTerm}
                       onChange={handleSearchChange}
                />
                <div className="text-gray-700 uppercase text-sm">
                    <h3 className="inline">Filter: </h3>
                    <select className="uppercase text-sm rounded" onChange={handleFilterChange}>
                        <option value="DEFAULT">Default</option>
                        <option value="UPLOADED">Uploaded</option>
                        <option value="NOT_UPLOADED">Not Uploaded</option>
                    </select>
                </div>

            </div>
            <div className="shadow-md">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-8 py-3">
                            SN
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
                            <tr key={examCentre.id}
                                className="bg-white border-b hover:bg-gray-50">
                                <td className="px-8 py-4 text-center">
                                    <Link href={`/admin/exam-centres/${examCentre.code}`}>
                                        {pageNumber * PAGE_SIZE + index + 1}
                                    </Link>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <Link href={`/admin/exam-centres/${examCentre.code}`}>
                                        {examCentre.code}
                                    </Link>
                                </td>
                                <td className="px-8 py-4">
                                    <Link className="w-full" href={`/admin/exam-centres/${examCentre.code}`}>
                                        {examCentre.name}
                                    </Link>
                                </td>
                                <td className="px-8 py-4 text-center">
                                    <Link className="w-full" href={`/admin/exam-centres/${examCentre.code}`}>
                                        <PieChart data={[
                                            {
                                                name: "Not Uploaded",
                                                value: examCentre.totalFileCount - examCentre.uploadedFileCount
                                            },
                                            {name: "Uploaded", value: examCentre.uploadedFileCount}
                                        ]}/>
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
                    examCentres.length && <Pagination key={searchTerm + uploadStatusFilter}
                                                      showControls
                                                      color="success"
                                                      total={totalPages}
                                                      initialPage={1}
                                                      onChange={page => {
                                                          setPageNumber(page - 1);
                                                          if (uploadStatusFilter !== "DEFAULT") {
                                                              fetchExamCentreFilteredByUploadStatus(searchTerm, uploadStatusFilter, page - 1);
                                                              return;
                                                          }
                                                          // DEFAULT Filter
                                                          if (searchTerm) {
                                                              searchExamCentres(page - 1);
                                                          } else {
                                                              fetchExamCentres(page - 1);
                                                          }
                                                      }
                                                      }/>
                }
            </div>
        </div>
    );
};

export default ExamCentreContainer;