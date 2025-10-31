/**
 * Budget Tracking Page
 *
 * Real-time budget vs actual tracking with variance analysis, trend visualization,
 * and detailed transaction history.
 *
 * Features:
 * - Budget vs actual comparison with variance indicators
 * - Monthly/quarterly/yearly trend charts
 * - Category-wise spending breakdown
 * - Transaction history with filters
 * - Variance alerts and notifications
 * - Export to Excel/PDF
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import type {
  BudgetCategory,
  BudgetTransaction,
  BudgetVariance,
} from '@/types/budget';

// Mock data
const mockVarianceData: BudgetVariance[] = [
  {
    budgetId: '1',
    categoryId: '1',
    budgetedAmount: 250000,
    actualAmount: 185000,
    variance: -65000,
    variancePercentage: -26.0,
    period: '2025-Q2',
    isOverBudget: false,
    trendDirection: 'DOWN',
  },
  {
    budgetId: '1',
    categoryId: '2',
    budgetedAmount: 450000,
    actualAmount: 425000,
    variance: -25000,
    variancePercentage: -5.6,
    period: '2025-Q2',
    isOverBudget: false,
    trendDirection: 'STABLE',
  },
  {
    budgetId: '1',
    categoryId: '3',
    budgetedAmount: 75000,
    actualAmount: 82000,
    variance: 7000,
    variancePercentage: 9.3,
    period: '2025-Q2',
    isOverBudget: true,
    trendDirection: 'UP',
  },
];

const mockTransactions: BudgetTransaction[] = [
  {
    id: '1',
    budgetId: '1',
    categoryId: '1',
    amount: 2500,
    type: 'EXPENSE',
    description: 'Medical supplies - bandages and gauze',
    reference: 'PO-2025-001',
    date: '2025-01-15',
    status: 'APPROVED',
    attachments: [],
    createdBy: {
      id: 'user1',
      name: 'Jane Doe',
      email: 'jane@school.edu',
    },
    approvedBy: {
      id: 'user2',
      name: 'John Smith',
      email: 'john@school.edu',
    },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T14:00:00Z',
  },
  {
    id: '2',
    budgetId: '1',
    categoryId: '2',
    amount: 15000,
    type: 'EXPENSE',
    description: 'EpiPens and emergency medications',
    reference: 'PO-2025-002',
    date: '2025-01-20',
    status: 'APPROVED',
    attachments: [],
    createdBy: {
      id: 'user1',
      name: 'Jane Doe',
      email: 'jane@school.edu',
    },
    approvedBy: {
      id: 'user2',
      name: 'John Smith',
      email: 'john@school.edu',
    },
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-20T13:00:00Z',
  },
];

export default function BudgetTrackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams?.get('category');

  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>(
    categoryFilter || 'all'
  );
  const [dateRange, setDateRange] = useState({
    start: '2024-07-01',
    end: '2025-06-30',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTrendIcon = (trend: 'UP' | 'DOWN' | 'STABLE') => {
    if (trend === 'UP') return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (trend === 'DOWN') return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 bg-yellow-500 rounded-full" />;
  };

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((tx) => {
      if (selectedCategory !== 'all' && tx.categoryId !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/budget')}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Budget Overview
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Budget Tracking
            </h1>
            <p className="text-gray-600 mt-1">
              Track actual spending vs budget with variance analysis
            </p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Period:
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mr-2">
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="1">Medical Supplies</option>
              <option value="2">Medications</option>
              <option value="3">First Aid</option>
              <option value="4">Equipment</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Date Range:
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ ...dateRange, end: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Variance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Budgeted
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(775000)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Across selected categories
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Actual Spent
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(692000)}
          </div>
          <div className="text-sm text-green-600 mt-1">
            10.7% under budget
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Variance
            </span>
          </div>
          <div className="text-3xl font-bold text-green-900">
            {formatCurrency(-83000)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Favorable variance
          </div>
        </div>
      </div>

      {/* Variance Analysis Table */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Variance Analysis by Category
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Detailed breakdown of budget vs actual spending
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budgeted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance (%)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockVarianceData.map((variance, index) => {
                const categoryName = ['Medical Supplies', 'Medications', 'First Aid'][index];
                return (
                  <tr key={variance.categoryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {categoryName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {variance.period}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(variance.budgetedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(variance.actualAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          variance.variance > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {variance.variance > 0 ? '+' : ''}
                        {formatCurrency(variance.variance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-sm font-medium ${
                          variance.variancePercentage > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {variance.variancePercentage > 0 ? '+' : ''}
                        {variance.variancePercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTrendIcon(variance.trendDirection)}
                        <span className="ml-2 text-sm text-gray-600">
                          {variance.trendDirection}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          variance.isOverBudget
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {variance.isOverBudget ? 'Over Budget' : 'Under Budget'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Transactions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Latest budget transactions and expenses
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.reference || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        transaction.type === 'EXPENSE'
                          ? 'text-red-600'
                          : 'text-green-600'
                      }`}
                    >
                      {transaction.type === 'EXPENSE' ? '-' : '+'}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.createdBy.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
