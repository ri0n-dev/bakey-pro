"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/SupabaseClient";

const AuthCallbackHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const supabase = await createClient();
        const { data: { user }, error: sessionError } = await supabase.auth.getUser();
        if (sessionError || !user) {
            await supabase.auth.signOut();
            router.push("/login/");
            return;
        }

        const res = await fetch("/api/init", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!res.ok) {
          console.error('Init API error:', await res.json());
          router.push("/auth/error/");
          return;
        }
  
        router.push("/welcome");
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push("/auth/error/");
      }
    };
  
    handle();
  }, [router]);

  return null;
}

export default AuthCallbackHandler;