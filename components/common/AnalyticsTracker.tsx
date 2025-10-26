"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!GA_ID) return;

    const hasQuery = searchParams.size > 0;
    const queryString = searchParams.toString();
    const url = hasQuery ? `${pathname}?${queryString}` : pathname;

    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("config", GA_ID, { page_path: url });
    }
  }, [pathname, searchParams, GA_ID]);

  return null;
}
