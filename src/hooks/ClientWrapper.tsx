"use client";

import { useClientEffects } from "./useClientEffects";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useClientEffects();

  return <>{children}</>;
}
