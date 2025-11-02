/**
 * WF-COMP-336 | vendors.ts - React component or utility module
 * Purpose: react component or utility module
 * Upstream: React, external libs | Dependencies: React ecosystem
 * Downstream: Components, pages, app routing | Called by: React component tree
 * Related: Other components, hooks, services, types
 * Exports: constants, interfaces | Key Features: Standard module
 * Last Updated: 2025-10-17 | File Type: .ts
 * Critical Path: Component mount → Render → User interaction → State updates
 * LLM Context: react component or utility module, part of React frontend architecture
 */

/**
 * Vendor and Supplier Management Types
 * Defines all types for vendor/supplier tracking, performance metrics, and comparisons
 */

import type { BaseEntity, PaginationParams } from '../core/common';

// =====================
// ENUMS
// =====================

export enum VendorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
}

export enum PaymentTerms {
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  NET_45 = 'NET_45',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
  DUE_ON_RECEIPT = 'DUE_ON_RECEIPT',
  COD = 'COD',
  PREPAID = 'PREPAID',
  CUSTOM = 'CUSTOM',
}

export enum VendorRating {
  ONE_STAR = 1,
  TWO_STARS = 2,
  THREE_STARS = 3,
  FOUR_STARS = 4,
  FIVE_STARS = 5,
}

// =====================
// VENDOR ENTITY
// =====================

/**
 * Vendor/Supplier
 * @aligned_with backend/src/database/models/inventory/Vendor.ts
 *
 * Note: accountNumber is UI-specific field not present in backend model
 */
export interface Vendor extends BaseEntity {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string | PaymentTerms;
  notes?: string;
  rating?: number | null;
  isActive: boolean;

  // UI-specific fields
  accountNumber?: string;

  // Relations
  purchaseOrders?: any[]; // Will be typed in purchaseOrders.ts to avoid circular dependency

  // Computed fields (UI-specific)
  orderCount?: number;
  totalSpent?: number;
  lastOrderDate?: string;
}

// =====================
// VENDOR PERFORMANCE
// =====================

export interface VendorPerformanceMetrics {
  totalOrders: number;
  avgDeliveryDays: number;
  totalSpent: number;
  cancelledOrders: number;
  onTimeDeliveryRate: number;
  reliabilityScore: number;
}

export interface VendorComparison {
  id: string;
  name: string;
  rating: number | null;
  paymentTerms: string | null;
  itemName: string;
  unitCost: number | null;
  orderCount: number;
  avgDeliveryDays: number | null;
}

export interface VendorMetrics {
  vendor: Vendor;
  metrics: VendorPerformanceMetrics;
}

// =====================
// VENDOR FILTERS & QUERIES
// =====================

export interface VendorFilters extends PaginationParams {
  search?: string;
  rating?: number;
  minRating?: number;
  hasOrders?: boolean;
  isActive?: boolean;
  activeOnly?: boolean;
  paymentTerms?: string;
  sortBy?: 'name' | 'rating' | 'totalOrders' | 'reliability' | 'createdAt';
  order?: 'asc' | 'desc';
}

// =====================
// FORM DATA TYPES
// =====================

export interface CreateVendorData {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
}

export interface UpdateVendorData {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: number;
  isActive?: boolean;
}

export interface VendorFormData extends CreateVendorData {
  id?: string;
}

export interface BulkVendorRatingUpdate {
  vendorId: string;
  rating: number;
}

export interface BulkVendorRatingResult {
  updated: number;
  failed: number;
  errors: string[];
}

// =====================
// API RESPONSE TYPES
// =====================

