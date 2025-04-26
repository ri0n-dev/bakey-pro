"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabaseClient";

export function useUser() {
  const router = useRouter();
  const [uid, setUid] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        await supabase.auth.signOut();
        router.push("/login/");
        return;
      }

      const currentUser = sessionData.session.user;
      setUid(currentUser.id);

      const response = await fetch("/api/user/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${sessionData.session.access_token}`,
        },
        body: JSON.stringify({
          uid: currentUser.id,
        }),
      });

      if (!response.ok) {
        console.error("An Unexpected Error has occurred:", await response.text())
        await supabase.auth.signOut();
        router.push("/login/");
        return;
      }

      const user = await response.json();
      setUser(user.data)
      setLoading(false);
    };

    checkUser();
  }, []);

  return { uid, user, loading };
};
