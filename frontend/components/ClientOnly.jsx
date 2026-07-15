"use client";

import { useEffect, useState } from "react";

/**
 * Renders children only on the client after hydration.
 * Use this to wrap components that generate non-deterministic IDs on the server
 * (e.g. Radix UI dialogs) to prevent hydration mismatches.
 */
export default function ClientOnly({ children, fallback = null }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return fallback;
  return children;
}
