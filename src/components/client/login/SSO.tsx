"use client";
import { SiGoogle, SiGithub, SiDiscord, SiX } from "@icons-pack/react-simple-icons";
import { createClient } from "@/libs/SupabaseClient";

export default function SSO() {
    const supabase = createClient()
    const loginWithProvider = async (provider: "google" | "discord" | "github" | "twitter") => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Error signing in with ' + provider + ':', error);
        }
    }

    return (
        <>
            <a onClick={() => loginWithProvider("google")} className="flex items-center justify-center px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                <SiGoogle className="w-6.5 pr-2" />
                <p className="text-base font-bold">Google</p>
            </a>
            <a onClick={() => loginWithProvider("discord")} className="flex items-center justify-center px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                <SiDiscord className="w-6.5 pr-2" />
                <p className="text-base font-bold">Discord</p>
            </a>
            <a onClick={() => loginWithProvider("twitter")} className="flex items-center justify-center px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                <SiX className="w-6.5 pr-2" />
                <p className="text-base font-bold">X</p>
            </a>
            <a onClick={() => loginWithProvider("github")} className="flex items-center justify-center px-5 py-3.5 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 cursor-pointer transition-all duration-300 text-gray-900 dark:text-white w-full hover:border-[#e4e4e4] dark:hover:border-[#2b2b2b]">
                <SiGithub className="w-6.5 pr-2" />
                <p className="text-base font-bold">Github</p>
            </a>
        </>
    );
}
