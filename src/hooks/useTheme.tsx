"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/SupabaseClient";

export function useBlock() {
  const router = useRouter();
  const [theme, setTheme] = useState<any[]>([])
  const [style, setStyle] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBlock = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        await supabase.auth.signOut();
        router.push("/login/");
        return;
      }

      const { data: authUser, error } = await supabase.auth.getUser();
      if (error || !authUser.user?.id) {
        console.error("Error fetching user:", error?.message);
        await supabase.auth.signOut();
        router.push("/login/");
        return;
      }

      const currentUid = authUser.user.id;
      const response = await fetch("/api/theme/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid: currentUid
        }),
      });

      if (!response.ok) {
        console.error("An Unexpected Error has occurred:", await response.text());
        return;
      }

      const blockData = await response.json();
      setTheme(blockData.theme);
      setStyle(blockData.style);
      setLoading(false);
    };

    getBlock();
  }, [router]);

  return { theme, style, loading };
};