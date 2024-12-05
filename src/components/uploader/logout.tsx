'use client'

import React from 'react';
import {logout} from "@/lib/api";

const Logout = () => {
    return (
        <>
            <button
                onClick={() => logout()}
                className={`px-2 py-1.5 rounded-lg bg-red-600 hover:rounded hover:bg-white hover:text-black text-center`}>
                Logout
            </button>
        </>
    );
};

export default Logout;