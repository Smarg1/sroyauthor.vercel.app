'use client';

import { useEffect } from 'react';

export default function WarningXSS() {
  useEffect(() => {
    console.info('%cStop!', 'color: red; font-size: 40px; font-weight: bold;');
    console.info(
      '%cThis browser feature is intended for developers. If someone told you to copy and paste something here, it could be a scam and give them access to your accounts or device.',
      'font-size: 16px; max-width: 600px;',
    );
    console.info(
      "%cUnless you know exactly what you're doing, close this window and stay safe.",
      'font-size: 14px;',
    );
  }, []);

  return null;
}
