'use client';

import React from 'react';
import {
  DollarSign,
  Eye,
  Edit3,
  Download,
  User,
  Calendar
} from 'lucide-react';
import { BillingInvoiceCardProps } from './types';
import {
  formatCurrency,
  getStatusConfig,
  getPriorityConfig,
  getDaysUntilDue,
  calculatePaymentPercentage
} from './utils';

/**
 * BillingInvoiceCard Component
 *
 * Displays an individual invoice in card format for grid/list views.
 * Shows invoice details, payment progress, and action buttons.
 *
 * @param props - BillingInvoiceCard component props
 * @returns JSX element representing an invoice card
 */
const BillingInvoiceCard: React.FC<BillingInvoiceCardProps> = ({
  invoice,
  isSelected,
  onInvoiceClick,
  onSelectionChange,
  onViewDetails,
  onEditInvoice,
  onDownloadInvoice,
  onRecordPayment
}) => {
  const statusConfig = getStatusConfig(invoice.status);
  const priorityConfig = getPriorityConfig(invoice.priority);
  const StatusIcon = statusConfig.icon;
  const daysUntilDue = getDaysUntilDue(invoice.dueDate);
  const paymentPercentage = calculatePaymentPercentage(invoice.amountPaid, invoice.totalAmount);

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onInvoiceClick?.(invoice)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onInvoiceClick?.(invoice);
        }
      }}
      aria-label={`Invoice ${invoice.invoiceNumber} for ${invoice.patientName}`}
    >
      {/* Selection checkbox */}
      <div className="flex items-start justify-between mb-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            e.stopPropagation();
            onSelectionChange(invoice.id, e.target.checked);
          }}
          className="rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          aria-label={`Select invoice ${invoice.invoiceNumber}`}
        />

        <div className="flex items-center space-x-2">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
            <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
              {invoice.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Invoice Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          #{invoice.invoiceNumber}
        </h3>
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
          <User className="w-4 h-4" />
          <span>{invoice.patientName}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Service: {new Date(invoice.serviceDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Amount Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(invoice.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Balance Due</p>
          <p className={`text-xl font-bold ${
            invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
          }`}>
            {formatCurrency(invoice.balanceDue)}
          </p>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Payment Progress</span>
          <span className="text-sm text-gray-600">{paymentPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              paymentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
            }`}
            style={{ width: `${paymentPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Due Date */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
        </div>

        {invoice.status === 'overdue' && daysUntilDue < 0 && (
          <span className="text-sm font-medium text-red-600">
            {Math.abs(daysUntilDue)} days overdue
          </span>
        )}

        {daysUntilDue > 0 && daysUntilDue <= 7 && (
          <span className="text-sm font-medium text-orange-600">
            Due in {daysUntilDue} days
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          Updated {new Date(invoice.updatedAt).toLocaleDateString()}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetails?.(invoice);
            }}
            className="p-1 text-gray-400 hover:text-blue-600 rounded"
            aria-label="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEditInvoice?.(invoice);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
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
              className="p-1 text-gray-400 hover:text-green-600 rounded"
              aria-label="Record payment"
            >
              <DollarSign className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDownloadInvoice?.(invoice);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="Download invoice"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingInvoiceCard;
