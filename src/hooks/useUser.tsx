"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/libs/supabaseClient";

export function useUser() {
  const [uid, setUid] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>(null);
  const [cards, setCards] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setUid(null);
        setUser(null);
        setProfiles(null);
        setCards(null);
        return;
      }

      const currentUser = sessionData.session.user;
      setUser(currentUser);
      setUid(currentUser.id);

      const response = await fetch("/api/user/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            uid: uid,
        }),
      });

      if (!response.ok) {
        console.error("Unexpected error saving username:", await response.text())
        return;
      }
    };

    checkUser();
  }, []);

  return { uid, user, profiles, cards };
};
