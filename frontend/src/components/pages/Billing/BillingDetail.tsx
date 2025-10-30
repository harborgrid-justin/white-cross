'use client';

import React, { useState } from 'react';
import { 
  DollarSign,
  User,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Building,
  CreditCard,
  Receipt,
  FileText,
  Download,
  Send,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Plus,
  Eye,
  Printer,
  Share2,
  Copy,
  Banknote,
  Wallet,
  Shield,
  History,
  Tag,
  TrendingUp,
  Info,
  ExternalLink
} from 'lucide-react';
import { BillingInvoice, InvoiceStatus, PaymentMethod, InvoiceLineItem, PaymentRecord } from './BillingCard';

/**
 * Detail view tab types
 */
type BillingDetailTab = 'overview' | 'payments' | 'services' | 'history' | 'documents';

/**
 * Props for the BillingDetail component
 */
interface BillingDetailProps {
  /** Invoice data */
  invoice?: BillingInvoice;
  /** Loading state */
  loading?: boolean;
  /** Active tab */
  activeTab?: BillingDetailTab;
  /** Custom CSS classes */
  className?: string;
  /** Tab change handler */
  onTabChange?: (tab: BillingDetailTab) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Delete invoice handler */
  onDeleteInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Print invoice handler */
  onPrintInvoice?: (invoice: BillingInvoice) => void;
  /** Share invoice handler */
  onShareInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Edit payment handler */
  onEditPayment?: (payment: PaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: PaymentRecord) => void;
  /** Add service handler */
  onAddService?: (invoice: BillingInvoice) => void;
  /** Edit service handler */
  onEditService?: (service: InvoiceLineItem) => void;
  /** Delete service handler */
  onDeleteService?: (service: InvoiceLineItem) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
  /** View provider handler */
  onViewProvider?: (providerId: string) => void;
  /** Back handler */
  onBack?: () => void;
}

/**
 * BillingDetail Component
 * 
 * A comprehensive detail view component for billing invoices with tabbed interface,
 * complete invoice information, payment tracking, service breakdown, and document
 * management. Features full CRUD operations and workflow support.
 * 
 * @param props - BillingDetail component props
 * @returns JSX element representing the detailed billing invoice view
 */
