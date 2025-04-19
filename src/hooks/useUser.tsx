"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/libs/supabaseClient";

export function useUser() {
  const [uid, setUid] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setUid(null);
        setUser(null);

        return redirect("/login/");
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
            uid: uid,
        }),
      });

      if (!response.ok) {
        console.error("Unexpected error saving username:", await response.text())

        setUid(null);
        setUser(null);
        return;
      }

      const user = await response.json();
      setUser(user.data)
    };

    checkUser();
  }, []);

  return { uid, user };
};
