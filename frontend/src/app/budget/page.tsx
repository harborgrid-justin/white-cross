/**
 * Budget Overview Dashboard
 *
 * Comprehensive budget management dashboard with multi-year support, variance tracking,
 * allocation visualization, and real-time budget utilization monitoring.
 *
 * Features:
 * - Fiscal year selection and comparison
 * - Budget vs actual tracking with variance indicators
 * - Category-wise allocation breakdown
 * - Department/school-level budget overview
 * - Real-time utilization alerts
 * - Quick access to planning, tracking, and reporting
 */

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  PieChart,
  Calendar,
  Users,
  Building2,
  Plus,
  Download,
  Filter,
  Search,
} from 'lucide-react';
import type {
  BudgetCategory,
  BudgetSummary,
  BudgetStatus,
  BudgetCategoryWithMetrics,
} from '@/types/budget';

// Mock data - replace with actual API calls
const mockBudgetSummary: BudgetSummary = {
  fiscalYear: 2025,
  totalAllocated: 1500000,
  totalSpent: 875000,
  totalRemaining: 625000,
  utilizationPercentage: 58.33,
  categoryCount: 12,
  overBudgetCount: 2,
  status: 'ON_TRACK' as BudgetStatus,
};

const mockCategories: BudgetCategoryWithMetrics[] = [
  {
    id: '1',
    name: 'Medical Supplies',
    description: 'General medical supplies and equipment',
    fiscalYear: 2025,
    allocatedAmount: 250000,
    spentAmount: 185000,
    remainingAmount: 65000,
    utilizationPercentage: 74,
    status: 'ON_TRACK' as BudgetStatus,
    isActive: true,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    transactions: [],
  },
  {
    id: '2',
    name: 'Medications',
    description: 'Prescription and over-the-counter medications',
    fiscalYear: 2025,
    allocatedAmount: 450000,
    spentAmount: 425000,
    remainingAmount: 25000,
    utilizationPercentage: 94.4,
    status: 'APPROACHING_LIMIT' as BudgetStatus,
    isActive: true,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    transactions: [],
  },
  {
    id: '3',
    name: 'First Aid',
    description: 'First aid kits and emergency supplies',
    fiscalYear: 2025,
    allocatedAmount: 75000,
    spentAmount: 82000,
    remainingAmount: -7000,
    utilizationPercentage: 109.3,
    status: 'OVER_BUDGET' as BudgetStatus,
    isActive: true,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    transactions: [],
  },
  {
    id: '4',
    name: 'Equipment',
    description: 'Medical equipment and devices',
    fiscalYear: 2025,
    allocatedAmount: 200000,
    spentAmount: 89000,
    remainingAmount: 111000,
    utilizationPercentage: 44.5,
    status: 'UNDER_BUDGET' as BudgetStatus,
    isActive: true,
    createdAt: '2024-07-01T00:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    transactions: [],
  },
];

export default function BudgetOverviewPage() {
  const router = useRouter();
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<BudgetStatus | 'ALL'>('ALL');

  const fiscalYears = [2023, 2024, 2025, 2026];

  const filteredCategories = useMemo(() => {
    return mockCategories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === 'ALL' || category.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, filterStatus]);

  const getStatusBadge = (status: BudgetStatus) => {
    const styles = {
      UNDER_BUDGET: 'bg-blue-100 text-blue-800',
      ON_TRACK: 'bg-green-100 text-green-800',
      APPROACHING_LIMIT: 'bg-yellow-100 text-yellow-800',
      OVER_BUDGET: 'bg-red-100 text-red-800',
      CRITICAL: 'bg-red-200 text-red-900',
    };
    return styles[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Budget Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor budgets, track spending, and manage allocations
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/budget/planning')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Plan Budget
            </button>
            <button
              onClick={() => router.push('/budget/reports')}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
            <button
              onClick={() => router.push('/budget/categories')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </button>
          </div>
        </div>

        {/* Fiscal Year Selector */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Fiscal Year:
          </label>
          <select
            value={selectedFiscalYear}
            onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {fiscalYears.map((year) => (
              <option key={year} value={year}>
                FY {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Allocated
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockBudgetSummary.totalAllocated)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Across {mockBudgetSummary.categoryCount} categories
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Total Spent
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockBudgetSummary.totalSpent)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {mockBudgetSummary.utilizationPercentage.toFixed(1)}% utilized
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Remaining
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(mockBudgetSummary.totalRemaining)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {(100 - mockBudgetSummary.utilizationPercentage).toFixed(1)}% available
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Alerts
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {mockBudgetSummary.overBudgetCount}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Categories over budget
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={() => router.push('/budget/tracking')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm text-indigo-600 font-medium">View →</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Budget Tracking
          </h3>
          <p className="text-sm text-gray-600">
            Track actual vs planned spending with variance analysis
          </p>
        </button>

        <button
          onClick={() => router.push('/budget/allocations')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-medium">View →</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Budget Allocations
          </h3>
          <p className="text-sm text-gray-600">
            Manage department and school-level budget distributions
          </p>
        </button>

        <button
          onClick={() => router.push('/budget/approvals')}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow text-left"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-medium">
              View →
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Approvals
          </h3>
          <p className="text-sm text-gray-600">
            Review and approve pending budget transactions
          </p>
        </button>
      </div>

      {/* Budget Categories Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Budget Categories
            </h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as BudgetStatus | 'ALL')
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="ALL">All Status</option>
                <option value="UNDER_BUDGET">Under Budget</option>
                <option value="ON_TRACK">On Track</option>
                <option value="APPROACHING_LIMIT">Approaching Limit</option>
                <option value="OVER_BUDGET">Over Budget</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    router.push(`/budget/categories/${category.id}`)
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {category.name}
                      </div>
                      {category.description && (
                        <div className="text-sm text-gray-500">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.allocatedAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.spentAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        category.remainingAmount < 0
                          ? 'text-red-600'
                          : 'text-gray-900'
                      }`}
                    >
                      {formatCurrency(category.remainingAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            category.utilizationPercentage > 100
                              ? 'bg-red-600'
                              : category.utilizationPercentage > 90
                              ? 'bg-yellow-600'
                              : category.utilizationPercentage > 60
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${Math.min(
                              category.utilizationPercentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[3rem]">
                        {category.utilizationPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                        category.status
                      )}`}
                    >
                      {category.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/budget/categories/${category.id}/edit`);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/budget/tracking?category=${category.id}`);
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Track
                    </button>
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
