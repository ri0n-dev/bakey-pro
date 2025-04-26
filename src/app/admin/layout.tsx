import { ReactNode } from "react";
import { CheckSession } from "@/components/clinet/auth/Session";
import Sidebar from "@/components/layout/admin/Sidebar"

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <CheckSession />

            <div className="flex h-screen">
                <Sidebar />
                {children}
            </div>
        </>
    );
}
