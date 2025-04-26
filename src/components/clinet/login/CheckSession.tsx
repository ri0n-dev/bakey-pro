"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Skeleton } from "@/components/ui/Skeleton";
import { HeaderSkeleton } from "@/components/layout/login/Header";

export default function CheckSession({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClientComponentClient();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (!error && data.session) {
                router.push("/welcome");
                return;
            }

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (!userError && userData?.user) {
                router.push("/welcome");
                return;
            }

            setLoading(false);
        };
        checkSession();
    }, []);

    if (loading) {
        return (
            <>
                <HeaderSkeleton />
                <div className="flex flex-col justify-center items-center gap-3 w-full max-w-sm mx-auto h-[85vh]">
                    <Skeleton className="w-full h-[80px] mb-2" />
                    <Skeleton className="w-full h-[60px] mb-6" />

                    <Skeleton className="w-full h-[210px] mb-6" />

                    <Skeleton className="w-full h-[45px]" />
                </div>
            </>
        );
    }

    return <>{children}</>;
}
