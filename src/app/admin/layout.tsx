"use client";

import React, {useEffect, useState} from "react";
import NavLink from "@/components/admin/nav-link";


// TODO: need to work on this
export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    return (
        <main className="flex flex-col w-full h-full">
            {/* Header Part */}
            <header className="w-full bg-blue-500 p-2 text-white flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-bold">EXAM BACKUP</h1>
                    {/* Button for toggling sidebar, visible only on mobile */}
                    {isMobileView && (
                        <button onClick={toggleSidebar} className="text-white text-2xl mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="12" x2="21" y2="12"/>
                                <line x1="3" y1="6" x2="21" y2="6"/>
                                <line x1="3" y1="18" x2="21" y2="18"/>
                            </svg>
                        </button>
                    )}
                </div>
            </header>
            <div className="flex h-full">
                {/* Sidebar */}
                {isSidebarOpen && (
                    <div
                        className="bg-gray-50 text-black flex flex-col justify-start items-center sm:w-[15vw] sm:h-[100vh] shadow-lg p-4 space-y-4 font-bold">
                        <NavLink/>
                    </div>
                )}

                {/* Main Content */}
                <div className="flex h-screen w-full flex-col items-center gap-1 bg-gray-50 shadow-lg sm:w-[82vw] py-4">
                    {children}
                </div>
            </div>
        </main>
    );
}
