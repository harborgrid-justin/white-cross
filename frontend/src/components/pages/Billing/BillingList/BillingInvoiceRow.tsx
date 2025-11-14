'use client';

import React from 'react';
import {
  DollarSign,
  Eye,
  Edit3,
  Trash2
} from 'lucide-react';
import { BillingInvoiceRowProps } from './types';
import {
  formatCurrency,
  getStatusConfig,
  getPriorityConfig
} from './utils';

/**
 * BillingInvoiceRow Component
 *
 * Displays an individual invoice as a table row for table view.
 * Provides a compact view with essential information and actions.
 *
 * @param props - BillingInvoiceRow component props
 * @returns JSX element representing an invoice table row
 */
const BillingInvoiceRow: React.FC<BillingInvoiceRowProps> = ({
  invoice,
  isSelected,
  onInvoiceClick,
  onSelectionChange,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
  onRecordPayment
}) => {
  const statusConfig = getStatusConfig(invoice.status);
  const priorityConfig = getPriorityConfig(invoice.priority);
  const StatusIcon = statusConfig.icon;

  return (
    <tr
      className="hover:bg-gray-50 cursor-pointer"
      onClick={() => onInvoiceClick?.(invoice)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSelectionChange(invoice.id, e.target.checked)
          }
          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          aria-label={`Select invoice ${invoice.invoiceNumber}`}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{invoice.invoiceNumber}</div>
        <div className="text-sm text-gray-500">{new Date(invoice.issueDate).toLocaleDateString()}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{invoice.patientName}</div>
        <div className="text-sm text-gray-500">{invoice.patientEmail}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusConfig.label}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
          <span className={`text-sm font-medium capitalize ${priorityConfig.color}`}>
            {invoice.priority}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(invoice.totalAmount)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm font-medium ${
          invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
        }`}>
          {formatCurrency(invoice.balanceDue)}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {new Date(invoice.dueDate).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetails?.(invoice);
            }}
            className="text-blue-600 hover:text-blue-900"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEditInvoice?.(invoice);
            }}
            className="text-gray-600 hover:text-gray-900"
            aria-label="Edit invoice"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onRecordPayment?.(invoice);
              }}
              className="text-green-600 hover:text-green-900"
              aria-label="Record payment"
            >
              <DollarSign className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDeleteInvoice?.(invoice);
            }}
            className="text-red-600 hover:text-red-900"
            aria-label="Delete invoice"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BillingInvoiceRow;
