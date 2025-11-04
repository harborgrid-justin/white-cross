/**
 * @fileoverview Upcoming Audits Component - Display scheduled audits
 * @module app/(dashboard)/compliance/_components/UpcomingAudits
 * @category Compliance - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { UpcomingAuditsProps } from './compliance.types';
import { isUpcomingAudit } from './compliance.utils';

/**
 * Upcoming audits component
 * Displays compliance items with audits scheduled within a threshold
 *
 * @param items - Array of compliance items
 * @param threshold - Days threshold for "upcoming" audits (default: 60)
 */
export function UpcomingAudits({ items, threshold = 60 }: UpcomingAuditsProps) {
  // Filter items to only those with upcoming audits
  const upcomingItems = items
    .filter((item) => isUpcomingAudit(item.nextAudit, threshold))
    .sort((a, b) => new Date(a.nextAudit).getTime() - new Date(b.nextAudit).getTime())
    .slice(0, 5); // Limit to 5 most recent

  if (upcomingItems.length === 0) {
    return (
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
            Upcoming Audits
          </h3>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 text-center py-4">
            No audits scheduled within the next {threshold} days
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Header Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" aria-hidden="true" />
          Upcoming Audits
        </h3>
      </div>

      {/* Audits List */}
      <div className="p-6">
        <div className="space-y-3" role="list" aria-label="Upcoming compliance audits">
          {upcomingItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              role="listitem"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.category}
                </p>
                <p className="text-xs text-gray-500" title={item.title}>
                  {item.title}
                </p>
              </div>
              <div className="text-right">
                <p
                  className="text-sm text-gray-900"
                  aria-label={`Audit scheduled for ${new Date(item.nextAudit).toLocaleDateString()}`}
                >
                  {new Date(item.nextAudit).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {item.assignee}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
