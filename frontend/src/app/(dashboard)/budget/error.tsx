'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Budget page error:', error);
  }, [error]);

  return (
    <div className="min-h-96 flex items-center justify-center p-6">
      <div className="w-full max-w-lg text-center">
        <div className="text-6xl mb-4">❌</div>
        <h2 className="text-xl text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          An unexpected error occurred while loading budget data.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/budget"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Go to Budget
          </Link>
        </div>
      </div>
    </div>
  );
}