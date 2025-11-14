/**
 * Utility functions for budget management
 */

import type { BudgetItem, BudgetStats, BudgetCategory, BudgetStatus } from '../types/budget.types';

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Calculate utilization percentage
 */
export const calculateUtilization = (spent: number, allocated: number): number => {
  if (allocated === 0) return 0;
  return Math.round((spent / allocated) * 100);
};

/**
 * Get status color classes
 */
export const getStatusColor = (status: BudgetStatus): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'depleted':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'overspent':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'archived':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Get category display name
 */
export const getCategoryName = (category: BudgetCategory): string => {
  const names: Record<BudgetCategory, string> = {
    'medical-supplies': 'Medical Supplies',
    'medications': 'Medications',
    'equipment': 'Equipment',
    'staffing': 'Staffing',
    'training': 'Training',
    'other': 'Other',
  };
  return names[category];
};

/**
 * Get category color
 */
export const getCategoryColor = (category: BudgetCategory): string => {
  const colors: Record<BudgetCategory, string> = {
    'medical-supplies': 'bg-blue-50 text-blue-700',
    'medications': 'bg-purple-50 text-purple-700',
    'equipment': 'bg-green-50 text-green-700',
    'staffing': 'bg-orange-50 text-orange-700',
    'training': 'bg-indigo-50 text-indigo-700',
    'other': 'bg-gray-50 text-gray-700',
  };
  return colors[category];
};

/**
 * Filter budgets by category
 */
export const filterByCategory = (
  budgets: BudgetItem[],
  category: BudgetCategory | 'all'
): BudgetItem[] => {
  if (category === 'all') return budgets;
  return budgets.filter(budget => budget.category === category);
};

/**
 * Filter budgets by status
 */
export const filterByStatus = (
  budgets: BudgetItem[],
  status: BudgetStatus | 'all'
): BudgetItem[] => {
  if (status === 'all') return budgets;
  return budgets.filter(budget => budget.status === status);
};

/**
 * Search budgets by query
 */
export const searchBudgets = (budgets: BudgetItem[], query: string): BudgetItem[] => {
  if (!query.trim()) return budgets;
  
  const lowerQuery = query.toLowerCase();
  return budgets.filter(budget =>
    budget.name.toLowerCase().includes(lowerQuery) ||
    budget.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort budgets by field
 */
export const sortBudgets = (
  budgets: BudgetItem[],
  field: 'name' | 'allocated' | 'spent' | 'remaining' | 'utilization',
  order: 'asc' | 'desc' = 'asc'
): BudgetItem[] => {
  return [...budgets].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;
    
    if (field === 'utilization') {
      aVal = calculateUtilization(a.spent, a.allocated);
      bVal = calculateUtilization(b.spent, b.allocated);
    } else {
      aVal = a[field];
      bVal = b[field];
    }
    
    if (typeof aVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal as string)
        : (bVal as string).localeCompare(aVal);
    }
    
    return order === 'asc' ? aVal - (bVal as number) : (bVal as number) - aVal;
  });
};

/**
 * Calculate budget statistics
 */
export const calculateBudgetStats = (budgets: BudgetItem[]): BudgetStats => {
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const totalRemaining = budgets.reduce((sum, b) => sum + b.remaining, 0);
  
  const utilizationRate = totalAllocated > 0 
    ? (totalSpent / totalAllocated) * 100 
    : 0;
  
  const activeBudgets = budgets.filter(b => b.status === 'active').length;
  const depletedBudgets = budgets.filter(b => b.status === 'depleted' || b.status === 'overspent').length;
  
  const averageSpending = budgets.length > 0 
    ? totalSpent / budgets.length 
    : 0;
  
  return {
    totalAllocated,
    totalSpent,
    totalRemaining,
    utilizationRate: Math.round(utilizationRate * 10) / 10,
    activeBudgets,
    depletedBudgets,
    averageSpending,
  };
};

/**
 * Check if budget needs attention
 */
export const needsAttention = (budget: BudgetItem): boolean => {
  const utilization = calculateUtilization(budget.spent, budget.allocated);
  return utilization >= 80 || budget.status === 'overspent';
};

/**
 * Get budget health status
 */
export const getBudgetHealth = (budget: BudgetItem): 'healthy' | 'warning' | 'critical' => {
  const utilization = calculateUtilization(budget.spent, budget.allocated);
  
  if (budget.status === 'overspent') return 'critical';
  if (utilization >= 90) return 'critical';
  if (utilization >= 75) return 'warning';
  return 'healthy';
};
