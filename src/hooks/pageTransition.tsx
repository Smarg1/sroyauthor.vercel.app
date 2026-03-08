'use client';

import type { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col will-change-transform">{children}</div>;
}
