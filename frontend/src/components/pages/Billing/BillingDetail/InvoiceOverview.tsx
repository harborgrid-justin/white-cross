'use client';

import React from 'react';
import {
  DollarSign,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Download,
  Send,
  Edit3,
  CheckCircle,
  Shield,
  History,
  Printer
} from 'lucide-react';
import type { InvoiceOverviewProps } from './types';
import {
  formatCurrency,
  getStatusConfig,
  getDaysOverdue,
  calculatePaymentPercentage,
  formatDate
} from './utils';

/**
 * InvoiceOverview Component
 *
 * Displays comprehensive invoice information including status, amounts,
 * patient details, dates, insurance, and notes.
 *
 * @param props - InvoiceOverview component props
 * @returns JSX element representing the invoice overview
 */
const InvoiceOverview: React.FC<InvoiceOverviewProps> = ({
  invoice,
  onEditInvoice,
  onDownloadInvoice,
  onSendInvoice,
  onPrintInvoice,
  onRecordPayment,
  onViewPatient
}) => {
  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;
  const daysOverdue = getDaysOverdue(invoice.dueDate);
  const paymentPercentage = calculatePaymentPercentage(invoice.amountPaid, invoice.totalAmount);

  return (
    <div className="space-y-6">
      {/* Status and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusConfig.color}`}>
              <StatusIcon className="w-4 h-4 mr-2" />
              {statusConfig.label}
            </div>
            <div className="text-sm text-gray-600">
              {statusConfig.description}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.status !== 'cancelled' && (
              <button onClick={() => onEditInvoice?.(invoice)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                <Edit3 className="w-4 h-4 mr-2" />Edit
              </button>
            )}
            <button onClick={() => onDownloadInvoice?.(invoice)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />Download
            </button>
            <button onClick={() => onPrintInvoice?.(invoice)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Printer className="w-4 h-4 mr-2" />Print
            </button>
            {(invoice.status === 'draft' || invoice.status === 'overdue') && (
              <button onClick={() => onSendInvoice?.(invoice)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                <Send className="w-4 h-4 mr-2" />Send
              </button>
            )}
            {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
              <button onClick={() => onRecordPayment?.(invoice)} className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700">
                <DollarSign className="w-4 h-4 mr-2" />Record Payment
              </button>
            )}
          </div>
        </div>

        {/* Invoice Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Amount Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Amount Details</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.discountAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Discount</span>
                  <span className="text-sm font-medium text-green-600">-{formatCurrency(invoice.discountAmount)}</span>
                </div>
              )}
              {invoice.taxAmount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-base font-medium text-gray-900">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">{formatCurrency(invoice.totalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Amount Paid</span>
                <span className="text-sm font-medium text-green-600">{formatCurrency(invoice.amountPaid)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900">Balance Due</span>
                <span className={`text-lg font-bold ${invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(invoice.balanceDue)}
                </span>
              </div>
            </div>

            {/* Payment Progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Payment Progress</span>
                <span className="text-sm text-gray-600">{paymentPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all duration-300 ${paymentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'}`} style={{ width: `${paymentPercentage}%` }}></div>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Patient Information</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <button onClick={() => onViewPatient?.(invoice.patientId)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                    {invoice.patientName}
                  </button>
                  <p className="text-xs text-gray-500">Patient ID: {invoice.patientId}</p>
                </div>
              </div>
              {invoice.patientEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href={`mailto:${invoice.patientEmail}`} className="text-sm text-blue-600 hover:text-blue-800">{invoice.patientEmail}</a>
                </div>
              )}
              {invoice.patientPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href={`tel:${invoice.patientPhone}`} className="text-sm text-blue-600 hover:text-blue-800">{invoice.patientPhone}</a>
                </div>
              )}
              {invoice.patientAddress && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-900">
                    <div>{invoice.patientAddress.street}</div>
                    <div>{invoice.patientAddress.city}, {invoice.patientAddress.state} {invoice.patientAddress.zipCode}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Invoice Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Important Dates</h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Service Date</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(invoice.serviceDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Issue Date</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(invoice.issueDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Due Date</p>
                  <p className={`text-xs ${
                    invoice.status === 'overdue' ? 'text-red-600 font-medium' : 'text-gray-500'
                  }`}>
                    {formatDate(invoice.dueDate)}
                    {invoice.status === 'overdue' && daysOverdue > 0 && (
                      <span className="ml-1">
                        ({daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <History className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Last Updated</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(invoice.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Information */}
      {invoice.insuranceClaimId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Insurance Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Claim ID</span>
              </div>
              <p className="text-sm text-blue-800">{invoice.insuranceClaimId}</p>
            </div>

            <div>
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Status</span>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                invoice.insuranceStatus === 'approved' ? 'bg-green-100 text-green-800' :
                invoice.insuranceStatus === 'denied' ? 'bg-red-100 text-red-800' :
                invoice.insuranceStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {invoice.insuranceStatus ? (invoice.insuranceStatus.charAt(0).toUpperCase() + invoice.insuranceStatus.slice(1)) : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Notes and Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {invoice.notes && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Terms & Conditions</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.terms}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceOverview;
