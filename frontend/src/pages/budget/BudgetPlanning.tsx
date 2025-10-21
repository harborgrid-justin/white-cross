import React, { useState } from 'react';
import { 
  Calculator, 
  Plus, 
  Save, 
  Download,
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

// Types
interface BudgetPlan {
  id: string;
  department: string;
  currentBudget: number;
  proposedBudget: number;
  justification: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
}

const mockBudgetPlans: BudgetPlan[] = [
  {
    id: '1',
    department: 'Emergency Department',
    currentBudget: 1200000,
    proposedBudget: 1350000,
    justification: 'Increased patient volume and equipment needs',
    status: 'draft'
  },
  {
    id: '2',
    department: 'IT Department',
    currentBudget: 300000,
    proposedBudget: 420000,
    justification: 'Infrastructure upgrades and cybersecurity improvements',
    status: 'submitted'
  }
];

export const BudgetPlanning: React.FC = () => {
  const [budgetPlans] = useState<BudgetPlan[]>(mockBudgetPlans);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Planning</h1>
          <p className="text-gray-600 mt-1">Plan and manage departmental budgets</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Budget Plan
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Budget Plans</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposed Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {budgetPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{plan.department}</div>
                    <div className="text-sm text-gray-500">{plan.justification}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(plan.currentBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(plan.proposedBudget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-green-600">
                      +{formatCurrency(plan.proposedBudget - plan.currentBudget)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(((plan.proposedBudget - plan.currentBudget) / plan.currentBudget) * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      plan.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      plan.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
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

export default BudgetPlanning;
