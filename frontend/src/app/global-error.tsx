'use client';
import Link from 'next/link';
import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold">Application Error</h1>

          <p className="mt-2 text-gray-600 max-w-md">
            Something went wrong while rendering the application.
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
      </body>
    </html>
  );
}
