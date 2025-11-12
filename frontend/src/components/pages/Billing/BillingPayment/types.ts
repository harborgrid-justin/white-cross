import { PaymentMethod, PaymentRecord } from '../BillingCard';

/**
 * Payment status types
 */
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';

/**
 * Payment type categories
 */
export type PaymentType = 'payment' | 'refund' | 'adjustment' | 'write-off' | 'transfer';

/**
 * Enhanced payment record interface
 */
export interface BillingPaymentRecord extends PaymentRecord {
  /** Payment status */
  status: PaymentStatus;
  /** Payment type */
  type: PaymentType;
  /** Patient information */
  patientId: string;
  patientName: string;
  /** Invoice information */
  invoiceId: string;
  invoiceNumber: string;
  /** Processing information */
  processedBy: string;
  processedAt: string;
  /** Transaction details */
  transactionId?: string;
  authorizationCode?: string;
  /** Refund information */
  refundedAmount?: number;
  refundReason?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Payment filter options
 */
export interface PaymentFilterOptions {
  status: PaymentStatus[];
  method: PaymentMethod[];
  type: PaymentType[];
  dateRange: string;
  amountRange: { min: number; max: number };
}

/**
 * Props for the BillingPayment component
 */
export interface BillingPaymentProps {
  /** Array of payment records */
  payments?: BillingPaymentRecord[];
  /** Loading state */
  loading?: boolean;
  /** Total payments count */
  totalPayments?: number;
  /** Total payment amount */
  totalAmount?: number;
  /** Total refunds amount */
  totalRefunds?: number;
  /** Pending payments count */
  pendingPayments?: number;
  /** Failed payments count */
  failedPayments?: number;
  /** Current search term */
  searchTerm?: string;
  /** Current filters */
  filters?: PaymentFilterOptions;
  /** Selected payments for bulk operations */
  selectedPayments?: string[];
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: PaymentFilterOptions) => void;
  /** Payment click handler */
  onPaymentClick?: (payment: BillingPaymentRecord) => void;
  /** Create payment handler */
  onCreatePayment?: () => void;
  /** Edit payment handler */
  onEditPayment?: (payment: BillingPaymentRecord) => void;
  /** Delete payment handler */
  onDeletePayment?: (payment: BillingPaymentRecord) => void;
  /** Process refund handler */
  onProcessRefund?: (payment: BillingPaymentRecord) => void;
  /** Void payment handler */
  onVoidPayment?: (payment: BillingPaymentRecord) => void;
  /** View invoice handler */
  onViewInvoice?: (invoiceId: string) => void;
  /** View patient handler */
  onViewPatient?: (patientId: string) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, paymentIds: string[]) => void;
  /** Export payments handler */
  onExportPayments?: () => void;
  /** Refresh data handler */
  onRefresh?: () => void;
}
