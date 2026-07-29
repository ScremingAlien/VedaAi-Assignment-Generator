'use client';

import Link from 'next/link';
import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>

      <p className="text-muted-foreground mt-2 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <div className="mt-6 flex  flex-row items-center gap-5">
        <button
          onClick={reset}
          className="mt-6 cursor-pointer rounded-md px-4 py-2 bg-black text-white"
        >
          Try Again
        </button>

        <Link
          href="/dashboard"
          className="mt-6 cursor-pointer rounded-md px-4 py-2  border text-black"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
