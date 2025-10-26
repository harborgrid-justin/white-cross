/**
 * BudgetCard Component
 * 
 * Displays an individual budget category with utilization metrics.
 */

import React from 'react';
import { BudgetCategoryWithMetrics, BudgetStatus } from '../../../types/budget';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetCardProps {
  category: BudgetCategoryWithMetrics;
  onClick?: () => void;
}

/**
 * BudgetCard component - Individual budget category display
 */
const BudgetCard: React.FC<BudgetCardProps> = ({ category, onClick }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status?: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.UNDER_BUDGET:
        return 'bg-green-100 text-green-800';
      case BudgetStatus.ON_TRACK:
        return 'bg-blue-100 text-blue-800';
      case BudgetStatus.APPROACHING_LIMIT:
        return 'bg-yellow-100 text-yellow-800';
      case BudgetStatus.OVER_BUDGET:
        return 'bg-red-100 text-red-800';
      case BudgetStatus.CRITICAL:
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: BudgetStatus) => {
    switch (status) {
      case BudgetStatus.UNDER_BUDGET:
      case BudgetStatus.ON_TRACK:
        return <CheckCircle className="h-4 w-4" />;
      case BudgetStatus.APPROACHING_LIMIT:
      case BudgetStatus.OVER_BUDGET:
      case BudgetStatus.CRITICAL:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const utilizationPercentage = category.utilizationPercentage || 0;
  const progressBarColor = utilizationPercentage > 100
    ? 'bg-red-600'
    : utilizationPercentage > 80
    ? 'bg-yellow-500'
    : 'bg-green-600';

  return (
    <div
      className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600">{category.description}</p>
          )}
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}>
          {getStatusIcon(category.status)}
          {category.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Budget Metrics */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Allocated</span>
          <span className="font-semibold text-gray-900">{formatCurrency(category.allocatedAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Spent</span>
          <span className="font-semibold text-gray-900">{formatCurrency(category.spentAmount)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Remaining</span>
          <span className={`font-semibold ${category.remainingAmount < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(category.remainingAmount)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>Utilization</span>
          <span className="font-semibold">{utilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${progressBarColor}`}
            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetCard;
