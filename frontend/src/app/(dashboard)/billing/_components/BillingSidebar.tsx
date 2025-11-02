/**
 * BillingSidebar Component - White Cross Healthcare Platform
 * 
 * Healthcare billing sidebar featuring:
 * - Financial overview and quick statistics
 * - Insurance provider management
 * - Billing workflow shortcuts
 * - Recent activity tracking
 * - Compliance monitoring tools
 * 
 * @component BillingSidebar
 */

'use client';

import React from 'react';
import { 
  DollarSign, 
  CreditCard, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Building,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function BillingSidebar() {
  return (
    <div className="space-y-6">
      {/* Quick Financial Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today&apos;s Billing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Invoices</span>
              <Badge className="bg-blue-100 text-blue-800">8</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Payments Received</span>
              <Badge className="bg-green-100 text-green-800">12</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Claims Submitted</span>
              <Badge className="bg-yellow-100 text-yellow-800">5</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Overdue Items</span>
              <Badge className="bg-red-100 text-red-800">3</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insurance Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Insurance Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Blue Cross Blue Shield', claims: 24, status: 'active' },
              { name: 'Aetna Health', claims: 18, status: 'active' },
              { name: 'United Healthcare', claims: 15, status: 'pending' },
              { name: 'Cigna Health', claims: 12, status: 'active' },
              { name: 'Kaiser Permanente', claims: 8, status: 'review' }
            ].map((provider, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="text-xs font-medium text-gray-900">{provider.name}</div>
                    <div className="text-xs text-gray-500">{provider.claims} claims</div>
                  </div>
                </div>
                <Badge className={
                  provider.status === 'active' ? 'bg-green-100 text-green-800' :
                  provider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                icon: CheckCircle, 
                text: 'Payment received from Blue Cross', 
                amount: '$125.00', 
                time: '2 min ago',
                type: 'success'
              },
              { 
                icon: FileText, 
                text: 'New claim submitted for Emma Johnson', 
                amount: '$285.00', 
                time: '15 min ago',
                type: 'info'
              },
              { 
                icon: AlertTriangle, 
                text: 'Claim denied - missing documentation', 
                amount: '$45.00', 
                time: '1 hour ago',
                type: 'warning'
              },
              { 
                icon: DollarSign, 
                text: 'Invoice approved by United Healthcare', 
                amount: '$75.00', 
                time: '2 hours ago',
                type: 'success'
              }
            ].map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${
                    activity.type === 'success' ? 'bg-green-100' :
                    activity.type === 'warning' ? 'bg-yellow-100' :
                    'bg-blue-100'
                  }`}>
                    <IconComponent className={`h-3 w-3 ${
                      activity.type === 'success' ? 'text-green-600' :
                      activity.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-900">{activity.text}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-medium text-green-600">{activity.amount}</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
              <span className="text-sm font-medium">$24,580</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-gray-600">Invoices</span>
              </div>
              <span className="text-sm font-medium">156</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600">Paid</span>
              </div>
              <span className="text-sm font-medium">124</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
              <span className="text-sm font-medium">28</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-gray-600">Overdue</span>
              </div>
              <span className="text-sm font-medium">4</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start text-left">
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <CreditCard className="h-4 w-4 mr-2" />
              Process Payment
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <FileText className="h-4 w-4 mr-2" />
              Submit Claim
            </Button>
            <Button variant="outline" className="w-full justify-start text-left">
              <Calendar className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">HIPAA Compliance</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Billing Audit</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Current
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Insurance Verification</span>
              <Badge className="bg-yellow-100 text-yellow-800">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Financial Reconciliation</span>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


