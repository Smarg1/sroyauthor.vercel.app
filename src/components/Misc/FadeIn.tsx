'use client';

import type { ReactNode } from 'react';

import { useInView } from '@/hooks/useInView';

interface FadeInProps {
  children: ReactNode;
  delay?: 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
}

const delayClasses: Record<number, string> = {
  0: 'delay-0',
  100: 'delay-100',
  200: 'delay-200',
  300: 'delay-300',
  400: 'delay-400',
  500: 'delay-500',
  600: 'delay-600',
  700: 'delay-700',
  800: 'delay-800',
  900: 'delay-900',
};

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  const base =
    'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out will-change-[opacity,transform]';

  const state = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  const delayClass = delayClasses[delay] ?? 'delay-0';

  return (
    <div ref={ref} className={`${base} ${state} ${delayClass}`}>
      {children}
    </div>
  );
}
