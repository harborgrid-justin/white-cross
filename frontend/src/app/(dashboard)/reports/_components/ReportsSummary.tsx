/**
 * @fileoverview Reports Summary Component - Statistics cards display
 * @module app/(dashboard)/reports/_components/ReportsSummary
 * @category Reports - Components
 */

'use client';

import { Card } from '@/components/ui/card';
import {
  FileText,
  Download,
  Clock,
  CheckCircle
} from 'lucide-react';
import { formatNumber } from './utils';
import type { ReportsSummaryProps } from './types';

/**
 * Summary card configuration
 */
interface SummaryCard {
  title: string;
  value: number | string;
  subtitle: string;
  icon: typeof FileText;
  iconColor: string;
  iconBgColor: string;
}

/**
 * ReportsSummary Component
 *
 * Displays summary statistics for reports including:
 * - Total reports count
 * - Reports completed today
 * - Scheduled reports
 * - Total downloads
 *
 * Features:
 * - Responsive grid layout
 * - Loading skeleton states
 * - Formatted numbers
 * - Icon-based visual hierarchy
 *
 * @example
 * ```tsx
 * <ReportsSummary
 *   summary={{
 *     totalReports: 156,
 *     completedToday: 12,
 *     scheduledReports: 8,
 *     totalDownloads: 1247
 *   }}
 * />
 * ```
 */
export function ReportsSummary({ summary, loading = false }: ReportsSummaryProps) {
  // Loading skeleton
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <div className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Build summary cards data
  const summaryCards: SummaryCard[] = [
    {
      title: 'Total Reports',
      value: formatNumber(summary.totalReports),
      subtitle: 'All time generated',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100'
    },
    {
      title: 'Completed Today',
      value: summary.completedToday,
      subtitle: 'Successfully processed',
      icon: CheckCircle,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100'
    },
    {
      title: 'Scheduled',
      value: summary.scheduledReports,
      subtitle: 'Upcoming reports',
      icon: Clock,
      iconColor: 'text-yellow-600',
      iconBgColor: 'bg-yellow-100'
    },
    {
      title: 'Downloads',
      value: formatNumber(summary.totalDownloads),
      subtitle: 'Total downloads',
      icon: Download,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card, index) => {
        const Icon = card.icon;

        return (
          <Card key={index}>
            <div className="p-6">
              <div className="flex items-center">
                <div className={`p-2 ${card.iconBgColor} rounded-lg`}>
                  <Icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
