/**
 * DocumentsLoading Component
 * Loading skeleton for documents page
 */

import React from 'react';
import { Card } from '@/components/ui/card';

export const DocumentsLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Statistics Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={`stat-skeleton-${i}`}>
            <div className="p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>

      {/* Document List Skeleton */}
      <Card>
        <div className="p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={`doc-skeleton-${i}`} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
