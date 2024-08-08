import type {Metadata} from "next";
import "./globals.css";
import React from "react";
import {NextUIProvider} from "@nextui-org/react";


export const metadata: Metadata = {
    title: "Exam Backup",
    description: "Exam Backup Web Application",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <NextUIProvider>
            {children}
        </NextUIProvider>
        </body>
        </html>
    );
}
