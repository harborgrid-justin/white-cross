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
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BillingSidebar() {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-1">
        {/* Quick Financial Stats */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Today&apos;s Billing</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">New Invoices</span>
                <Badge className="bg-blue-100 text-blue-800 text-xs">8</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Payments Received</span>
                <Badge className="bg-green-100 text-green-800 text-xs">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Claims Submitted</span>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">5</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Overdue Items</span>
                <Badge className="bg-red-100 text-red-800 text-xs">3</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Providers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Insurance Providers</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {[
                { name: 'Blue Cross Blue Shield', claims: 24, status: 'active' },
                { name: 'Aetna Health', claims: 18, status: 'active' },
                { name: 'United Healthcare', claims: 15, status: 'pending' },
                { name: 'Cigna Health', claims: 12, status: 'active' },
                { name: 'Kaiser Permanente', claims: 8, status: 'review' }
              ].map((provider, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Building className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-gray-900 truncate">{provider.name}</div>
                      <div className="text-xs text-gray-500">{provider.claims} claims</div>
                    </div>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ml-2 ${
                    provider.status === 'active' ? 'bg-green-100 text-green-800' :
                    provider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {provider.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
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
                  <div key={index} className="flex items-start space-x-2">
                    <div className={`p-1 rounded-full flex-shrink-0 ${
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
                      <div className="text-xs text-gray-900 line-clamp-2">{activity.text}</div>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-gray-600">Revenue</span>
                </div>
                <span className="text-xs font-medium">$24,580</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="h-3 w-3 text-blue-600" />
                  <span className="text-xs text-gray-600">Invoices</span>
                </div>
                <span className="text-xs font-medium">156</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-gray-600">Paid</span>
                </div>
                <span className="text-xs font-medium">124</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-3 w-3 text-yellow-600" />
                  <span className="text-xs text-gray-600">Pending</span>
                </div>
                <span className="text-xs font-medium">28</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-3 w-3 text-red-600" />
                  <span className="text-xs text-gray-600">Overdue</span>
                </div>
                <span className="text-xs font-medium">4</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-left h-8 text-xs" size="sm">
                <Plus className="h-3 w-3 mr-2" />
                Create Invoice
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-8 text-xs" size="sm">
                <CreditCard className="h-3 w-3 mr-2" />
                Process Payment
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-8 text-xs" size="sm">
                <FileText className="h-3 w-3 mr-2" />
                Submit Claim
              </Button>
              <Button variant="outline" className="w-full justify-start text-left h-8 text-xs" size="sm">
                <Calendar className="h-3 w-3 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">HIPAA Compliance</span>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <CheckCircle className="h-2 w-2 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Billing Audit</span>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <CheckCircle className="h-2 w-2 mr-1" />
                  Current
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Insurance Verification</span>
                <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                  <Clock className="h-2 w-2 mr-1" />
                  Pending
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Financial Reconciliation</span>
                <Badge className="bg-green-100 text-green-800 text-xs">
                  <CheckCircle className="h-2 w-2 mr-1" />
                  Complete
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
