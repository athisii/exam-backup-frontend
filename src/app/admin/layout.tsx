"use client";

import React, {useState} from "react";
import NavLink from "@/components/admin/nav-link";


export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <main className="flex flex-col absolute w-full h-full">
            <header className="w-full bg-blue-500 p-2 text-white">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">EXAM BACKUP</h1>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white lg:hidden text-2xl mr-4">
                        {isMenuOpen ?
                            <svg className="h-6 w-6 stroke-white cursor-pointer" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24"
                                 strokeWidth="2"
                                 strokeLinecap="round"
                                 strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            :
                            <svg className="h-6 w-6 stroke-white" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M4 6h16M4 12h16M4 18h16"/>
                            </svg>
                        }
                    </button>
                </div>
                <div
                    className={`w-full lg:hidden items-center gap-6 font-semibold ${isMenuOpen ? "flex flex-col" : "hidden"}`}>
                    <NavLink/>
                </div>
            </header>
            <div className="flex h-full justify-center">
                <div
                    className={`bg-gray-50 hidden text-black lg:flex flex-col justify-start items-center lg:w-[15vw] lg:h-[100vh] shadow-lg p-4 space-y-4 font-bold1`}>
                    <NavLink/>
                </div>
                <div className="flex h-screen w-full flex-col items-center gap-1 bg-gray-50 shadow-lg lg:w-[82vw] py-1">
                    {children}
                </div>
            </div>
        </main>
    );
}