/**
 * Billing Section Not Found Page
 * 
 * Displays when a billing-related route is not found.
 * Provides contextual navigation back to billing features.
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileSearch, 
  DollarSign, 
  FileText, 
  CreditCard, 
  BarChart3,
  ArrowLeft,
  Home
} from 'lucide-react';

export default function BillingNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <FileSearch className="h-10 w-10 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Billing Page Not Found
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-400">
            The billing page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/billing">
              <Button variant="default" className="w-full h-auto p-4">
                <div className="flex flex-col items-center space-y-2">
                  <DollarSign className="h-6 w-6" />
                  <span className="font-medium">Billing Dashboard</span>
                  <span className="text-xs opacity-75">Main billing overview</span>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/billing/invoices">
              <Button variant="secondary" className="w-full h-auto p-4">
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-medium">Invoices</span>
                  <span className="text-xs opacity-75">View and manage invoices</span>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/billing/payments">
              <Button variant="secondary" className="w-full h-auto p-4">
                <div className="flex flex-col items-center space-y-2">
                  <CreditCard className="h-6 w-6" />
                  <span className="font-medium">Payments</span>
                  <span className="text-xs opacity-75">Payment processing</span>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/billing/reports">
              <Button variant="secondary" className="w-full h-auto p-4">
                <div className="flex flex-col items-center space-y-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="font-medium">Reports</span>
                  <span className="text-xs opacity-75">Financial reports</span>
                </div>
              </Button>
            </Link>
          </div>

          {/* Popular Billing Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Popular Billing Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/dashboard/billing/invoices/new">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-3" />
                  Create New Invoice
                </Button>
              </Link>
              <Link href="/dashboard/billing/payments">
                <Button variant="ghost" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-3" />
                  Process Payment
                </Button>
              </Link>
              <Link href="/dashboard/billing/outstanding">
                <Button variant="ghost" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-3" />
                  Outstanding Balances
                </Button>
              </Link>
              <Link href="/dashboard/billing/settings">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Billing Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Link href="/dashboard/billing" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Billing
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Dashboard Home
              </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If you believe this page should exist, please contact your system administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
