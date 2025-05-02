"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/SupabaseClient";

const AuthCallbackHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handle = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
  
        const { data, error } = await supabase.auth.getSession();
        if (error || !data.session) {
          router.push("/login");
          return;
        }
  
        const accessToken = data.session.access_token;
  
        const res = await fetch("/api/auth/initialize", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!res.ok) {
          router.push("/login");
          return;
        }
  
        router.push("/welcome");
      };
  
      handle();
  }, [router]);

  return null;
}

export default AuthCallbackHandler;