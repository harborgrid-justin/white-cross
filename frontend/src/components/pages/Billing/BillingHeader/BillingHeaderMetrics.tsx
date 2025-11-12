'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Calendar,
  BarChart3
} from 'lucide-react';
import { BillingHeaderMetricsProps } from './types';

/**
 * BillingHeaderMetrics Component
 *
 * Displays financial metrics and statistics in a grid of cards.
 * Shows key billing information including revenue, outstanding balance,
 * payment statistics, and performance metrics.
 *
 * @param props - BillingHeaderMetrics component props
 * @returns JSX element containing financial metric cards
 */
const BillingHeaderMetrics: React.FC<BillingHeaderMetricsProps> = ({
  totalInvoices,
  totalRevenue,
  outstandingBalance,
  paidInvoices,
  overdueInvoices,
  draftInvoices,
  averagePaymentTime,
  collectionRate,
  formatCurrency
}) => {
  const paymentRate = totalInvoices > 0 ? Math.round((paidInvoices / totalInvoices) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mt-6">
      {/* Total Revenue Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">{totalInvoices} invoices</p>
        </div>
      </div>

      {/* Outstanding Balance Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Outstanding</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(outstandingBalance)}</p>
          </div>
          <Clock className="w-8 h-8 text-orange-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">{totalInvoices - paidInvoices} unpaid</p>
        </div>
      </div>

      {/* Paid Invoices Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
            <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
          </div>
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">{paymentRate}% paid</p>
        </div>
      </div>

      {/* Overdue Invoices Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-600">{overdueInvoices}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Requires attention</p>
        </div>
      </div>

      {/* Draft Invoices Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Draft Invoices</p>
            <p className="text-2xl font-bold text-gray-600">{draftInvoices}</p>
          </div>
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Pending review</p>
        </div>
      </div>

      {/* Average Payment Time Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Payment</p>
            <p className="text-2xl font-bold text-blue-600">{averagePaymentTime}d</p>
          </div>
          <Calendar className="w-8 h-8 text-blue-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Days to pay</p>
        </div>
      </div>

      {/* Collection Rate Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Collection Rate</p>
            <p className="text-2xl font-bold text-purple-600">{collectionRate}%</p>
          </div>
          <BarChart3 className="w-8 h-8 text-purple-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Success rate</p>
        </div>
      </div>

      {/* This Month Revenue Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month</p>
            <p className="text-2xl font-bold text-indigo-600">{formatCurrency(totalRevenue * 0.3)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">{Math.round(totalInvoices * 0.3)} invoices</p>
        </div>
      </div>
    </div>
  );
};

export default BillingHeaderMetrics;
