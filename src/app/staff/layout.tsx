"use client";

import React from "react";
import {logout} from "@/lib/api";
import Link from "next/link";


export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex flex-col absolute w-full h-full">
            <header className="w-full bg-blue-500 p-2 text-white">
                <div className="flex items-center justify-between">
                    <Link href="/">
                        <h1 className="text-xl font-bold">EXAM BACKUP</h1>
                    </Link>                    {<button
                        onClick={() => logout()}
                        className={`px-2 py-1.5 rounded-lg bg-red-600 hover:rounded hover:bg-white hover:text-black text-center`}>
                        Logout
                    </button>}
                </div>
            </header>
            <div className="flex h-full justify-center">
                <div className="flex h-screen w-full flex-col items-center gap-1 bg-gray-50 shadow-lg lg:w-[80vw] py-1">
                    {children}
                </div>
            </div>
        </main>
    );
}