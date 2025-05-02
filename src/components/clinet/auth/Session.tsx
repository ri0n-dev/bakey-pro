"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/SupabaseClient";

export const CheckSession = () => {
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error && !data.session) {
                router.push("/login");
                return;
            }

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError && !userData?.user) {
              router.push("/login");
            }
        }
        checkSession();
    }, [])
    
    return null
}

export const CheckSessionReverse = () => {
    const router = useRouter();

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
            }            
        }
        checkSession();
    }, [])
    
    return null
}