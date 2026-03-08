'use client';

import Link from 'next/link';

interface GlobalErrorProps {
  error: Error & { digest?: string; statusCode?: number };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  themeColor: '#d9c4b0',
};

export default function GlobalError({ error }: GlobalErrorProps) {
  const statusCode = error.statusCode ?? 500;

  return (
    <html>
      <body className="m-0 my-auto h-full overflow-hidden">
        <div className="text-secondary flex flex-col items-center justify-center px-8 text-center font-sans">
          <h1 className="animate-bounce text-8xl font-bold">{statusCode}</h1>

          <p className="my-6 text-xl">
            {error.message !== '' || 'Oops… something went wrong.'}
          </p>

          <Link
            href="/"
            className="bg-secondary text-on-secondary hover:bg-inverse-surface hover:text-inverse-on-surface inline-block rounded-lg px-7 py-2 text-lg font-bold transition-colors duration-300"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
