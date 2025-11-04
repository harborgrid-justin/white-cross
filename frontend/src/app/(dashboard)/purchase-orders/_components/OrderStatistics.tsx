/**
 * OrderStatistics Component
 *
 * Displays purchase order statistics in a grid of metric cards
 */

'use client';

import { FileText, Clock, DollarSign, TrendingUp } from 'lucide-react';
import type { PurchaseOrderStatistics } from '@/types/domain/purchaseOrders';
import { formatCurrency } from './order-utils';

export interface OrderStatisticsProps {
  statistics: PurchaseOrderStatistics;
  className?: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  iconBgColor: string;
  label: string;
  value: string | number;
  subtitle: string;
}

/**
 * Individual statistics card
 */
function StatCard({ icon, iconBgColor, label, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 ${iconBgColor} rounded-lg`}>{icon}</div>
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 mt-1">{subtitle}</div>
    </div>
  );
}

/**
 * Statistics grid component
 */
export function OrderStatistics({ statistics, className = '' }: OrderStatisticsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      <StatCard
        icon={<FileText className="w-6 h-6 text-indigo-600" />}
        iconBgColor="bg-indigo-100"
        label="Total Orders"
        value={statistics.totalOrders}
        subtitle={`${statistics.recentOrders} in last 30 days`}
      />

      <StatCard
        icon={<Clock className="w-6 h-6 text-yellow-600" />}
        iconBgColor="bg-yellow-100"
        label="Pending"
        value={statistics.pendingOrders}
        subtitle="Awaiting approval"
      />

      <StatCard
        icon={<DollarSign className="w-6 h-6 text-green-600" />}
        iconBgColor="bg-green-100"
        label="Total Value"
        value={formatCurrency(statistics.totalValue)}
        subtitle="Year to date"
      />

      <StatCard
        icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        iconBgColor="bg-blue-100"
        label="On-Time Rate"
        value={`${statistics.onTimeDeliveryRate}%`}
        subtitle={`Avg delivery: ${statistics.avgDeliveryTime} days`}
      />
    </div>
  );
}
