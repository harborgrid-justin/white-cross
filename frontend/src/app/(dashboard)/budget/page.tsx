/**
 * @fileoverview Budget Page - Healthcare facility financial management
 * @module app/(dashboard)/budget/page
 * @category Budget - Pages
 */

import { BudgetContent } from './_components/BudgetContent';

interface BudgetPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    fiscalYear?: string;
    status?: string;
    category?: string;
    department?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

/**
 * Budget Main Page - Healthcare facility financial management
 * 
 * Comprehensive budget management system for healthcare facility financial
 * oversight, expense tracking, and budget planning.
 * 
 * Features:
 * - Multi-year budget planning and tracking
 * - Real-time expense monitoring and variance analysis
 * - Department-wise budget allocation management
 * - Approval workflows for budget requests
 * - Financial reporting and analytics
 * - Budget utilization alerts and notifications
 * - Comprehensive expense categorization
 * 
 * Healthcare-specific functionality:
 * - Medical supply budget tracking
 * - Equipment maintenance cost monitoring
 * - Pharmaceutical expense management
 * - Emergency supply budget allocation
 * - Compliance cost tracking
 * - Health program budget oversight
 */
export default async function BudgetPage({ searchParams }: BudgetPageProps) {
  return <BudgetContent searchParams={searchParams} />;
}