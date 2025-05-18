import { ReactNode } from "react";
import Sidebar from "@/components/layout/admin/Sidebar";
import { Session } from "@/components/Session";
import ClientAdminLayout from "@/components/client/admin/Layout"

export default async function AdminLayout({ children }: { children: ReactNode }) {
    await Session();

    return (
        <>
            <ClientAdminLayout>
                <div className="flex h-screen">
                    <Sidebar />
                    {children}
                </div>
            </ClientAdminLayout>
        </>
    );
}
