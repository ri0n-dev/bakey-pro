"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CheckUsername() {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user?.username) {
            router.push("/admin");
        }        
    }, [user, router]);

    return null;
}