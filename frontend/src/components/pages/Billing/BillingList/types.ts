import { BillingInvoice } from '../BillingCard';

/**
 * View mode types for billing list display
 */
export type BillingListViewMode = 'grid' | 'list' | 'table';

/**
 * Active filters configuration
 */
export interface ActiveFilters {
  status: string[];
  priority: string[];
  paymentMethod: string[];
  dateRange: string;
}

/**
 * Props for the BillingList component
 */
export interface BillingListProps {
  /** Array of billing invoices */
  invoices?: BillingInvoice[];
  /** Loading state */
  loading?: boolean;
  /** Current view mode */
  viewMode?: BillingListViewMode;
  /** Selected invoice IDs for bulk operations */
  selectedInvoices?: string[];
  /** Current page number */
  currentPage?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Total items count */
  totalItems?: number;
  /** Search term */
  searchTerm?: string;
  /** Active filters */
  activeFilters?: ActiveFilters;
  /** Custom CSS classes */
  className?: string;
  /** Invoice click handler */
  onInvoiceClick?: (invoice: BillingInvoice) => void;
  /** View details handler */
  onViewDetails?: (invoice: BillingInvoice) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Delete invoice handler */
  onDeleteInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Send invoice handler */
  onSendInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
  /** Selection change handler */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Page change handler */
  onPageChange?: (page: number) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: BillingListViewMode) => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, invoiceIds: string[]) => void;
}

/**
 * Props for BillingInvoiceCard component
 */
export interface BillingInvoiceCardProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Whether this invoice is selected */
  isSelected: boolean;
  /** Invoice click handler */
  onInvoiceClick?: (invoice: BillingInvoice) => void;
  /** Selection change handler */
  onSelectionChange: (invoiceId: string, selected: boolean) => void;
  /** View details handler */
  onViewDetails?: (invoice: BillingInvoice) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Download invoice handler */
  onDownloadInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
}

/**
 * Props for BillingInvoiceRow component
 */
export interface BillingInvoiceRowProps {
  /** Invoice data */
  invoice: BillingInvoice;
  /** Whether this invoice is selected */
  isSelected: boolean;
  /** Invoice click handler */
  onInvoiceClick?: (invoice: BillingInvoice) => void;
  /** Selection change handler */
  onSelectionChange: (invoiceId: string, selected: boolean) => void;
  /** View details handler */
  onViewDetails?: (invoice: BillingInvoice) => void;
  /** Edit invoice handler */
  onEditInvoice?: (invoice: BillingInvoice) => void;
  /** Delete invoice handler */
  onDeleteInvoice?: (invoice: BillingInvoice) => void;
  /** Record payment handler */
  onRecordPayment?: (invoice: BillingInvoice) => void;
}

/**
 * Props for BillingListBulkActions component
 */
export interface BillingListBulkActionsProps {
  /** Number of selected invoices */
  selectedCount: number;
  /** Selected invoice IDs */
  selectedInvoices: string[];
  /** Clear selection handler */
  onClearSelection: () => void;
  /** Bulk actions handler */
  onBulkActions?: (action: string, invoiceIds: string[]) => void;
}

/**
 * Props for BillingListEmptyState component
 */
export interface BillingListEmptyStateProps {
  /** Search term if any */
  searchTerm: string;
  /** Active filters */
  activeFilters: ActiveFilters;
  /** Clear filters handler */
  onClearFilters?: () => void;
}

/**
 * Props for BillingListPagination component
 */
export interface BillingListPaginationProps {
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Items per page */
  itemsPerPage: number;
  /** Total items count */
  totalItems: number;
  /** Page change handler */
  onPageChange?: (page: number) => void;
}
