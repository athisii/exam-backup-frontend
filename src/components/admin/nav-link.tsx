"use client"

import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";

const adminRoute = "/admin";
const regionRoute = "/admin/region";
const roleRoute = "/admin/role";
const examSlotRoute = "/admin/exam-slot";
const fileTypeRoute = "/admin/file-type";
const examDateRoute = "/admin/exam-date";
const examCentreRoute = "/admin/exam-centre";
const activeLinkColor = "bg-blue-500 text-white";

export default function NavLink() {
    let currentPath = usePathname();
    return (
        <>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === adminRoute && activeLinkColor}`}
                href={adminRoute}>
                Home
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === roleRoute && activeLinkColor}`}
                href={roleRoute}>
                Role
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === regionRoute && activeLinkColor}`}
                href={regionRoute}>
                Region
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === fileTypeRoute && activeLinkColor}`}
                href={fileTypeRoute}>
                File Type
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === examSlotRoute && activeLinkColor}`}
                href={examSlotRoute}>
                Exam Slot
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-b-1 border-blue-500 ${currentPath === examDateRoute && activeLinkColor}`}
                href={examDateRoute}>
                Exam Date
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center border-blue-500 ${currentPath === examCentreRoute && activeLinkColor}`}
                href={examCentreRoute}>
                Exam Centre
            </Link>
        </>
    );
}