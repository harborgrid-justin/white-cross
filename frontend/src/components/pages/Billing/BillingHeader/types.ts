/**
 * Type definitions for BillingHeader component
 *
 * This module contains all TypeScript interfaces and type definitions
 * used by the BillingHeader component and its subcomponents.
 */

/**
 * Filter options for billing data
 */
export interface BillingFilterOptions {
  /** Status filters (draft, sent, paid, overdue, etc.) */
  status: string[];
  /** Priority filters (low, medium, high, urgent) */
  priority: string[];
  /** Payment method filters (cash, check, credit-card, etc.) */
  paymentMethod: string[];
  /** Date range filter (today, week, month, quarter, year) */
  dateRange: string;
  /** Amount range filter with min and max values */
  amountRange: {
    min: number;
    max: number;
  };
}

/**
 * View modes for displaying billing data
 */
export type BillingViewMode = 'grid' | 'list' | 'table' | 'chart';

/**
 * Sort options for billing data
 */
export type BillingSortOption = 'date' | 'amount' | 'status' | 'patient' | 'dueDate' | 'updated';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Props for the BillingHeader component
 */
export interface BillingHeaderProps {
  /** Total invoices count */
  totalInvoices?: number;
  /** Total revenue amount */
  totalRevenue?: number;
  /** Outstanding balance amount */
  outstandingBalance?: number;
  /** Paid invoices count */
  paidInvoices?: number;
  /** Overdue invoices count */
  overdueInvoices?: number;
  /** Draft invoices count */
  draftInvoices?: number;
  /** Average payment time in days */
  averagePaymentTime?: number;
  /** Collection rate percentage */
  collectionRate?: number;
  /** Current search term */
  searchTerm?: string;
  /** Current filters */
  filters?: BillingFilterOptions;
  /** Current view mode */
  viewMode?: BillingViewMode;
  /** Current sort option */
  sortBy?: BillingSortOption;
  /** Sort direction */
  sortDirection?: SortDirection;
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Search change handler */
  onSearchChange?: (term: string) => void;
  /** Filter change handler */
  onFilterChange?: (filters: BillingFilterOptions) => void;
  /** View mode change handler */
  onViewModeChange?: (mode: BillingViewMode) => void;
  /** Sort change handler */
  onSortChange?: (sortBy: BillingSortOption, direction: SortDirection) => void;
  /** Create new invoice handler */
  onCreateInvoice?: () => void;
  /** Import invoices handler */
  onImportInvoices?: () => void;
  /** Export invoices handler */
  onExportInvoices?: () => void;
  /** Refresh data handler */
  onRefresh?: () => void;
  /** Settings handler */
  onSettings?: () => void;
  /** Bulk actions handler */
  onBulkActions?: () => void;
  /** Send statements handler */
  onSendStatements?: () => void;
  /** Payment processing handler */
  onProcessPayments?: () => void;
}

/**
 * Props for BillingHeaderMetrics component
 */
export interface BillingHeaderMetricsProps {
  totalInvoices: number;
  totalRevenue: number;
  outstandingBalance: number;
  paidInvoices: number;
  overdueInvoices: number;
  draftInvoices: number;
  averagePaymentTime: number;
  collectionRate: number;
  formatCurrency: (amount: number) => string;
}

/**
 * Props for BillingHeaderActions component
 */
export interface BillingHeaderActionsProps {
  loading: boolean;
  onRefresh?: () => void;
  onProcessPayments?: () => void;
  onSendStatements?: () => void;
  onImportInvoices?: () => void;
  onExportInvoices?: () => void;
  onSettings?: () => void;
  onCreateInvoice?: () => void;
}

/**
 * Props for BillingHeaderFilters component
 */
export interface BillingHeaderFiltersProps {
  filters: BillingFilterOptions;
  showFilters: boolean;
  activeFilterCount: number;
  onFilterChange: (filters: BillingFilterOptions) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}
