import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  BarChart3
} from 'lucide-react';

// Types
interface BudgetReport {
  id: string;
  name: string;
  type: 'monthly' | 'quarterly' | 'annual';
  generatedDate: Date;
  period: string;
  status: 'ready' | 'generating' | 'failed';
  size: string;
}

const mockReports: BudgetReport[] = [
  {
    id: '1',
    name: 'Monthly Budget Report - January 2024',
    type: 'monthly',
    generatedDate: new Date('2024-01-31T09:00:00'),
    period: 'January 2024',
    status: 'ready',
    size: '2.4 MB'
  },
  {
    id: '2',
    name: 'Q4 2023 Budget Analysis',
    type: 'quarterly',
    generatedDate: new Date('2024-01-15T14:30:00'),
    period: 'Q4 2023',
    status: 'ready',
    size: '5.1 MB'
  }
];

export const BudgetReports: React.FC = () => {
  const [reports] = useState<BudgetReport[]>(mockReports);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date);
  };

  const getReportIcon = (type: BudgetReport['type']) => {
    switch (type) {
      case 'monthly': return <Calendar className="w-4 h-4" />;
      case 'quarterly': return <BarChart3 className="w-4 h-4" />;
      case 'annual': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download budget reports</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Generate Report
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-blue-600 mr-3">
                        {getReportIcon(report.type)}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{report.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(report.generatedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Download className="w-4 h-4" />
                      Download
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
};

export default BudgetReports;
