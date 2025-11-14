/**
 * Budget Statistics Cards Component
 * Displays key budget metrics in card format
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PieChart, AlertTriangle } from 'lucide-react';
import type { BudgetStatsProps } from '../types/budget.types';
import { formatCurrency } from '../utils/budgetUtils';

export const BudgetStatsCards: React.FC<BudgetStatsProps> = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Allocated',
      value: formatCurrency(stats.totalAllocated),
      subtitle: `${stats.activeBudgets} active budgets`,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      subtitle: `${stats.utilizationRate.toFixed(1)}% utilization`,
      icon: TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Remaining',
      value: formatCurrency(stats.totalRemaining),
      subtitle: 'Available budget',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Spending',
      value: formatCurrency(stats.averageSpending),
      subtitle: 'Per budget item',
      icon: PieChart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Needs Attention',
      value: stats.depletedBudgets,
      subtitle: 'Depleted or overspent',
      icon: AlertTriangle,
      color: stats.depletedBudgets > 0 ? 'text-orange-600' : 'text-gray-600',
      bgColor: stats.depletedBudgets > 0 ? 'bg-orange-50' : 'bg-gray-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
