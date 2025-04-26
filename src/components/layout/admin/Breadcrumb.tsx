"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ children }: { children?: React.ReactNode }) {
    const pathname = usePathname();
    const path = pathname.replace("/^\/admin/", "").split("/").filter(Boolean).filter(segment => segment !== 'admin');

    return (
        <>
            <div className="flex fixed justify-between items-center border-b border-neutral-100 dark:border-neutral-900 pl-5 pr-4 top-0 left-63 right-0 z-10 shadow-md h-14">
                <div className="flex w-full text-base justify-left items-center">
                    {path.map((segment, index) => (
                        <React.Fragment key={segment + index}>
                            <p>{segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase()}</p>
                            {index < path.length - 1 && (
                                <ChevronRight className="text-neutral-500 ml-2.5 mr-2.5" size={15} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
                <div className="flex items-center gap-x-2">
                    {children}
                </div>
            </div>
        </>
    )
}