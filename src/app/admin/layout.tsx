import { ReactNode } from "react";
import { createClient } from "@/libs/SupabaseServer"
import { redirect } from "next/navigation"
import Sidebar from "@/components/layout/admin/Sidebar"
import { Session } from "@/components/Session"

export default async function AdminLayout({ children }: { children: ReactNode }) {
    await Session();
    const supabase = await createClient()
    const { data } = await supabase.auth.getSession()

    if (!data.session) {
        redirect("/login")
    }

    return (
        <>
            <div className="flex h-screen">
                <Sidebar />
                {children}
            </div>
        </>
    );
}
