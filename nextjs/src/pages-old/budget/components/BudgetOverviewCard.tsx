/**
 * BudgetOverviewCard Component
 * 
 * Displays a summary metric card for budget overview dashboard.
 */

import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetOverviewCardProps {
  title: string;
  amount: number;
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'gray';
  trend?: 'up' | 'down';
  trendValue?: string;
}

/**
 * BudgetOverviewCard component - Displays budget summary metrics
 */
const BudgetOverviewCard: React.FC<BudgetOverviewCardProps> = ({
  title,
  amount,
  subtitle,
  color = 'blue',
  trend,
  trendValue
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    gray: 'bg-gray-50 text-gray-600',
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {formatCurrency(amount)}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <DollarSign className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default BudgetOverviewCard;
