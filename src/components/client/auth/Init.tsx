"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/SupabaseClient";

const AuthCallbackHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const supabase = await createClient()

        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          router.push("/login");
          return;
        }

        const res = await fetch("/api/init", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          router.push("/auth/error/");
          return;
        }
  
        router.push("/welcome");
      };
  
      handle();
  }, [router]);

  return null;
}

export default AuthCallbackHandler;