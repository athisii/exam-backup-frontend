import React from "react";
import NavLink from "@/components/admin/nav-link";


export default function Layout({
                                   children,
                               }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="flex justify-center gap-1 items-center font-[sans-serif]">
            <div
                className="bg-gray-50 text-black flex flex-col justify-center items-center sm:w-[9vw] sm:h-[50vh] shadow-lg">
                <NavLink/>
            </div>
            <div className="flex h-screen w-full flex-col items-center gap-1 bg-gray-50 shadow-lg sm:w-[80vw]">
                {children}
            </div>
        </main>
    );
}