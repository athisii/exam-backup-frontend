"use client"

import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";
import {logout} from "@/utils/api";

const dashboardRoute = "/admin";
const slotRoute = "/admin/slot";
const roleRoute = "/admin/role";
const regionRoute = "/admin/region";
const fileTypeRoute = "/admin/file-type";
const examDateRoute = "/admin/exam-date";
const examCentreRoute = "/admin/exam-centre";
const activeLinkColor = "bg-[#159ac2] text-white rounded-lg";

export default function NavLink() {
    let currentPath = usePathname();
    return (
        <>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-200 hover:text-white w-full text-center border-b-1 border-blue-500  ${currentPath === dashboardRoute && activeLinkColor}`}
                href={dashboardRoute}>
                Dashboard
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 font-poppins ${currentPath === slotRoute ? ' ' + activeLinkColor : ''}`}
                href={slotRoute}
            >
                Slot
            </Link>

            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 ${currentPath === roleRoute && activeLinkColor}`}
                href={roleRoute}>
                Role
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 ${currentPath === regionRoute && activeLinkColor}`}
                href={regionRoute}>
                Region
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 ${currentPath === fileTypeRoute && activeLinkColor}`}
                href={fileTypeRoute}>
                File Type
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 ${currentPath === examDateRoute && activeLinkColor}`}
                href={examDateRoute}>
                Exam Date
            </Link>
            <Link
                className={`px-1 py-2 rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 border-yellow-500 ${currentPath === examCentreRoute && activeLinkColor}`}
                href={examCentreRoute}>
                Exam Centre
            </Link>
            <button
                onClick={() => logout()}
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center`}>
                Logout
            </button>
        </>
    );
}