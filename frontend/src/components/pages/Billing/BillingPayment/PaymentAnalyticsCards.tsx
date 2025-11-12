'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from './utils';

/**
 * Props for the PaymentAnalyticsCards component
 */
interface PaymentAnalyticsCardsProps {
  /** Total payments count */
  totalPayments: number;
  /** Total payment amount */
  totalAmount: number;
  /** Total refunds amount */
  totalRefunds: number;
  /** Pending payments count */
  pendingPayments: number;
  /** Failed payments count */
  failedPayments: number;
  /** Success rate percentage */
  successRate: number;
}

/**
 * PaymentAnalyticsCards Component
 *
 * Displays key payment metrics and analytics in card format.
 *
 * @param props - PaymentAnalyticsCards component props
 * @returns JSX element representing the analytics cards
 */
const PaymentAnalyticsCards: React.FC<PaymentAnalyticsCardsProps> = ({
  totalPayments,
  totalAmount,
  totalRefunds,
  pendingPayments,
  failedPayments,
  successRate
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Payments</p>
            <p className="text-2xl font-bold text-green-600">{totalPayments}</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">All time</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Revenue collected</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Refunds</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalRefunds)}</p>
          </div>
          <TrendingDown className="w-8 h-8 text-orange-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Amount refunded</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
          </div>
          <Clock className="w-8 h-8 text-yellow-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Awaiting processing</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Failed</p>
            <p className="text-2xl font-bold text-red-600">{failedPayments}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Need attention</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Success Rate</p>
            <p className="text-2xl font-bold text-blue-600">{successRate}%</p>
          </div>
          <BarChart3 className="w-8 h-8 text-blue-400" />
        </div>
        <div className="mt-2">
          <p className="text-xs text-gray-500">Payment success</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentAnalyticsCards;
