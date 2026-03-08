import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-secondary my-auto flex flex-col items-center justify-center px-8 text-center font-sans">
      <h1 className="animate-bounce text-[6rem] font-bold">404</h1>

      <p className="mt-4 mb-8 text-xl">
        Hmmm… we couldn’t find the page you’re looking for.
      </p>

      <Link
        href="/"
        className="bg-secondary text-on-secondary hover:bg-inverse-surface hover:text-inverse-on-surface inline-block rounded-lg px-7 py-2 text-lg font-bold transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
}