export interface VendorsResponse {
  vendors: Vendor[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface VendorDetailResponse {
  vendor: Vendor;
  metrics: VendorPerformanceMetrics;
}

export interface VendorComparisonResponse {
  comparison: VendorComparison[];
}

export interface TopVendorsResponse {
  vendors: VendorMetrics[];
}

export interface VendorStatistics {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  totalPurchaseOrders: number;
  totalSpent: number;
  avgVendorRating: number;
}

export interface VendorSearchResponse {
  vendors: Vendor[];
}

// =====================
// VALIDATION & ERRORS
// =====================

export interface VendorFormErrors {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
  rating?: string;
  [key: string]: string | undefined;
}

export interface VendorValidationRules {
  name: {
    required: boolean;
    minLength: number;
    maxLength: number;
  };
  email: {
    required: boolean;
    pattern: RegExp;
  };
  phone: {
    required: boolean;
    pattern: RegExp;
  };
  rating: {
    min: number;
    max: number;
  };
}

// =====================
// EVENT HANDLERS
// =====================

export interface VendorEventHandlers {
  onAdd: () => void;
  onEdit: (vendor: Vendor) => void;
  onView: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  onActivate: (vendorId: string) => void;
  onDeactivate: (vendorId: string) => void;
  onRatingUpdate: (vendorId: string, rating: number) => void;
  onCompare: (itemName: string) => void;
}

// =====================
// COMPONENT PROPS
// =====================

export interface VendorListProps {
  vendors: Vendor[];
  isLoading?: boolean;
  onVendorClick?: (vendor: Vendor) => void;
  onEdit?: (vendor: Vendor) => void;
  onDelete?: (vendorId: string) => void;
}

export interface VendorCardProps {
  vendor: Vendor;
  metrics?: VendorPerformanceMetrics;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showMetrics?: boolean;
}

export interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: Vendor | null;
  onSave: (data: VendorFormData) => Promise<void>;
  errors?: VendorFormErrors;
}

export interface VendorComparisonProps {
  itemName: string;
  comparisons: VendorComparison[];
  isLoading?: boolean;
}

// =====================
// HOOK RETURN TYPES
// =====================

export interface UseVendorsReturn {
  // Data
  vendors: Vendor[];
  vendor: Vendor | null;
  topVendors: VendorMetrics[];
  statistics: VendorStatistics | null;
  comparison: VendorComparison[];

  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };

  // Operations
  fetchVendors: (filters?: VendorFilters) => Promise<void>;
  fetchVendor: (id: string) => Promise<VendorDetailResponse | null>;
  createVendor: (data: CreateVendorData) => Promise<Vendor | null>;
  updateVendor: (id: string, data: UpdateVendorData) => Promise<Vendor | null>;
  deleteVendor: (id: string) => Promise<boolean>;
  reactivateVendor: (id: string) => Promise<Vendor | null>;
  updateVendorRating: (vendorId: string, rating: number) => Promise<Vendor | null>;
  bulkUpdateRatings: (updates: BulkVendorRatingUpdate[]) => Promise<BulkVendorRatingResult>;
  searchVendors: (query: string, limit?: number, activeOnly?: boolean) => Promise<Vendor[]>;
  compareVendors: (itemName: string) => Promise<VendorComparison[]>;
  fetchTopVendors: (limit?: number) => Promise<VendorMetrics[]>;
  fetchStatistics: () => Promise<VendorStatistics | null>;
  getVendorsByPaymentTerms: (paymentTerms: string) => Promise<Vendor[]>;

  // Utilities
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  refreshVendors: () => void;
}

// =====================
// CONSTANTS
// =====================

export const VENDOR_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_RATING: 5,
  MIN_RATING: 1,
  PAYMENT_TERMS_OPTIONS: [
    { value: 'NET_15', label: 'Net 15' },
    { value: 'NET_30', label: 'Net 30' },
    { value: 'NET_45', label: 'Net 45' },
    { value: 'NET_60', label: 'Net 60' },
    { value: 'NET_90', label: 'Net 90' },
    { value: 'DUE_ON_RECEIPT', label: 'Due on Receipt' },
    { value: 'COD', label: 'Cash on Delivery' },
    { value: 'PREPAID', label: 'Prepaid' },
    { value: 'CUSTOM', label: 'Custom Terms' },
  ],
} as const;

export const VENDOR_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 200,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^[\d\s\-\+\(\)]+$/,
  WEBSITE_PATTERN: /^https?:\/\/.+/,
  TAX_ID_PATTERN: /^[\d\-]+$/,
  RATING_MIN: 1,
  RATING_MAX: 5,
} as const;
