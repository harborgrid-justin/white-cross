/**
 * Budget types for healthcare budget management
 */

export type BudgetCategory = 'medical-supplies' | 'medications' | 'equipment' | 'staffing' | 'training' | 'other';
export type BudgetStatus = 'active' | 'depleted' | 'overspent' | 'archived';
export type TransactionType = 'expense' | 'allocation' | 'transfer';

export interface BudgetItem {
  id: string;
  name: string;
  category: BudgetCategory;
  allocated: number;
  spent: number;
  remaining: number;
  status: BudgetStatus;
  fiscalYear: string;
  lastTransaction: string;
  transactionCount: number;
}

export interface BudgetTransaction {
  id: string;
  budgetId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  approvedBy: string;
  receiptUrl?: string;
}

export interface BudgetStats {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationRate: number;
  activeBudgets: number;
  depletedBudgets: number;
  averageSpending: number;
}

export interface BudgetAlertCardProps {
  budgets: BudgetItem[];
}

export interface BudgetStatsProps {
  stats: BudgetStats;
}

export interface BudgetListProps {
  budgets: BudgetItem[];
  onViewBudget: (id: string) => void;
  onEditBudget: (id: string) => void;
  loading?: boolean;
}
