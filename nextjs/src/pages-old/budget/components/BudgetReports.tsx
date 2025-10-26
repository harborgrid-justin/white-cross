/**
 * BudgetReports Component - Budget reporting and export functionality
 */
import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { selectCurrentFiscalYear } from '../store/budgetSlice';
import { FileText, Download, Calendar } from 'lucide-react';

interface BudgetReportsProps {
  className?: string;
}

const BudgetReports: React.FC<BudgetReportsProps> = ({ className = '' }) => {
  const fiscalYear = useAppSelector(selectCurrentFiscalYear);

  const reports = [
    { name: 'Budget Summary Report', icon: FileText, description: 'Overview of all budget categories' },
    { name: 'Spending Analysis', icon: Calendar, description: 'Detailed spending breakdown by period' },
    { name: 'Variance Report', icon: FileText, description: 'Compare budgeted vs actual spending' },
    { name: 'Year-End Report', icon: FileText, description: 'Comprehensive fiscal year summary' },
  ];

  return (
    <div className={`budget-reports ${className}`}>
      <div className="card p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Budget Reports</h3>
        <p className="text-gray-600 mb-6">Fiscal Year {fiscalYear}</p>
        <div className="space-y-3">
          {reports.map((report, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <report.icon className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{report.name}</p>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
              <button className="btn-secondary flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BudgetReports;
