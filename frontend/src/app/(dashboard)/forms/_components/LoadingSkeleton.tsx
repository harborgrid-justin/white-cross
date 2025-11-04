/**
 * Loading skeleton component for forms list
 *
 * Displays animated placeholder content while forms data is being loaded.
 * Provides visual feedback to users and maintains layout stability.
 */

import React from 'react';
import { Card } from '@/components/ui/card';

/**
 * Loading skeleton component
 *
 * @returns JSX element with animated loading placeholders
 */
export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Statistics cards skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Forms list skeleton */}
      <Card>
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
