/**
 * Budget Card Component
 * Displays individual budget item information
 */

'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, TrendingDown, AlertCircle } from 'lucide-react';
import type { BudgetItem } from '../types/budget.types';
import {
  formatCurrency,
  calculateUtilization,
  getStatusColor,
  getCategoryName,
  getCategoryColor,
  getBudgetHealth
} from '../utils/budgetUtils';

interface BudgetCardProps {
  budget: BudgetItem;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ budget, onView, onEdit }) => {
  const utilization = calculateUtilization(budget.spent, budget.allocated);
  const health = getBudgetHealth(budget);

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{budget.name}</h3>
            <p className="text-sm text-gray-600 mt-1">FY {budget.fiscalYear}</p>
          </div>
          <Badge className={getStatusColor(budget.status)}>
            {budget.status}
          </Badge>
        </div>

        {/* Category */}
        <div>
          <Badge className={getCategoryColor(budget.category)}>
            {getCategoryName(budget.category)}
          </Badge>
        </div>

        {/* Budget Amounts */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Allocated:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(budget.allocated)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Spent:</span>
            <span className="font-medium text-red-600">
              {formatCurrency(budget.spent)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Remaining:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(budget.remaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Utilization</span>
            <span>{utilization}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                health === 'critical'
                  ? 'bg-red-500'
                  : health === 'warning'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>

        {/* Health Alert */}
        {health !== 'healthy' && (
          <div className={`flex items-center gap-2 text-sm ${
            health === 'critical' ? 'text-red-600' : 'text-yellow-600'
          }`}>
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <span>
              {health === 'critical' 
                ? 'Budget critically low or overspent' 
                : 'Budget approaching limit'}
            </span>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-200">
          <span className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3" aria-hidden="true" />
            {budget.transactionCount} transactions
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(budget.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(budget.id)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
};
