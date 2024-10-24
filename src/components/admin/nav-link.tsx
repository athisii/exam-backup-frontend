"use client"

import Link from "next/link";
import React from "react";
import {usePathname} from "next/navigation";
import {logout} from "@/utils/api";

export const dashboardRoute = "/admin";
export const slotRoute = "/admin/slot";
export const roleRoute = "/admin/role";
export const regionRoute = "/admin/region";
export const fileTypeRoute = "/admin/file-type";
export const examDateRoute = "/admin/exam-date";
export const examCentreRoute = "/admin/exam-centre";
const examRhUsersRoute = "/admin/rh-user"
export const activeLinkColor = "bg-[#159ac2] text-white rounded-lg";

export default function NavLink() {
    let currentPath = usePathname();
    return (
        <>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-200 hover:text-white w-full text-center border-b-1  ${currentPath === dashboardRoute && activeLinkColor}`}
                href={dashboardRoute}>
                Dashboard
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 font-poppins ${currentPath === slotRoute ? ' ' + activeLinkColor : ''}`}
                href={slotRoute}
            >
                Slot
            </Link>

            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1  ${currentPath === roleRoute && activeLinkColor}`}
                href={roleRoute}>
                Role
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 ${currentPath === regionRoute && activeLinkColor}`}
                href={regionRoute}>
                Region
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 ${currentPath === fileTypeRoute && activeLinkColor}`}
                href={fileTypeRoute}>
                File Type
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 ${currentPath === examDateRoute && activeLinkColor}`}
                href={examDateRoute}>
                Exam Date
            </Link>
            <Link
                className={`px-1 py-2 rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1  ${currentPath === examCentreRoute && activeLinkColor}`}
                href={examCentreRoute}>
                Exam Centre
            </Link>
            <Link
                className={`px-1 py-2 hover:rounded hover:bg-cyan-300 hover:text-white w-full text-center border-b-1 ${currentPath === examRhUsersRoute && activeLinkColor}`}
                href={examRhUsersRoute}>
                RH Users
            </Link>
            <button
                onClick={() => logout()}
                className={`px-1 py-2 hover:rounded hover:bg-cyan-600 hover:text-white w-full text-center`}>
                Logout
            </button>
        </>
    );
}