/**
 * QuickStatsCard Component
 * Displays quick statistics overview in the sidebar
 */

'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { QuickStats } from './sidebar.types';

interface QuickStatsCardProps {
  stats: QuickStats;
  className?: string;
}

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  stats,
  className = ''
}) => {
  return (
    <Card className={className}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Quick Stats
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-600">{stats.recentUploads}</div>
            <div className="text-xs text-blue-600 font-medium">Today</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-xl font-bold text-orange-600">{stats.pendingReview}</div>
            <div className="text-xs text-orange-600 font-medium">Pending</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">{stats.encryptedDocs}</div>
            <div className="text-xs text-green-600 font-medium">Encrypted</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-xl font-bold text-yellow-600">{stats.starredDocs}</div>
            <div className="text-xs text-yellow-600 font-medium">Starred</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