const BillingDetail = ({
  invoice,
  loading = false,
  activeTab = 'overview',
  className = '',
  onTabChange,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadInvoice,
  onSendInvoice,
  onPrintInvoice,
  onShareInvoice,
  onRecordPayment,
  onEditPayment,
  onDeletePayment,
  onAddService,
  onEditService,
  onDeleteService,
  onViewPatient,
  onViewProvider,
  onBack
}: BillingDetailProps) => {
  // State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /**
   * Formats currency amount
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  /**
   * Gets status configuration
   */
  const getStatusConfig = (status: InvoiceStatus) => {
    const configs = {
      draft: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: FileText,
        label: 'Draft',
        description: 'Invoice is being prepared'
      },
      sent: {
        color: 'text-blue-600 bg-blue-100 border-blue-200',
        icon: Clock,
        label: 'Sent',
        description: 'Invoice has been sent to patient'
      },
      paid: {
        color: 'text-green-600 bg-green-100 border-green-200',
        icon: CheckCircle,
        label: 'Paid',
        description: 'Invoice has been fully paid'
      },
      overdue: {
        color: 'text-red-600 bg-red-100 border-red-200',
        icon: AlertTriangle,
        label: 'Overdue',
        description: 'Payment is past due date'
      },
      cancelled: {
        color: 'text-gray-600 bg-gray-100 border-gray-200',
        icon: X,
        label: 'Cancelled',
        description: 'Invoice has been cancelled'
      },
      refunded: {
        color: 'text-orange-600 bg-orange-100 border-orange-200',
        icon: Receipt,
        label: 'Refunded',
        description: 'Payment has been refunded'
      }
    };
    return configs[status];
  };

  /**
   * Gets payment method icon and label
   */
  const getPaymentMethodConfig = (method: PaymentMethod) => {
    const configs = {
      cash: { icon: Banknote, label: 'Cash' },
      check: { icon: FileText, label: 'Check' },
      'credit-card': { icon: CreditCard, label: 'Credit Card' },
      'debit-card': { icon: CreditCard, label: 'Debit Card' },
      'bank-transfer': { icon: Building, label: 'Bank Transfer' },
      insurance: { icon: Shield, label: 'Insurance' }
    };
    return configs[method] || { icon: Wallet, label: 'Other' };
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
   * Renders overview tab content
   */
  const renderOverviewTab = () => {
    if (!invoice) return null;

    const statusConfig = getStatusConfig(invoice.status);
    const StatusIcon = statusConfig.icon;
    const daysOverdue = getDaysOverdue(invoice.dueDate);
    const paymentPercentage = invoice.totalAmount > 0 
      ? Math.round((invoice.amountPaid / invoice.totalAmount) * 100) 
      : 0;

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
                <button
                  onClick={() => onEditInvoice?.(invoice)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                           bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              
              <button
                onClick={() => onDownloadInvoice?.(invoice)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              
              <button
                onClick={() => onPrintInvoice?.(invoice)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                         bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              
              {(invoice.status === 'draft' || invoice.status === 'overdue') && (
                <button
                  onClick={() => onSendInvoice?.(invoice)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                           bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </button>
              )}
              
              {invoice.balanceDue > 0 && invoice.status !== 'cancelled' && (
                <button
                  onClick={() => onRecordPayment?.(invoice)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                           bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Record Payment
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
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                
                {invoice.discountAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Discount</span>
                    <span className="text-sm font-medium text-green-600">
                      -{formatCurrency(invoice.discountAmount)}
                    </span>
                  </div>
                )}
                
                {invoice.taxAmount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tax</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.taxAmount)}
                    </span>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-base font-medium text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(invoice.totalAmount)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-sm font-medium text-green-600">
                    {formatCurrency(invoice.amountPaid)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-900">Balance Due</span>
                  <span className={`text-lg font-bold ${
                    invoice.balanceDue > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
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
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${
                      paymentPercentage === 100 ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${paymentPercentage}%` }}
                  ></div>
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
                    <button
                      onClick={() => onViewPatient?.(invoice.patientId)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {invoice.patientName}
                    </button>
                    <p className="text-xs text-gray-500">Patient ID: {invoice.patientId}</p>
                  </div>
                </div>
                
                {invoice.patientEmail && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <a
                        href={`mailto:${invoice.patientEmail}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {invoice.patientEmail}
                      </a>
                    </div>
                  </div>
                )}
                
                {invoice.patientPhone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <a
                        href={`tel:${invoice.patientPhone}`}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {invoice.patientPhone}
                      </a>
                    </div>
                  </div>
                )}
                
                {invoice.patientAddress && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div className="text-sm text-gray-900">
                      <div>{invoice.patientAddress.street}</div>
                      <div>
                        {invoice.patientAddress.city}, {invoice.patientAddress.state} {invoice.patientAddress.zipCode}
                      </div>
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
                      {new Date(invoice.serviceDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Issue Date</p>
                    <p className="text-xs text-gray-500">
                      {new Date(invoice.issueDate).toLocaleDateString()}
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
                      {new Date(invoice.dueDate).toLocaleDateString()}
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
                      {new Date(invoice.updatedAt).toLocaleDateString()}
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

  /**
   * Renders payments tab content
   */
  const renderPaymentsTab = () => {
    if (!invoice) return null;

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
                          {new Date(payment.date).toLocaleDateString()} at {new Date(payment.date).toLocaleTimeString()}
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

  /**
   * Renders services tab content
   */
  const renderServicesTab = () => {
    if (!invoice) return null;

    return (
      <div className="space-y-6">
        {/* Services Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Services & Line Items</h3>
            <button
              onClick={() => onAddService?.(invoice)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tax Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.lineItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.discount > 0 ? formatCurrency(item.discount) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.taxRate > 0 ? `${item.taxRate}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onEditService?.(item)}
                          className="text-blue-600 hover:text-blue-900"
                          aria-label="Edit service"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteService?.(item)}
                          className="text-red-600 hover:text-red-900"
                          aria-label="Delete service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className={`bg-white rounded-lg shadow ${className}`}>
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invoice Not Found</h3>
          <p className="text-gray-600">The requested invoice could not be found.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as BillingDetailTab, label: 'Overview', icon: Eye },
    { id: 'payments' as BillingDetailTab, label: 'Payments', icon: DollarSign },
    { id: 'services' as BillingDetailTab, label: 'Services', icon: Tag },
    { id: 'history' as BillingDetailTab, label: 'History', icon: History },
    { id: 'documents' as BillingDetailTab, label: 'Documents', icon: FileText }
  ];

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
                aria-label="Go back"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice #{invoice.invoiceNumber}
              </h1>
              <p className="text-sm text-gray-600">
                Issued {new Date(invoice.issueDate).toLocaleDateString()} • 
                Service {new Date(invoice.serviceDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onShareInvoice?.(invoice)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              aria-label="Share invoice"
            >
              <Share2 className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-gray-400 hover:text-red-600 rounded-md"
              aria-label="Delete invoice"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange?.(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'services' && renderServicesTab()}
        {activeTab === 'history' && (
          <div className="text-center py-12">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Invoice history will be displayed here.</p>
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Related documents will be displayed here.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Invoice
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete invoice #{invoice.invoiceNumber}? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => {
                    onDeleteInvoice?.(invoice);
                    setShowDeleteConfirm(false);
                  }}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingDetail;
