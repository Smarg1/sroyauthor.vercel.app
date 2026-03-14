'use client';

import { useEffect } from 'react';

export default function WarningXSS(): null {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof console === 'undefined') {
      return;
    }

    console.clear();
    console.log(
      `%c🛑 Warning!`,
      'color: red; -webkit-text-stroke: 2px black; font-size: 72px; font-weight: bold;',
    );
    console.log(
      `%cPasting anything in here could give attackers access to your account.`,
      'font-size: 18px; font-weight: bold; color: red;',
    );
    console.log(
      `%cUnless you understand exactly what you are doing, close this window and stay safe.`,
      'font-size: 16px;',
    );
  }, []);

  return null;
}
