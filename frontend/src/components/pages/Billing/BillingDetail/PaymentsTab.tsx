/**
 * @fileoverview BillingDetail PaymentsTab Component
 * @module components/pages/Billing/BillingDetail/PaymentsTab
 * @category Healthcare - Billing Management
 */

import React from 'react';
import { 
  DollarSign,
  Plus,
  Edit3,
  Trash2
} from 'lucide-react';
import { BillingInvoice, PaymentRecord } from '../BillingCard';
import { formatCurrency, formatDateTime, getPaymentMethodConfig } from './utils';

/**
 * Props for the PaymentsTab component
 */
interface PaymentsTabProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Edit payment handler */
  onEditPayment?: (payment: PaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: PaymentRecord) => void;
}

/**
 * PaymentsTab Component
 * 
 * Displays payment summary, payment history, and provides controls for
 * recording new payments and managing existing payment records.
 * 
 * @param props - PaymentsTab component props
 * @returns JSX element representing the payments tab content
 */
const PaymentsTab: React.FC<PaymentsTabProps> = ({
  invoice,
  onRecordPayment,
  onEditPayment,
  onDeletePayment
}) => {
  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Payment Summary</h3>
          {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
            <button
              onClick={() => onRecordPayment?.(invoice)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(invoice.totalAmount)}
            </div>
            <div className="text-sm text-gray-600">Total Amount</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(invoice.amountPaid)}
            </div>
            <div className="text-sm text-gray-600">Amount Paid</div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${
              invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {formatCurrency(invoice.balanceDue)}
            </div>
            <div className="text-sm text-gray-600">Balance Due</div>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
        
        {invoice.payments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No payments recorded yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoice.payments.map((payment) => {
              const methodConfig = getPaymentMethodConfig(payment.method);
              const MethodIcon = methodConfig.icon;
              
              return (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-lg">
                      <MethodIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount)}
                        </span>
                        <span className="text-xs text-gray-500">via {methodConfig.label}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDateTime(payment.date)}
                      </div>
                      {payment.reference && (
                        <div className="text-xs text-gray-500">
                          Ref: {payment.reference}
                        </div>
                      )}
                      {payment.notes && (
                        <div className="text-xs text-gray-600 mt-1">
                          {payment.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditPayment?.(payment)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded"
                      aria-label="Edit payment"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletePayment?.(payment)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                      aria-label="Delete payment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsTab;
