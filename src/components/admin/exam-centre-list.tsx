"use client"

import React, {useEffect, useState} from 'react';
import {IExamCentre, Region, SortOrder} from "@/types/types";
import {fetchExamCentresByRegion} from "@/app/admin/actions";
import Link from "next/link";
import {Pagination} from "@nextui-org/pagination";


const ExamCentreList = ({region}: {
    region: Region
}) => {

    const [examCentres, setExamCentres] = useState<IExamCentre[]>([]);
    const [search, setSearch] = useState<string>("")
    const [totalPages, setTotalPages] = useState<number>(1)
    const [sortBy, setSortBy] = useState<string>("code")
    const [sortOrder, setSortOrder] = useState<SortOrder>("ASC")

    const fetchExamCentres = async (page: number) => {
        const apiResponsePage = await fetchExamCentresByRegion(page, region.id, sortBy, sortOrder);
        setExamCentres(apiResponsePage.items);
        setTotalPages(apiResponsePage.totalPages)
    }

    useEffect(() => {
        fetchExamCentres(0);
    }, [region])

    return (
        <div className='grid justify-center items-center'>
            <div className="relative">
                <div
                    className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"
                         viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd"
                              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                              clipRule="evenodd"/>
                    </svg>
                </div>
                <input type="text" id="table-search"
                       className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-md w-full bg-gray-50"
                       placeholder="Search by exam centre code or name"/>
            </div>
            <div className=" shadow-md">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Exam Centre Code
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Exam Centre Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        examCentres.map(examCentre => (
                            <tr key={examCentre.id}
                                className="bg-white border-b hover:bg-gray-50"
                                onClick={event => console.log(event.target)}>
                                <td className="px-6 py-4 text-center">
                                    <Link href={`/admin/exam-centres/${examCentre.code}`}>
                                        {examCentre.code}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <Link className="w-full" href={`/admin/exam-centres/${examCentre.code}`}>
                                        {examCentre.name}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    True
                                </td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center p-3">
                <Pagination key={region.id} showControls
                            color="success"
                            total={totalPages}
                            initialPage={1}
                            onChange={page => fetchExamCentres(page - 1)}/>
            </div>

        </div>
    );
};

export default ExamCentreList;