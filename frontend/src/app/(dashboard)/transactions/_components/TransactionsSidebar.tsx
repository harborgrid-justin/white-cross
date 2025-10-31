'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  Plus,
  FileText,
  CreditCard,
  Calendar,
  RefreshCcw,
  Download,
  Eye
} from 'lucide-react';
import { 
  FinancialSummary,
  transactionUtils,
  mockTransactions 
} from '../data';

interface TransactionsSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    minAmount?: string;
    maxAmount?: string;
    studentId?: string;
    paymentMethod?: string;
  };
}

export function TransactionsSidebar({ searchParams }: TransactionsSidebarProps) {
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const calculateSummary = async () => {
      try {
        setIsLoading(true);
        
        // Apply current filters
        const filters = {
          searchQuery: searchParams.search,
          type: searchParams.type ? [searchParams.type as 'payment' | 'refund' | 'fee' | 'insurance' | 'copay' | 'adjustment' | 'discount' | 'write_off'] : undefined,
          status: searchParams.status ? [searchParams.status as 'pending' | 'completed' | 'cancelled' | 'refunded' | 'disputed' | 'under_review'] : undefined,
          paymentMethod: searchParams.paymentMethod ? [searchParams.paymentMethod as 'cash' | 'check' | 'credit_card' | 'debit_card' | 'insurance' | 'bank_transfer' | 'other'] : undefined,
          studentId: searchParams.studentId,
          dateRange: searchParams.dateFrom && searchParams.dateTo ? {
            startDate: new Date(searchParams.dateFrom),
            endDate: new Date(searchParams.dateTo),
          } : undefined,
          amountRange: searchParams.minAmount && searchParams.maxAmount ? {
            min: parseFloat(searchParams.minAmount),
            max: parseFloat(searchParams.maxAmount),
          } : undefined,
        };
        
        const filteredTransactions = transactionUtils.applyFilters(mockTransactions, filters);
        const calculatedSummary = transactionUtils.calculateSummary(filteredTransactions);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setSummary(calculatedSummary);
      } catch (error) {
        console.error('Error calculating summary:', error);
      } finally {
        setIsLoading(false);
      }
    };

    calculateSummary();
  }, [searchParams]);

  const recentActivity = [
    {
      id: '1',
      type: 'payment_received',
      description: 'Payment received from John Doe',
      amount: 150.00,
      timestamp: '2 minutes ago',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      id: '2',
      type: 'refund_processed',
      description: 'Refund processed for Jane Smith',
      amount: -75.00,
      timestamp: '15 minutes ago',
      icon: RefreshCcw,
      color: 'text-blue-600',
    },
    {
      id: '3',
      type: 'insurance_claim',
      description: 'Insurance claim submitted',
      amount: 200.00,
      timestamp: '1 hour ago',
      icon: FileText,
      color: 'text-purple-600',
    },
    {
      id: '4',
      type: 'disputed_transaction',
      description: 'Transaction dispute filed',
      amount: 95.00,
      timestamp: '3 hours ago',
      icon: AlertCircle,
      color: 'text-red-600',
    },
  ];

  const pendingReviews = [
    {
      id: '1',
      transactionNumber: 'TXN-20241031-A1B2',
      description: 'High-value payment verification',
      amount: 1500.00,
      priority: 'high',
    },
    {
      id: '2',
      transactionNumber: 'TXN-20241031-C3D4',
      description: 'Insurance claim review',
      amount: 450.00,
      priority: 'medium',
    },
    {
      id: '3',
      transactionNumber: 'TXN-20241030-E5F6',
      description: 'Refund authorization needed',
      amount: 200.00,
      priority: 'low',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Financial Summary */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Summary
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
          
          {summary && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {transactionUtils.formatCurrency(summary.totalRevenue)}
                </div>
                <div className="text-xs text-gray-600">Total Revenue</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {summary.completedTransactions}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {summary.pendingTransactions}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-purple-600">
                  {summary.insuranceClaimsCount}
                </div>
                <div className="text-xs text-gray-600">Insurance Claims</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-red-600">
                  {transactionUtils.formatCurrency(summary.outstandingBalance)}
                </div>
                <div className="text-xs text-gray-600">Outstanding</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-600">
                  {transactionUtils.formatCurrency(summary.averageTransactionAmount)}
                </div>
                <div className="text-xs text-gray-600">Average Amount</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-full ${activity.color} bg-opacity-10`}>
                  <activity.icon className={`h-4 w-4 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 truncate">
                    {activity.description}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    <span className={`text-sm font-medium ${activity.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {activity.amount > 0 ? '+' : ''}{transactionUtils.formatCurrency(Math.abs(activity.amount))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Activity
          </Button>
        </div>
      </Card>

      {/* Pending Reviews */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Reviews
            </h3>
            <Badge variant="warning">{pendingReviews.length}</Badge>
          </div>
          
          <div className="space-y-3">
            {pendingReviews.map((review) => (
              <div key={review.id} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {review.transactionNumber}
                  </span>
                  <Badge 
                    variant="secondary"
                    className={getPriorityColor(review.priority)}
                  >
                    {review.priority}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  {review.description}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    {transactionUtils.formatCurrency(review.amount)}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Reviews
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Process Refund
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Insurance Claim
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Monthly Revenue Chart */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Monthly Revenue
            </h3>
            <Button variant="ghost" size="sm">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          
          {summary && (
            <div className="space-y-3">
              <div className="flex items-end justify-between gap-2 h-32">
                {summary.monthlyRevenue.slice(0, 6).map((month, index) => {
                  const maxRevenue = Math.max(...summary.monthlyRevenue.map(m => m.revenue));
                  const height = (month.revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="flex-1 flex items-end">
                        <div 
                          className={`w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600 ${
                            height > 75 ? 'h-full' : 
                            height > 50 ? 'h-3/4' : 
                            height > 25 ? 'h-1/2' : 'h-1/4'
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between">
                {summary.monthlyRevenue.slice(0, 6).map((month, index) => (
                  <div key={index} className="text-xs text-gray-500 text-center">
                    {month.month.slice(0, 3)}
                  </div>
                ))}
              </div>
              
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {transactionUtils.formatCurrency(summary.totalRevenue)}
                </div>
                <div className="text-xs text-gray-500">YTD Revenue</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Systems
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Credit Card Processing</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Bank Transfers</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Insurance Claims</span>
              <Badge variant="warning">Limited</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Check Processing</span>
              <Badge variant="success">Online</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}