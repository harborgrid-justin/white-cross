'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/layout/Card';
import { DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Billing & Invoices"
        description="Manage invoices, payments, and billing reports"
      />

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-orange-600 mt-2">$0.00</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-600 mt-2">$0.00</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">$0.00</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/billing/invoices">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <FileText className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Invoices</h3>
              <p className="text-sm text-gray-600">
                View and manage all invoices
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/billing/payments">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <DollarSign className="h-8 w-8 text-green-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Payments</h3>
              <p className="text-sm text-gray-600">
                Track payments and transactions
              </p>
            </div>
          </Card>
        </Link>

        <Link href="/billing/outstanding">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <div className="p-6">
              <AlertTriangle className="h-8 w-8 text-orange-500 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Outstanding</h3>
              <p className="text-sm text-gray-600">
                View overdue and pending invoices
              </p>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
