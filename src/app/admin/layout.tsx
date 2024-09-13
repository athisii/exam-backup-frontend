"use client";

import React, { useState, useEffect } from "react";
import NavLink from "@/components/admin/nav-link";
import { faBars, faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  };

  return (
    <main className="flex flex-col w-full h-full">
      {/* Header Part */}
      <header className="w-full bg-blue-500 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold">EXAM BACKUP</h1>
          {/* Button for toggling sidebar, visible only on mobile */}
          {isMobileView && (
            <button onClick={toggleSidebar} className="text-white text-2xl mr-4">
              <FontAwesomeIcon icon={faBars} />
            </button>
          )}
        </div>             
      </header>
      <div className="flex h-full">
        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="bg-gray-50 text-black flex flex-col justify-start items-center sm:w-[15vw] sm:h-[100vh] shadow-lg p-4 space-y-4 font-bold">
            <NavLink />
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
