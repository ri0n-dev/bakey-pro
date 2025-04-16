"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function CheckUsername() {
    const { user } = useUser();
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user === null ) {
            router.push("/login");
        } else if (user?.username) {
            router.push("/admin");
        }
    }, [user, router]);

    useEffect(() => {
        if (shouldRedirect) {
            router.push("/admin");
        }
    }, [shouldRedirect, router]);

    return null;
}
