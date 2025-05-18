"use client";

import { useUser } from "./useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useBlock() {
  const router = useRouter();
  const { user } = useUser();
  const [theme, setTheme] = useState<any[]>([])
  const [style, setStyle] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getBlock = async () => {
      const response = await fetch("/api/theme/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid: user.uid
        }),
      });

      if (!response.ok) {
        console.error("An Unexpected Error has occurred:", await response.text());
        
        await fetch('/api/logout', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

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