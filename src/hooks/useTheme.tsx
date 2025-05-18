"use client";

import { useUser } from "./useUser";
import { useEffect, useState } from "react";

export function useTheme(username?: string) {
  const { user } = useUser();
  const [theme, setTheme] = useState<string[]>([])
  const [style, setStyle] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getTheme = async () => {
      const response = await fetch("/api/theme/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username ?? user?.username
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
      setTheme(blockData.data.theme);
      setStyle(blockData.data.style);
      setLoading(false);
    };
  
    getTheme();
  }, [username, user?.username]);  

  return { theme, style, loading };
};