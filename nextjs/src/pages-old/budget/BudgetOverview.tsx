import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  PieChart,
  BarChart3,
  Calendar,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';

// Types
interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  percentageUsed: number;
  varianceFromLastYear: number;
  projectedEndOfYear: number;
}

interface DepartmentBudget {
  id: string;
  name: string;
  allocatedBudget: number;
  spentAmount: number;
  remainingBudget: number;
  percentageUsed: number;
  status: 'on-track' | 'warning' | 'over-budget';
  lastUpdated: Date;
}

interface BudgetAlert {
  id: string;
  department: string;
  type: 'overspend' | 'approaching-limit' | 'budget-exceeded';
  message: string;
  severity: 'low' | 'medium' | 'high';
  amount: number;
  createdAt: Date;
}

// Mock data
const mockBudgetSummary: BudgetSummary = {
  totalBudget: 5500000,
  totalSpent: 3850000,
  totalRemaining: 1650000,
  percentageUsed: 70,
  varianceFromLastYear: -8.5,
  projectedEndOfYear: 5200000
};

const mockDepartmentBudgets: DepartmentBudget[] = [
  {
    id: '1',
    name: 'Emergency Department',
    allocatedBudget: 1200000,
    spentAmount: 980000,
    remainingBudget: 220000,
    percentageUsed: 81.7,
    status: 'warning',
    lastUpdated: new Date('2024-01-20T10:30:00')
  },
  {
    id: '2',
    name: 'Cardiology',
    allocatedBudget: 850000,
    spentAmount: 567000,
    remainingBudget: 283000,
    percentageUsed: 66.7,
    status: 'on-track',
    lastUpdated: new Date('2024-01-20T14:15:00')
  },
  {
    id: '3',
    name: 'Surgery',
    allocatedBudget: 1100000,
    spentAmount: 1150000,
    remainingBudget: -50000,
    percentageUsed: 104.5,
    status: 'over-budget',
    lastUpdated: new Date('2024-01-20T16:45:00')
  },
  {
    id: '4',
    name: 'Radiology',
    allocatedBudget: 600000,
    spentAmount: 380000,
    remainingBudget: 220000,
    percentageUsed: 63.3,
    status: 'on-track',
    lastUpdated: new Date('2024-01-20T11:20:00')
  },
  {
    id: '5',
    name: 'Laboratory',
    allocatedBudget: 450000,
    spentAmount: 285000,
    remainingBudget: 165000,
    percentageUsed: 63.3,
    status: 'on-track',
    lastUpdated: new Date('2024-01-20T13:30:00')
  },
  {
    id: '6',
    name: 'IT Department',
    allocatedBudget: 300000,
    spentAmount: 245000,
    remainingBudget: 55000,
    percentageUsed: 81.7,
    status: 'warning',
    lastUpdated: new Date('2024-01-20T09:15:00')
  }
];

const mockBudgetAlerts: BudgetAlert[] = [
  {
    id: '1',
    department: 'Surgery',
    type: 'budget-exceeded',
    message: 'Surgery department has exceeded budget by $50,000',
    severity: 'high',
    amount: 50000,
    createdAt: new Date('2024-01-20T16:45:00')
  },
  {
    id: '2',
    department: 'Emergency Department',
    type: 'approaching-limit',
    message: 'Emergency Department has used 82% of allocated budget',
    severity: 'medium',
    amount: 220000,
    createdAt: new Date('2024-01-20T10:30:00')
  },
  {
    id: '3',
    department: 'IT Department',
    type: 'approaching-limit',
    message: 'IT Department approaching budget limit - 82% used',
    severity: 'medium',
    amount: 55000,
    createdAt: new Date('2024-01-20T09:15:00')
  }
];

export const BudgetOverview: React.FC = () => {
  const [budgetSummary] = useState<BudgetSummary>(mockBudgetSummary);
  const [departmentBudgets] = useState<DepartmentBudget[]>(mockDepartmentBudgets);
  const [budgetAlerts] = useState<BudgetAlert[]>(mockBudgetAlerts);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current-year');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: DepartmentBudget['status']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (status) {
      case 'on-track':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'over-budget':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status: DepartmentBudget['status']) => {
    switch (status) {
      case 'on-track': return 'On Track';
      case 'warning': return 'Warning';
      case 'over-budget': return 'Over Budget';
      default: return 'Unknown';
    }
  };

  const getSeverityBadge = (severity: BudgetAlert['severity']) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (severity) {
      case 'low':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getProgressBarColor = (percentageUsed: number) => {
    if (percentageUsed > 100) return 'bg-red-500';
    if (percentageUsed > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      setError('Failed to refresh budget data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Overview</h1>
          <p className="text-gray-600 mt-1">Monitor departmental budgets and financial performance</p>
        </div>
        <div className="flex gap-3">
          <select
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            title="Select time period"
          >
            <option value="current-year">Current Year</option>
            <option value="current-quarter">Current Quarter</option>
            <option value="current-month">Current Month</option>
            <option value="last-year">Last Year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      )}

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetSummary.totalBudget)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetSummary.totalSpent)}</p>
              <p className="text-sm text-gray-500">{budgetSummary.percentageUsed}% used</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetSummary.totalRemaining)}</p>
              <p className="text-sm text-gray-500">{100 - budgetSummary.percentageUsed}% left</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Projected EOY</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(budgetSummary.projectedEndOfYear)}</p>
              <p className={`text-sm ${budgetSummary.varianceFromLastYear < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {budgetSummary.varianceFromLastYear > 0 ? '+' : ''}{budgetSummary.varianceFromLastYear}% vs last year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Budget Alerts</h3>
              <span className="ml-2 bg-red-100 text-red-800 text-sm px-2 py-1 rounded-full">
                {budgetAlerts.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {budgetAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500">
                        {alert.department} • {formatDate(alert.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{formatCurrency(alert.amount)}</span>
                    <span className={getSeverityBadge(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Department Budgets */}
      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Department Budget Status</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocated Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remaining
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departmentBudgets.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(dept.allocatedBudget)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(dept.spentAmount)}</div>
                    <div className="text-xs text-gray-500">{dept.percentageUsed.toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${dept.remainingBudget < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {formatCurrency(dept.remainingBudget)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressBarColor(dept.percentageUsed)}`}
                        style={{ width: `${Math.min(dept.percentageUsed, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{dept.percentageUsed.toFixed(1)}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(dept.status)}>
                      {getStatusText(dept.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(dept.lastUpdated)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BudgetOverview;
