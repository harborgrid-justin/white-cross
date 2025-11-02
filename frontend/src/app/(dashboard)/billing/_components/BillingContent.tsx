/**
 * BillingContent Component - White Cross Healthcare Platform
 * 
 * Comprehensive healthcare billing management interface featuring:
 * - Insurance claims processing and tracking
 * - Student billing and payment management  
 * - Healthcare service billing workflows
 * - Financial reporting and analytics
 * - HIPAA-compliant billing operations
 * 
 * @component BillingContent
 */

'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Send,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  getBillingDashboardData,
  getBillingStats,
  type BillingRecord,
  type BillingStats
} from '@/lib/actions/billing.actions';

// Healthcare billing types imported from server actions

export default function BillingContent() {
  const [billingRecords, setBillingRecords] = useState<BillingRecord[]>([]);
  const [stats, setStats] = useState<BillingStats>({
    totalBilled: 0,
    totalPaid: 0,
    totalPending: 0,
    totalOverdue: 0,
    claimsPending: 0,
    claimsApproved: 0,
    claimsDenied: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Load billing data using server actions
  useEffect(() => {
    const loadBillingData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getBillingDashboardData();
        
        setBillingRecords(dashboardData.billingRecords);
        setStats(dashboardData.stats);
      } catch (error) {
        console.error('Error loading billing data:', error);
        // Set empty data on error
        setBillingRecords([]);
        setStats({
          totalBilled: 0,
          totalPaid: 0,
          totalPending: 0,
          totalOverdue: 0,
          claimsPending: 0,
          claimsApproved: 0,
          claimsDenied: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadBillingData();
  }, []);

  // Filter billing records
  const filteredRecords = billingRecords.filter(record => {
    const matchesSearch = searchTerm.length < 2 || 
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    const matchesService = serviceFilter === 'all' || record.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  // Status badge styling
  const getStatusBadge = (status: string) => {
    const styles = {
      'paid': 'bg-green-100 text-green-800',
      'approved': 'bg-blue-100 text-blue-800',
      'submitted': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-orange-100 text-orange-800',
      'draft': 'bg-gray-100 text-gray-800',
      'denied': 'bg-red-100 text-red-800',
      'partial': 'bg-purple-100 text-purple-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Service type formatting
  const formatServiceType = (serviceType: string) => {
    return serviceType.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Currency formatting
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Date formatting
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Billed</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalBilled)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalOverdue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Management */}
      <div className="space-y-6">
        {/* Filters */}
        <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search invoices, students, or claims..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <select 
                      value={statusFilter} 
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-select rounded-md border-gray-300"
                      title="Filter by billing status"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="approved">Approved</option>
                      <option value="paid">Paid</option>
                      <option value="denied">Denied</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </div>

                  <select 
                    value={serviceFilter} 
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="form-select rounded-md border-gray-300"
                    title="Filter by service type"
                  >
                    <option value="all">All Services</option>
                    <option value="medical-consultation">Medical Consultation</option>
                    <option value="immunization">Immunization</option>
                    <option value="emergency-care">Emergency Care</option>
                    <option value="medication-dispensing">Medication Dispensing</option>
                    <option value="routine-checkup">Routine Checkup</option>
                  </select>
                </div>

                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="default" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Invoice
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        {/* Billing Records Table */}
        <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Healthcare Billing Records {filteredRecords.length}
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredRecords.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No billing records found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button variant="default">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Billing Record
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{record.id}</div>
                              {record.claimNumber && (
                                <div className="text-xs text-gray-500">Claim: {record.claimNumber}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{record.studentName}</div>
                              <div className="text-sm text-gray-500">{record.studentId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatServiceType(record.serviceType)}
                              </div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {record.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(record.amount)}
                            </div>
                            {record.insuranceProvider && (
                              <div className="text-xs text-gray-500">{record.insuranceProvider}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(record.dueDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              {record.status === 'draft' && (
                                <Button variant="outline" size="sm">
                                  <Send className="h-3 w-3 mr-1" />
                                  Submit
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
}



