/**
 * Billing Management Overview Parallel Route
 * 
 * Displays billing overview statistics and key metrics
 * Rendered in the @overview slot of the management layout
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle,
  AlertTriangle 
} from 'lucide-react';

export default function BillingOverview() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalRevenue: 45650.00,
    revenueChange: 12.5,
    pendingAmount: 8750.00,
    overdueAmount: 2340.00,
    invoicesCount: 124,
    paidInvoices: 98,
    pendingInvoices: 18,
    overdueInvoices: 8
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Revenue Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Monthly Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(stats.totalRevenue)}
            </span>
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <TrendingUp className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-600 font-medium">
              +{stats.revenueChange}% from last month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Status Cards */}
      <div className="grid grid-cols-1 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {stats.paidInvoices}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">
                {stats.pendingInvoices}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <Badge className="bg-red-100 text-red-800">
                {stats.overdueInvoices}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Amounts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Outstanding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Pending</span>
            <span className="text-sm font-medium text-yellow-600">
              {formatCurrency(stats.pendingAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Overdue</span>
            <span className="text-sm font-medium text-red-600">
              {formatCurrency(stats.overdueAmount)}
            </span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Total</span>
              <span className="text-sm font-bold text-gray-900">
                {formatCurrency(stats.pendingAmount + stats.overdueAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            This Month
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Invoices Created</span>
            <span className="text-sm font-medium">{stats.invoicesCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Collection Rate</span>
            <span className="text-sm font-medium text-green-600">
              {Math.round((stats.paidInvoices / stats.invoicesCount) * 100)}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Avg. Payment Time</span>
            <span className="text-sm font-medium">12 days</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
