'use client';

import React from 'react';
import { 
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  User,
  FileText,
  Download,
  Eye,
  Edit3,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Building,
  Receipt,
  Banknote,
  Wallet,
  Shield
} from 'lucide-react';

/**
 * Invoice status types
 */
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';

/**
 * Payment method types
 */
export type PaymentMethod = 'cash' | 'check' | 'credit-card' | 'debit-card' | 'bank-transfer' | 'insurance';

/**
 * Invoice priority levels
 */
export type InvoicePriority = 'low' | 'medium' | 'high' | 'urgent';

/**
 * Service category types
 */
export type ServiceCategory = 'consultation' | 'treatment' | 'medication' | 'supplies' | 'equipment' | 'other';

/**
 * Line item interface for invoice services
 */
export interface InvoiceLineItem {
  id: string;
  description: string;
  category: ServiceCategory;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  total: number;
}

/**
 * Payment record interface
 */
export interface PaymentRecord {
  id: string;
  amount: number;
  method: PaymentMethod;
  date: string;
  reference?: string;
  notes?: string;
}

/**
 * Billing invoice interface
 */
export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  patientAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  providerId: string;
  providerName: string;
  serviceDate: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  priority: InvoicePriority;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  payments: PaymentRecord[];
  insuranceClaimId?: string;
  insuranceStatus?: 'pending' | 'approved' | 'denied' | 'processing';
  notes?: string;
  terms?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

/**
 * Props for the BillingCard component
 */
interface BillingCardProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (invoice: BillingInvoice) => void;
  /** View details handler */
  onViewDetails?: (invoice: BillingInvoice) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Actions menu handler */
  onActionsMenu?: (invoice: BillingInvoice) => void;
}

/**
 * BillingCard Component
 * 
 * A comprehensive card component for displaying billing invoices with status tracking,
 * payment information, and patient details. Features interactive elements for invoice
 * management and supports various billing workflows.
 * 
 * @param props - BillingCard component props
 * @returns JSX element representing the billing invoice card
 */
