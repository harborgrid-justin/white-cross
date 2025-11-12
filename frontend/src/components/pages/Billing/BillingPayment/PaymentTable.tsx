'use client';

import React from 'react';
import {
  User,
  Eye,
  Receipt,
  X,
  Edit3,
  DollarSign
} from 'lucide-react';
import { BillingPaymentRecord } from './types';
import {
  formatCurrency,
  getStatusConfig,
  getPaymentMethodConfig,
  getPaymentTypeConfig
} from './utils';

/**
 * Props for the PaymentTable component
 */
interface PaymentTableProps {
  /** Array of payment records */
  payments: BillingPaymentRecord[];
  /** Loading state */
  loading: boolean;
  /** Current search term */
  searchTerm: string;
  /** Active filter count */
  activeFilterCount: number;
  /** Selected payment IDs */
  selectedPayments: string[];
  /** Payment click handler */
  onPaymentClick?: (payment: BillingPaymentRecord) => void;
  /** Edit payment handler */
  onEditPayment?: (payment: BillingPaymentRecord) => void;
  /** Process refund handler */
  onProcessRefund?: (payment: BillingPaymentRecord) => void;
  /** Void payment handler */
  onVoidPayment?: (payment: BillingPaymentRecord) => void;
  /** View invoice handler */
  onViewInvoice?: (invoiceId: string) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
  /** Payment selection handler */
  onPaymentSelect?: (paymentId: string, selected: boolean) => void;
  /** Select all handler */
  onSelectAll?: (selected: boolean) => void;
}

/**
 * PaymentTable Component
 *
 * Displays a table of payment records with actions.
 *
 * @param props - PaymentTable component props
 * @returns JSX element representing the payment table
 */
const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  loading,
  searchTerm,
  activeFilterCount,
  selectedPayments,
  onPaymentClick,
  onEditPayment,
  onProcessRefund,
  onVoidPayment,
  onViewInvoice,
  onViewPatient,
  onPaymentSelect,
  onSelectAll
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Payments Found</h3>
        <p className="text-gray-600 mb-4">
          {searchTerm || activeFilterCount > 0
            ? 'No payments match your current search or filters.'
            : 'No payments have been recorded yet.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedPayments.length === payments.length && payments.length > 0}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSelectAll?.(e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Method
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payments.map((payment) => {
            const statusConfig = getStatusConfig(payment.status);
            const methodConfig = getPaymentMethodConfig(payment.method);
            const typeConfig = getPaymentTypeConfig(payment.type);
            const StatusIcon = statusConfig.icon;
            const MethodIcon = methodConfig.icon;

            return (
              <tr
                key={payment.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => onPaymentClick?.(payment)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.id)}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onPaymentSelect?.(payment.id, e.target.checked)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{payment.id.slice(-8)}</div>
                  {payment.transactionId && (
                    <div className="text-sm text-gray-500">Txn: {payment.transactionId}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <div>
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onViewPatient?.(payment.patientId);
                        }}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        {payment.patientName}
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      onViewInvoice?.(payment.invoiceId);
                    }}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    #{payment.invoiceNumber}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${payment.type === 'refund' ? 'text-red-600' : 'text-gray-900'
                    }`}>
                    {payment.type === 'refund' ? '-' : ''}{formatCurrency(payment.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <MethodIcon className={`w-4 h-4 mr-2 ${methodConfig.color}`} />
                    <span className="text-sm text-gray-900">{methodConfig.label}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onPaymentClick?.(payment);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      aria-label="View payment details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {payment.status === 'completed' && payment.type === 'payment' && (
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onProcessRefund?.(payment);
                        }}
                        className="text-orange-600 hover:text-orange-900"
                        aria-label="Process refund"
                      >
                        <Receipt className="w-4 h-4" />
                      </button>
                    )}
                    {(payment.status === 'pending' || payment.status === 'processing') && (
                      <button
                        onClick={(e: React.MouseEvent) => {
                          e.stopPropagation();
                          onVoidPayment?.(payment);
                        }}
                        className="text-red-600 hover:text-red-900"
                        aria-label="Void payment"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onEditPayment?.(payment);
                      }}
                      className="text-gray-600 hover:text-gray-900"
                      aria-label="Edit payment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
