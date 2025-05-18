"use client";

import { useState, useEffect } from "react";
import { useBlockStore } from "@/stores/useBlock";

export function useBlock() {
  const { blocks, setBlocks } = useBlockStore();
  const [loading, setLoading] = useState<boolean>(false);

  const getBlock = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/block", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch block data");
      }

      setBlocks(data.data || []);
    } catch (error) {
      console.error("Error fetching block data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBlock();
  }, []);

  return { blocks, loading };
}