const BillingCard = ({
  invoice,
  loading = false,
  className = '',
  onClick,
  onViewDetails,
  onEditInvoice,
  onDownloadInvoice,
  onSendInvoice,
  onRecordPayment,
  onActionsMenu
}: BillingCardProps) => {
  /**
   * Gets status color and icon configuration
   */
  const getStatusConfig = (status: InvoiceStatus) => {
    const configs = {
      draft: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: FileText,
        label: 'Draft'
      },
      sent: {
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Clock,
        label: 'Sent'
      },
      paid: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Paid'
      },
      overdue: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Overdue'
      },
      cancelled: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: AlertCircle,
        label: 'Cancelled'
      },
      refunded: {
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        icon: Receipt,
        label: 'Refunded'
      }
    };
    return configs[status];
  };

  /**
   * Gets priority color configuration
   */
  const getPriorityConfig = (priority: InvoicePriority) => {
    const configs = {
      low: { color: 'text-gray-600', dot: 'bg-gray-400' },
      medium: { color: 'text-yellow-600', dot: 'bg-yellow-400' },
      high: { color: 'text-orange-600', dot: 'bg-orange-400' },
      urgent: { color: 'text-red-600', dot: 'bg-red-400' }
    };
    return configs[priority];
  };

  /**
   * Gets payment method icon
   */
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    const icons = {
      cash: Banknote,
      check: FileText,
      'credit-card': CreditCard,
      'debit-card': CreditCard,
      'bank-transfer': Building,
      insurance: Shield
    };
    return icons[method] || Wallet;
  };

  /**
   * Calculates days overdue
   */
  const getDaysOverdue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = now.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const statusConfig = getStatusConfig(invoice.status);
  const priorityConfig = getPriorityConfig(invoice.priority);
  const StatusIcon = statusConfig.icon;
  const daysOverdue = getDaysOverdue(invoice.dueDate);
  const paymentPercentage = invoice.totalAmount > 0 
    ? Math.round((invoice.amountPaid / invoice.totalAmount) * 100) 
    : 0;

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-6 animate-pulse ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${className}`}
      onClick={() => onClick?.(invoice)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(invoice);
        }
      }}
      aria-label={`Invoice: ${invoice.invoiceNumber} for ${invoice.patientName}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              #{invoice.invoiceNumber}
            </h3>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${priorityConfig.dot}`}></div>
              <span className={`text-xs font-medium capitalize ${priorityConfig.color}`}>
                {invoice.priority}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
            <User className="w-4 h-4" />
            <span className="font-medium">{invoice.patientName}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Service: {new Date(invoice.serviceDate).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {statusConfig.label}
          </div>
          
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onActionsMenu?.(invoice);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            aria-label="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amount Information */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total Amount</span>
            <DollarSign className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {formatCurrency(invoice.totalAmount)}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Balance Due</span>
            <Wallet className="w-4 h-4 text-gray-400" />
          </div>
          <p className={`text-lg font-bold mt-1 ${
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
          <span className="text-sm text-gray-600">
            {formatCurrency(invoice.amountPaid)} / {formatCurrency(invoice.totalAmount)} ({paymentPercentage}%)
          </span>
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
        
        {invoice.status === 'overdue' && daysOverdue > 0 && (
          <span className="text-sm font-medium text-red-600">
            {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
          </span>
        )}
      </div>

      {/* Recent Payments */}
      {invoice.payments.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Payments</h4>
          <div className="space-y-2">
            {invoice.payments.slice(0, 2).map((payment) => {
              const PaymentIcon = getPaymentMethodIcon(payment.method);
              return (
                <div key={payment.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <PaymentIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 capitalize">
                      {payment.method.replace('-', ' ')}
                    </span>
                    <span className="text-gray-500">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              );
            })}
            {invoice.payments.length > 2 && (
              <p className="text-xs text-gray-500">
                +{invoice.payments.length - 2} more payment{invoice.payments.length - 2 !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Insurance Information */}
      {invoice.insuranceClaimId && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Insurance Claim</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              invoice.insuranceStatus === 'approved' ? 'bg-green-100 text-green-800' :
              invoice.insuranceStatus === 'denied' ? 'bg-red-100 text-red-800' :
              invoice.insuranceStatus === 'processing' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {invoice.insuranceStatus ? (invoice.insuranceStatus.charAt(0).toUpperCase() + invoice.insuranceStatus.slice(1)) : 'Pending'}
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Claim ID: {invoice.insuranceClaimId}
          </p>
        </div>
      )}

      {/* Line Items Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Services ({invoice.lineItems.length} item{invoice.lineItems.length !== 1 ? 's' : ''})
        </h4>
        <div className="space-y-1">
          {invoice.lineItems.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div className="flex-1 min-w-0">
                <span className="text-gray-900 truncate block">{item.description}</span>
                <span className="text-gray-500 text-xs">
                  {item.quantity} × {formatCurrency(item.unitPrice)}
                </span>
              </div>
              <span className="font-medium text-gray-900 ml-2">
                {formatCurrency(item.total)}
              </span>
            </div>
          ))}
          {invoice.lineItems.length > 2 && (
            <p className="text-xs text-gray-500">
              +{invoice.lineItems.length - 2} more item{invoice.lineItems.length - 2 !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <span>Issued {new Date(invoice.issueDate).toLocaleDateString()}</span>
          <span>•</span>
          <span>Updated {new Date(invoice.updatedAt).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onViewDetails?.(invoice);
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 
                     border border-blue-200 rounded hover:bg-blue-100"
            aria-label="View invoice details"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </button>
          
          {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onRecordPayment?.(invoice);
              }}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 bg-green-50 
                       border border-green-200 rounded hover:bg-green-100"
              aria-label="Record payment"
            >
              <DollarSign className="w-3 h-3 mr-1" />
              Payment
            </button>
          )}
          
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onDownloadInvoice?.(invoice);
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 
                     border border-gray-200 rounded hover:bg-gray-100"
            aria-label="Download invoice"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </button>
          
          {(invoice.status === 'draft' || invoice.status === 'overdue') && (
            <button
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                onSendInvoice?.(invoice);
              }}
              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-600 bg-purple-50 
                       border border-purple-200 rounded hover:bg-purple-100"
              aria-label="Send invoice"
            >
              <Mail className="w-3 h-3 mr-1" />
              Send
            </button>
          )}
          
          <button
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onEditInvoice?.(invoice);
            }}
            className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 
                     border border-gray-200 rounded hover:bg-gray-100"
            aria-label="Edit invoice"
          >
            <Edit3 className="w-3 h-3 mr-1" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillingCard;
