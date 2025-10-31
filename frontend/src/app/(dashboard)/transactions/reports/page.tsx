import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  DollarSign,
  CreditCard,
  AlertCircle,
  BarChart3
} from 'lucide-react';

export default function TransactionReportsPage() {
  const reports = [
    {
      id: '1',
      name: 'Monthly Financial Summary',
      description: 'Comprehensive monthly revenue and transaction analysis',
      type: 'financial',
      lastGenerated: '2024-10-31',
      status: 'ready',
      format: 'PDF',
      icon: DollarSign,
    },
    {
      id: '2',
      name: 'Transaction Audit Report',
      description: 'Detailed audit trail of all financial transactions',
      type: 'audit',
      lastGenerated: '2024-10-30',
      status: 'ready',
      format: 'Excel',
      icon: FileText,
    },
    {
      id: '3',
      name: 'Insurance Claims Analysis',
      description: 'Insurance claims processing and reimbursement tracking',
      type: 'insurance',
      lastGenerated: '2024-10-29',
      status: 'generating',
      format: 'PDF',
      icon: CreditCard,
    },
    {
      id: '4',
      name: 'Revenue Trends Report',
      description: 'Year-over-year revenue analysis and forecasting',
      type: 'analytics',
      lastGenerated: '2024-10-28',
      status: 'ready',
      format: 'PDF',
      icon: TrendingUp,
    },
    {
      id: '5',
      name: 'Outstanding Balances',
      description: 'Report of all pending payments and overdue accounts',
      type: 'collections',
      lastGenerated: '2024-10-31',
      status: 'ready',
      format: 'Excel',
      icon: AlertCircle,
    },
    {
      id: '6',
      name: 'Payment Methods Analysis',
      description: 'Breakdown of payment methods and processing fees',
      type: 'analytics',
      lastGenerated: '2024-10-30',
      status: 'ready',
      format: 'PDF',
      icon: BarChart3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'warning';
      case 'failed': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'financial': return 'text-green-600 bg-green-50';
      case 'audit': return 'text-blue-600 bg-blue-50';
      case 'insurance': return 'text-purple-600 bg-purple-50';
      case 'analytics': return 'text-orange-600 bg-orange-50';
      case 'collections': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
        <p className="text-gray-600">
          Generate and download financial reports and analytics
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">$45,230</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">1,247</div>
              <div className="text-sm text-gray-600">Transactions</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Insurance Claims</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">$2,340</div>
              <div className="text-sm text-gray-600">Outstanding</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Reports Grid */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Reports</h2>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="p-4 border border-gray-200">
                <div className="space-y-4">
                  {/* Report Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <report.icon className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Report Metadata */}
                  <div className="flex items-center gap-4 text-sm">
                    <Badge variant="secondary" className={getTypeColor(report.type)}>
                      {report.type}
                    </Badge>
                    <Badge variant={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <span className="text-gray-500">
                      {report.format}
                    </span>
                  </div>

                  {/* Last Generated */}
                  <div className="text-sm text-gray-500">
                    Last generated: {new Date(report.lastGenerated).toLocaleDateString()}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                    <Button 
                      variant="primary" 
                      size="sm"
                      disabled={report.status === 'generating'}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={report.status === 'generating'}
                    >
                      Regenerate
                    </Button>
                    
                    {report.status === 'generating' && (
                      <div className="flex items-center gap-2 text-sm text-yellow-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                        Generating...
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Custom Report Builder */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Custom Report Builder</h2>
          <p className="text-gray-600">
            Create custom financial reports with specific date ranges and filters
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <div className="flex gap-2">
                <input 
                  type="date" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  aria-label="Start date"
                />
                <input 
                  type="date" 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  aria-label="End date"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                aria-label="Select report type"
              >
                <option>Financial Summary</option>
                <option>Transaction Details</option>
                <option>Insurance Claims</option>
                <option>Revenue Analysis</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Format</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                aria-label="Select report format"
              >
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          
          <Button className="w-full md:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Generate Custom Report
          </Button>
        </div>
      </Card>
    </div>
  );
}