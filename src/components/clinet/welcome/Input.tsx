"use client";

import { useTheme } from "next-themes"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/libs/SupabaseClient";
import { Toaster, ToasterProps, toast } from "sonner"
import { useUser } from "@/hooks/useUser";

export default function Input() {
    const { theme = "system" } = useTheme()
    const [valume, setValume] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const { uid } = useUser()
    const router = useRouter()

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputValume = event.target.value
        const filteredValue = inputValume.replace(/[^A-Za-z_0-9-]/g, "")
        setValume(filteredValue)
    }

    const handleSave = async () => {
        setIsLoading(true)

        if (!valume.trim()) {
            toast.error("Please enter your username.")
            setIsLoading(false)
            return
        }

        if (!/^[a-zA-Z0-9_]+$/.test(valume)) {
            toast.error("Username can only contain letters, numbers, and underscores.")
            setIsLoading(false)
            return
        }

        if (valume.length < 3) {
            toast.error("Username must be at least 3 characters long.")
            setIsLoading(false)
            return
        }

        try {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !sessionData.session) {
                toast.error("An error has occurred. Please try again late")
                console.error("Unexpected error geting Session:", sessionError)
                setIsLoading(false)
                return
            }

            const response = await fetch("/api/settings/username", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${sessionData.session.access_token}`,
                },
                body: JSON.stringify({
                    username: valume,
                }),
            });

            if (!response.ok) {
                toast.error("An error has occurred. Please try again later.")
                console.error("Unexpected error saving username:", await response.text())
                setIsLoading(false)
                return
            }

            router.push("/admin/")
        } catch (error) {
            toast.error("An unexpected error has occurred. Please try again later.")
            console.error("Unexpected error:", error)
            setIsLoading(false)
        }
    }

    return (
        <>
            <Toaster theme={theme as ToasterProps["theme"]} />

            <div className="flex border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 px-5 py-3.5 mb-8 items-center justify-items-center justify-between">
                <div className="flex items-center">
                    <span className="text-neutral-600 dark:text-neutral-500 text-lg">bakey.pro</span>
                    <input onChange={handleChange} value={valume} className="bg-transparent w-full border-none outline-none text-neutral-950 dark:text-neutral-50 text-lg ml-1.5" type="text" pattern="^[A-Za-z0-9_-]+$" />
                </div>
                <button disabled={valume.length < 3 || isLoading} onClick={handleSave} className={`cursor-grab min-w-9 min-h-9 border outline-none rounded-lg ml-2 text-center justify-center justify-items-center`}>
                    <ChevronRight size="20" className={`transition-colors duration-300 ${valume.length < 3 ? "text-neutral-800 dark:text-neutral-500" : "text-neutral-950 dark:text-neutral-50"}`} />
                </button>
            </div>
        </>
    )
}