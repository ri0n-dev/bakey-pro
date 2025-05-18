"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useUser() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("An Unexpected Error has occurred:", await response.text());

        await fetch('/api/logout', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        router.push("/login/");
        return;
      }

      const userData = await response.json();
      setUser(userData.data);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  return { uid, user, loading };
};