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
        {/* Profile Icon with Dropdown */}
        <div className="relative">
          <button className="profile-icon flex items-center space-x-2" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faUser} className="fa-2x rounded-lg" />
            <FontAwesomeIcon icon={faChevronDown} className="fa-1x chevron-down-icon" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
              <ul>
                <li className="p-2 hover:bg-gray-100">Profile</li>
                <li className="p-2 hover:bg-gray-100">Settings</li>
                <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
              </ul>
            </div>
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
