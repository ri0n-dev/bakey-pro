"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/useUser";

export function useUser() {
  const router = useRouter();
  const { user, setUser, loading, setLoading } = useUserStore();

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

        await fetch("/api/logout", {
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

    if (!user) {
      checkUser();
    }
  }, [router, user, setUser, setLoading]);

  return { user, loading };
}