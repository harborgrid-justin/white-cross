/**
 * @fileoverview Budget Content Component - Healthcare facility financial management
 * @module app/(dashboard)/budget/_components/BudgetContent
 * @category Budget - Components
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
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
  Target,
  Wallet,
  Receipt,
  CreditCard,
  Calculator,
  BarChart3,
  FileText,
  Eye
} from 'lucide-react';

interface BudgetContentProps {
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

interface BudgetSummary {
  fiscalYear: number;
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  utilizationPercentage: number;
  categoryCount: number;
  overBudgetCount: number;
  status: BudgetStatus;
}

interface BudgetCategory {
  id: string;
  name: string;
  description: string;
  fiscalYear: number;
  allocatedAmount: number;
  spentAmount: number;
  remainingAmount: number;
  utilizationPercentage: number;
  status: BudgetStatus;
  isActive: boolean;
  department?: string;
  lastUpdated: string;
  transactions: BudgetTransaction[];
}

interface BudgetTransaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  vendor?: string;
  type: 'EXPENSE' | 'ALLOCATION' | 'TRANSFER' | 'REFUND';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

type BudgetStatus = 'UNDER_BUDGET' | 'ON_TRACK' | 'APPROACHING_LIMIT' | 'OVER_BUDGET' | 'CRITICAL';

// Mock data for comprehensive healthcare budget management
const mockBudgetSummary: BudgetSummary = {
  fiscalYear: 2025,
  totalAllocated: 2500000,
  totalSpent: 1475000,
  totalRemaining: 1025000,
  utilizationPercentage: 59.0,
  categoryCount: 15,
  overBudgetCount: 2,
  status: 'ON_TRACK'
};

const mockCategories: BudgetCategory[] = [
  {
    id: '1',
    name: 'Medical Supplies',
    description: 'General medical supplies and consumables',
    fiscalYear: 2025,
    allocatedAmount: 350000,
    spentAmount: 285000,
    remainingAmount: 65000,
    utilizationPercentage: 81.4,
    status: 'ON_TRACK',
    isActive: true,
    department: 'Health Services',
    lastUpdated: '2025-01-15T10:00:00Z',
    transactions: []
  },
  {
    id: '2',
    name: 'Medications & Pharmaceuticals',
    description: 'Prescription drugs and over-the-counter medications',
    fiscalYear: 2025,
    allocatedAmount: 750000,
    spentAmount: 715000,
    remainingAmount: 35000,
    utilizationPercentage: 95.3,
    status: 'APPROACHING_LIMIT',
    isActive: true,
    department: 'Health Services',
    lastUpdated: '2025-01-15T10:00:00Z',
    transactions: []
  },
  {
    id: '3',
    name: 'Emergency & First Aid',
    description: 'Emergency response supplies and first aid equipment',
    fiscalYear: 2025,
    allocatedAmount: 125000,
    spentAmount: 138000,
    remainingAmount: -13000,
    utilizationPercentage: 110.4,
    status: 'OVER_BUDGET',
    isActive: true,
    department: 'Emergency Services',
    lastUpdated: '2025-01-15T10:00:00Z',
    transactions: []
  },
  {
    id: '4',
    name: 'Medical Equipment',
    description: 'Medical devices, diagnostic equipment, and maintenance',
    fiscalYear: 2025,
    allocatedAmount: 400000,
    spentAmount: 189000,
    remainingAmount: 211000,
    utilizationPercentage: 47.3,
    status: 'UNDER_BUDGET',
    isActive: true,
    department: 'Health Services',
    lastUpdated: '2025-01-15T10:00:00Z',
    transactions: []
  },
  {
    id: '5',
    name: 'Health Screenings',
    description: 'Annual health screenings and diagnostic services',
    fiscalYear: 2025,
    allocatedAmount: 200000,
    spentAmount: 148000,
    remainingAmount: 52000,
    utilizationPercentage: 74.0,
    status: 'ON_TRACK',
    isActive: true,
    department: 'Health Services',
    lastUpdated: '2025-01-15T10:00:00Z',
    transactions: []
  }
];

function getStatusBadgeVariant(status: BudgetStatus) {
  switch (status) {
    case 'UNDER_BUDGET': return 'info';
    case 'ON_TRACK': return 'success';
    case 'APPROACHING_LIMIT': return 'warning';
    case 'OVER_BUDGET': return 'danger';
    case 'CRITICAL': return 'danger';
    default: return 'secondary';
  }
}

function getStatusIcon(status: BudgetStatus) {
  switch (status) {
    case 'UNDER_BUDGET': return TrendingDown;
    case 'ON_TRACK': return CheckCircle;
    case 'APPROACHING_LIMIT': return AlertTriangle;
    case 'OVER_BUDGET': return TrendingUp;
    case 'CRITICAL': return AlertTriangle;
    default: return CheckCircle;
  }
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercentage(percentage: number) {
  return `${percentage.toFixed(1)}%`;
}

export function BudgetContent({ searchParams }: BudgetContentProps) {
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiscalYear, setSelectedFiscalYear] = useState(2025);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<BudgetStatus | 'ALL'>('ALL');

  const fiscalYears = [2023, 2024, 2025, 2026];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBudgetSummary(mockBudgetSummary);
      setCategories(mockCategories);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams, selectedFiscalYear]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterStatus === 'ALL' || category.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [categories, searchQuery, filterStatus]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <div className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Card>
          <div className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!budgetSummary) {
    return (
      <div className="text-center py-12">
        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Unable to load budget data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Fiscal Year Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
          <p className="text-gray-600">Healthcare facility financial oversight and budget tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Select fiscal year"
            >
              {fiscalYears.map((year) => (
                <option key={year} value={year}>
                  FY {year}
                </option>
              ))}
            </select>
          </div>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Allocated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetSummary.totalAllocated)}
                </p>
                <p className="text-xs text-gray-500">
                  FY {budgetSummary.fiscalYear}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Receipt className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetSummary.totalSpent)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(budgetSummary.utilizationPercentage)} utilized
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgetSummary.totalRemaining)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPercentage(100 - budgetSummary.utilizationPercentage)} available
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Budget Status</p>
                <Badge variant={getStatusBadgeVariant(budgetSummary.status)} className="text-sm">
                  {budgetSummary.status.replace('_', ' ')}
                </Badge>
                <p className="text-xs text-gray-500">
                  {budgetSummary.overBudgetCount} categories over budget
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              New Budget Category
            </Button>
            <Button variant="outline" className="justify-start">
              <Calculator className="h-4 w-4 mr-2" />
              Budget Planning
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="justify-start">
              <CreditCard className="h-4 w-4 mr-2" />
              Record Expense
            </Button>
          </div>
        </div>
      </Card>

      {/* Search and Filter */}
      <Card>
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Budget Categories</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search budget categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as BudgetStatus | 'ALL')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Filter by budget status"
            >
              <option value="ALL">All Status</option>
              <option value="UNDER_BUDGET">Under Budget</option>
              <option value="ON_TRACK">On Track</option>
              <option value="APPROACHING_LIMIT">Approaching Limit</option>
              <option value="OVER_BUDGET">Over Budget</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          {/* Budget Categories List */}
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const StatusIcon = getStatusIcon(category.status);
              
              return (
                <div 
                  key={category.id}
                  className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
                    category.status === 'OVER_BUDGET' || category.status === 'CRITICAL' 
                      ? 'border-red-200 bg-red-50' 
                      : category.status === 'APPROACHING_LIMIT'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`h-5 w-5 ${
                          category.status === 'OVER_BUDGET' || category.status === 'CRITICAL'
                            ? 'text-red-600'
                            : category.status === 'APPROACHING_LIMIT'
                            ? 'text-yellow-600'
                            : category.status === 'ON_TRACK'
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`} />
                        <h4 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(category.status)} className="text-xs">
                          {category.status.replace('_', ' ')}
                        </Badge>
                        {category.department && (
                          <Badge variant="secondary" className="text-xs">
                            {category.department}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {category.description}
                      </p>
                      
                      {/* Budget Progress Indicator */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Budget Utilization</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatPercentage(category.utilizationPercentage)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              category.utilizationPercentage > 100
                                ? 'bg-red-600 w-full'
                                : category.utilizationPercentage > 90
                                ? 'bg-yellow-600'
                                : category.utilizationPercentage > 75
                                ? 'bg-blue-600'
                                : 'bg-green-600'
                            } ${
                              category.utilizationPercentage <= 25 ? 'w-1/4' :
                              category.utilizationPercentage <= 50 ? 'w-2/4' :
                              category.utilizationPercentage <= 75 ? 'w-3/4' :
                              category.utilizationPercentage < 100 ? 'w-11/12' : 'w-full'
                            }`}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Allocated</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(category.allocatedAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Spent</p>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(category.spentAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Remaining</p>
                          <p className={`font-medium ${
                            category.remainingAmount < 0 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {formatCurrency(category.remainingAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Budget Analytics Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Department Allocation
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Health Services</p>
                    <p className="text-xs text-blue-700">85% of total budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-900">{formatCurrency(2125000)}</p>
                  <p className="text-xs text-blue-700">5 categories</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Emergency Services</p>
                    <p className="text-xs text-green-700">10% of total budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-900">{formatCurrency(250000)}</p>
                  <p className="text-xs text-green-700">2 categories</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Administration</p>
                    <p className="text-xs text-purple-700">5% of total budget</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-900">{formatCurrency(125000)}</p>
                  <p className="text-xs text-purple-700">3 categories</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Transactions
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Medical Supply Order</p>
                  <p className="text-xs text-gray-600">Healthcare Supplies Inc. - Jan 15</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="text-xs">Approved</Badge>
                  <p className="text-sm font-bold text-gray-900 mt-1">-{formatCurrency(15750)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Equipment Maintenance</p>
                  <p className="text-xs text-gray-600">MedTech Services - Jan 14</p>
                </div>
                <div className="text-right">
                  <Badge variant="warning" className="text-xs">Pending</Badge>
                  <p className="text-sm font-bold text-gray-900 mt-1">-{formatCurrency(8500)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Pharmaceutical Refill</p>
                  <p className="text-xs text-gray-600">PharmaCorp - Jan 13</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="text-xs">Approved</Badge>
                  <p className="text-sm font-bold text-gray-900 mt-1">-{formatCurrency(28300)}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button variant="outline" className="w-full text-sm">
                View All Transactions
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}