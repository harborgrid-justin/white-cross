'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Profile error:', error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[30vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Something went wrong
        </h3>
        <p className="text-gray-600">
          There was an error loading profile content.
        </p>
        <Button onClick={() => reset()} size="sm">
          Try again
        </Button>
      </div>
    </div>
  );
}
