"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/libs/SupabaseClient"

export function SessionCheck() {
    const router = useRouter()
    
    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || !data.session) {
                router.push("/login");
                return;
            }
        }
        checkSession();
    }, [])
    
    return null
}

export function SessionCheckReverse() {
    const router = useRouter()
    
    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error || data.session) {
                router.push("/welcome");
                return;
            }
        }
        checkSession();
    }, [])
    
    return null
}