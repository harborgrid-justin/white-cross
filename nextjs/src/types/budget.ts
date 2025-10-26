/**
 * WF-COMP-318 | budget.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: functions, interfaces | Key Features: component
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Budget Management Types
 * Enterprise-grade type definitions for budget tracking and fiscal management
 */

import type { BaseEntity, PaginationParams, DateRangeFilter } from './common';

// =====================
// ENUMS
// =====================

/**
 * Budget status indicates the current state of budget utilization
 */
export enum BudgetStatus {
  UNDER_BUDGET = 'UNDER_BUDGET',
  ON_TRACK = 'ON_TRACK',
  APPROACHING_LIMIT = 'APPROACHING_LIMIT',
  OVER_BUDGET = 'OVER_BUDGET',
  CRITICAL = 'CRITICAL',
}

/**
 * Recommendation types for budget adjustments
 */
export enum BudgetRecommendation {
  MAINTAIN = 'MAINTAIN',
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

// =====================
// CORE ENTITIES
// =====================

/**
 * Budget Category - Represents a spending category for fiscal tracking
 * @aligned_with backend/src/database/models/inventory/BudgetCategory.ts
 */
export interface BudgetCategory extends BaseEntity {
  name: string;
  description?: string;
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  isActive: boolean;

  // Calculated fields (from service/query, UI-specific)
  remainingAmount?: number;
  utilizationPercentage?: number;
  status?: BudgetStatus;

  // Associations
  transactions?: BudgetTransaction[];
}

/**
 * Budget Transaction - Tracks individual spending transactions
 * @aligned_with backend/src/database/models/inventory/BudgetTransaction.ts
 *
 * Note: Backend model has timestamps: false (only createdAt, no updatedAt)
 * Transactions are immutable once created.
 */
export interface BudgetTransaction extends BaseEntity {
  categoryId: string;
  amount: number;
  description: string;
  transactionDate: string;
  referenceId?: string;
  referenceType?: string;
  notes?: string;

