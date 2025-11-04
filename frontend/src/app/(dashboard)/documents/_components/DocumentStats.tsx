/**
 * DocumentStats Component
 * Displays document statistics in a grid of stat cards
 */

import React from 'react';
import { FileText, Clock, AlertTriangle, Archive } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { DocumentStats as DocumentStatsType } from './types/document.types';

interface DocumentStatsProps {
  stats: DocumentStatsType;
}

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  valueColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  valueColor,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${valueColor}`}>{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
    </div>
  </Card>
);

export const DocumentStats: React.FC<DocumentStatsProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard
        title="Total Documents"
        value={stats.totalDocuments}
        subtitle={`${stats.documentsThisMonth} added this month`}
        icon={FileText}
        iconColor="text-blue-500"
        valueColor="text-blue-600"
      />

      <StatCard
        title="Pending Review"
        value={stats.pendingReview}
        subtitle="Require attention"
        icon={Clock}
        iconColor="text-orange-500"
        valueColor="text-orange-600"
      />

      <StatCard
        title="Expiring Soon"
        value={stats.expiringSoon}
        subtitle="Within 7 days"
        icon={AlertTriangle}
        iconColor="text-red-500"
        valueColor="text-red-600"
      />

      <StatCard
        title="Storage Used"
        value={`${stats.storageUsed}MB`}
        subtitle={`Avg: ${stats.averageFileSize}MB per file`}
        icon={Archive}
        iconColor="text-purple-500"
        valueColor="text-purple-600"
      />
    </div>
  );
};
