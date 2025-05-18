"use client";

import { useUser } from "@/hooks/useUser";
import { useBlock } from "@/hooks/useBlock";

export default function ClientAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const { blocks, loading: blockLoading } = useBlock();

  if (!user || !blocks || loading || blockLoading) {
    return null;
  }

  return <>{children}</>;
}