  // Associations
  category?: BudgetCategory;
}

/**
 * Budget Category with Enhanced Metrics
 */
export interface BudgetCategoryWithMetrics extends BudgetCategory {
  remainingAmount: number;
  utilizationPercentage: number;
  status: BudgetStatus;
}

// =====================
// REQUEST/RESPONSE TYPES
// =====================

/**
 * Create Budget Category Request
 */
export interface CreateBudgetCategoryRequest {
  name: string;
  description?: string;
  fiscalYear: number;
  allocatedAmount: number;
}

/**
 * Update Budget Category Request
 */
export interface UpdateBudgetCategoryRequest {
  name?: string;
  description?: string;
  allocatedAmount?: number;
  isActive?: boolean;
}

/**
 * Create Budget Transaction Request
 */
export interface CreateBudgetTransactionRequest {
  categoryId: string;
  amount: number;
  description: string;
  referenceId?: string;
  referenceType?: string;
  notes?: string;
}

/**
 * Update Budget Transaction Request
 */
export interface UpdateBudgetTransactionRequest {
  amount?: number;
  description?: string;
  notes?: string;
}

/**
 * Budget Transaction Filters
 */
export interface BudgetTransactionFilters extends PaginationParams, DateRangeFilter {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Budget Category Query Parameters
 */
export interface BudgetCategoryParams {
  fiscalYear?: number;
  activeOnly?: boolean;
}

// =====================
// ANALYTICS & REPORTING
// =====================

/**
 * Budget Summary - Comprehensive fiscal year overview
 */
export interface BudgetSummary {
  fiscalYear: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercentage: number;
  categoryCount: number;
  overBudgetCount: number;
  status?: BudgetStatus;
}

/**
 * Spending Trend - Monthly spending analysis
 */
export interface SpendingTrend {
  month: string;
  totalSpent: number;
  transactionCount: number;
}

/**
 * Category Year Comparison - Multi-year category analysis
 */
export interface CategoryYearComparison {
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
}

/**
 * Over Budget Category - Categories exceeding allocation
 */
export interface OverBudgetCategory extends BudgetCategoryWithMetrics {
  overAmount: number;
  overPercentage: number;
}

/**
 * Budget Recommendation - AI-driven budget suggestions
 */
export interface BudgetRecommendationItem {
  categoryName: string;
  currentAllocated: number;
  currentSpent: number;
  currentUtilization: number;
  recommendation: BudgetRecommendation;
  suggestedAmount: number;
  reason: string;
}

/**
 * Budget Export Data - Complete fiscal year data export
 */
export interface BudgetExportData {
  exportDate: string;
  fiscalYear: number;
  summary: BudgetSummary;
  categories: Array<BudgetCategoryWithMetrics & {
    transactions: BudgetTransaction[];
  }>;
}

// =====================
// API RESPONSE TYPES
// =====================

/**
 * Budget Categories Response
 */
export interface BudgetCategoriesResponse {
  categories: BudgetCategoryWithMetrics[];
}

/**
 * Budget Transactions Response
 */
export interface BudgetTransactionsResponse {
  transactions: BudgetTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Spending Trends Response
 */
export interface SpendingTrendsResponse {
  trends: SpendingTrend[];
}

/**
 * Category Comparison Response
 */
export interface CategoryComparisonResponse {
  categoryName: string;
  comparison: CategoryYearComparison[];
}

/**
 * Over Budget Categories Response
 */
export interface OverBudgetCategoriesResponse {
  categories: OverBudgetCategory[];
  totalOverAmount: number;
}

/**
 * Budget Recommendations Response
 */
export interface BudgetRecommendationsResponse {
  recommendations: BudgetRecommendationItem[];
  fiscalYear: number;
}

// =====================
// STATISTICS & METRICS
// =====================

/**
 * Budget Statistics Overview
 */
export interface BudgetStatsOverview {
  totalCategories: number;
  activeCategories: number;
  inactiveCategories: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  overallUtilization: number;
  overBudgetCount: number;
  underutilizedCount: number;
  criticalCategories: number;
}

/**
 * Fiscal Year Metrics
 */
export interface FiscalYearMetrics {
  fiscalYear: number;
  quarterlyBreakdown: Array<{
    quarter: number;
    spent: number;
    budgeted: number;
    variance: number;
  }>;
  topSpendingCategories: Array<{
    categoryName: string;
    amount: number;
    percentage: number;
  }>;
  projectedYearEndSpending?: number;
}

/**
 * Category Performance Metrics
 */
export interface CategoryPerformanceMetrics {
  categoryId: string;
  categoryName: string;
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  transactionCount: number;
  averageTransactionAmount: number;
  largestTransaction: number;
  lastTransactionDate?: string;
  status: BudgetStatus;
}

// =====================
// FORM DATA TYPES
// =====================

/**
 * Budget Category Form Data
 */
export interface BudgetCategoryFormData extends CreateBudgetCategoryRequest {
  id?: string;
  isActive?: boolean;
}

/**
 * Budget Transaction Form Data
 */
export interface BudgetTransactionFormData extends CreateBudgetTransactionRequest {
  id?: string;
  transactionDate?: string;
}

/**
 * Fiscal Year Form Data
 */
export interface FiscalYearFormData {
  year: number;
  startDate: string;
  endDate: string;
  description?: string;
}

/**
 * Budget Allocation Form Data
 */
export interface BudgetAllocationFormData {
  fiscalYear: number;
  categories: Array<{
    categoryName: string;
    allocatedAmount: number;
    description?: string;
  }>;
}

// =====================
// UTILITY TYPES
// =====================

/**
 * Budget Alert
 */
export interface BudgetAlert {
  id: string;
  type: 'OVER_BUDGET' | 'APPROACHING_LIMIT' | 'UNDERUTILIZED' | 'UNUSUAL_SPENDING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  categoryId: string;
  categoryName: string;
  message: string;
  fiscalYear: number;
  amount?: number;
  threshold?: number;
  createdAt: string;
}

/**
 * Budget Variance Analysis
 */
export interface BudgetVarianceAnalysis {
  categoryId: string;
  categoryName: string;
  plannedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  isFavorable: boolean;
}

/**
 * Budget Forecast
 */
export interface BudgetForecast {
  categoryId: string;
  categoryName: string;
  currentSpending: number;
  forecastedEndOfYearSpending: number;
  allocatedAmount: number;
  projectedVariance: number;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  basedOnMonths: number;
}

// =====================
// TYPE GUARDS & HELPERS
// =====================

/**
 * Determine budget status based on utilization percentage
 */
export function getBudgetStatus(utilizationPercentage: number): BudgetStatus {
  if (utilizationPercentage > 100) {
    return utilizationPercentage > 110 ? BudgetStatus.CRITICAL : BudgetStatus.OVER_BUDGET;
  }
  if (utilizationPercentage > 90) {
    return BudgetStatus.APPROACHING_LIMIT;
  }
  if (utilizationPercentage > 60) {
    return BudgetStatus.ON_TRACK;
  }
  return BudgetStatus.UNDER_BUDGET;
}

/**
 * Check if a budget category is over budget
 */
export function isOverBudget(category: BudgetCategory): boolean {
  return category.spentAmount > category.allocatedAmount;
}

/**
 * Check if a budget category is approaching limit (>90% utilization)
 */
export function isApproachingLimit(category: BudgetCategoryWithMetrics): boolean {
  return category.utilizationPercentage > 90 && category.utilizationPercentage <= 100;
}

/**
 * Check if a budget category is underutilized (<60% utilization)
 */
export function isUnderutilized(category: BudgetCategoryWithMetrics): boolean {
  return category.utilizationPercentage < 60;
}

/**
 * Calculate remaining budget for a category
 */
export function calculateRemainingBudget(category: BudgetCategory): number {
  return category.allocatedAmount - category.spentAmount;
}

/**
 * Calculate utilization percentage for a category
 */
export function calculateUtilizationPercentage(category: BudgetCategory): number {
  if (category.allocatedAmount === 0) return 0;
  return (category.spentAmount / category.allocatedAmount) * 100;
}

/**
 * Get fiscal year from date
 */
export function getFiscalYearFromDate(date: Date): number {
  // Assuming fiscal year starts in July (month 6)
  const month = date.getMonth();
  const year = date.getFullYear();
  return month >= 6 ? year + 1 : year;
}

/**
 * Get current fiscal year
 */
export function getCurrentFiscalYear(): number {
  return getFiscalYearFromDate(new Date());
}

/**
 * Format currency amount
 */
export function formatBudgetAmount(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format utilization percentage
 */
export function formatUtilizationPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`;
}
