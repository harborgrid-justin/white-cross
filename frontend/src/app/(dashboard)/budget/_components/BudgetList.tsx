/**
 * Budget List Component
 * Displays a grid of budget cards
 */

'use client';

import React from 'react';
import { BudgetCard } from './BudgetCard';
import { EmptyState } from '@/components/ui/empty-state';
import { DollarSign } from 'lucide-react';
import type { BudgetListProps } from './types/budget.types';

export const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  onViewBudget,
  onEditBudget,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse bg-gray-200 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <EmptyState
        icon={DollarSign}
        title="No Budgets Found"
        description="There are no budgets matching your current filters."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          onView={onViewBudget}
          onEdit={onEditBudget}
        />
      ))}
    </div>
  );
};
