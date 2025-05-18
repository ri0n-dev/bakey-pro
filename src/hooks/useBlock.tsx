"use client";

import { useUser } from "./useUser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useBlock() {
  const router = useRouter();
  const { user } = useUser();
  const [block, setBlock] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  const getBlock = async () => {
    try {
      const response = await fetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          uid: user.uid
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch block data");
      }

      setBlock(data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching block data:", error);
      await fetch('/api/logout', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      router.push("/login/");
    }
  };

  useEffect(() => {
    if (user?.uid) {
      getBlock();
    }
  }, [user, router]);

  return { block, loading };
};