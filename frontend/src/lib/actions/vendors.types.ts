/**
 * @fileoverview Vendor Type Definitions
 * @module lib/actions/vendors/types
 *
 * TypeScript interfaces and types for vendor management system.
 * Includes vendor data models, contracts, evaluations, filters, and analytics.
 */

// ==========================================
// CACHE CONFIGURATION
// ==========================================

/**
 * Custom cache tags for vendor-related data
 */
export const VENDOR_CACHE_TAGS = {
  VENDORS: 'vendors',
  CONTRACTS: 'vendor-contracts',
  CERTIFICATIONS: 'vendor-certifications',
  EVALUATIONS: 'vendor-evaluations',
  PRODUCTS: 'vendor-products',
  COMPLIANCE: 'vendor-compliance',
} as const;

// ==========================================
// COMMON TYPES
// ==========================================

/**
 * Standard action result wrapper for all vendor operations
 */
export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

// ==========================================
// VENDOR TYPES
// ==========================================

/**
 * Main vendor entity with complete business information
 */
export interface Vendor {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: 'pharmaceutical' | 'medical-supply' | 'equipment' | 'service' | 'food-service' | 'technology';
  status: 'active' | 'inactive' | 'pending' | 'suspended' | 'terminated';
  priority: 'preferred' | 'approved' | 'conditional' | 'restricted';
  contactInfo: {
    primaryContact: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    website?: string;
  };
  businessInfo: {
    taxId?: string;
    dunsNumber?: string;
    businessLicense?: string;
    insuranceInfo?: {
      provider: string;
      policyNumber: string;
      coverage: number;
      expiresAt: string;
    };
  };
  compliance: {
    hipaaCompliant: boolean;
    fdaRegistered: boolean;
    deaRegistered: boolean;
    certifications: string[];
    lastAuditDate?: string;
    nextAuditDate?: string;
  };
  financials: {
    creditRating?: string;
    paymentTerms: number;
    currency: string;
    taxRate?: number;
  };
  performance: {
    onTimeDeliveryRate: number;
    qualityRating: number;
    serviceRating: number;
    totalOrders: number;
    totalSpend: number;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data structure for creating a new vendor
 */
export interface CreateVendorData {
  name: string;
  code?: string;
  description?: string;
  type: Vendor['type'];
  contactInfo: Vendor['contactInfo'];
  businessInfo?: Partial<Vendor['businessInfo']>;
  compliance?: Partial<Vendor['compliance']>;
  financials?: Partial<Vendor['financials']>;
}

/**
 * Data structure for updating an existing vendor
 */
export interface UpdateVendorData {
  name?: string;
  description?: string;
  type?: Vendor['type'];
  status?: Vendor['status'];
  priority?: Vendor['priority'];
  contactInfo?: Partial<Vendor['contactInfo']>;
  businessInfo?: Partial<Vendor['businessInfo']>;
  compliance?: Partial<Vendor['compliance']>;
  financials?: Partial<Vendor['financials']>;
}

/**
 * Filter options for querying vendors
 */
export interface VendorFilters {
  name?: string;
  code?: string;
  type?: Vendor['type'];
  status?: Vendor['status'];
  priority?: Vendor['priority'];
  hipaaCompliant?: boolean;
  fdaRegistered?: boolean;
  deaRegistered?: boolean;
  minRating?: number;
  location?: string;
}

// ==========================================
// CONTRACT TYPES
// ==========================================

/**
 * Vendor contract with terms and documentation
 */
export interface VendorContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  title: string;
  type: 'master-agreement' | 'purchase-order' | 'service-agreement' | 'maintenance' | 'license';
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'suspended';
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  terms: {
    paymentTerms: number;
    deliveryTerms: string;
    warrantyPeriod?: number;
    penaltyClause?: string;
  };
  documents: {
    contractFile?: string;
    amendments?: string[];
    addendums?: string[];
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// EVALUATION TYPES
// ==========================================

/**
 * Vendor evaluation with scores and recommendations
 */
export interface VendorEvaluation {
  id: string;
  vendorId: string;
  evaluationType: 'initial' | 'annual' | 'performance' | 'incident' | 'renewal';
  evaluationDate: string;
  evaluator: string;
  scores: {
    quality: number;
    delivery: number;
    service: number;
    compliance: number;
    pricing: number;
    overall: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  actionItems: {
    item: string;
    dueDate: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
  status: 'draft' | 'completed' | 'approved';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

/**
 * Comprehensive vendor analytics and metrics
 */
export interface VendorAnalytics {
  totalVendors: number;
  activeVendors: number;
  preferredVendors: number;
  complianceRate: number;
  averageRating: number;
  totalSpend: number;
  typeBreakdown: {
    type: Vendor['type'];
    count: number;
    percentage: number;
    totalSpend: number;
  }[];
  statusBreakdown: {
    status: Vendor['status'];
    count: number;
    percentage: number;
  }[];
  complianceMetrics: {
    hipaaCompliant: number;
    fdaRegistered: number;
    deaRegistered: number;
    fullyCompliant: number;
  };
  performanceMetrics: {
    averageDeliveryRate: number;
    averageQualityRating: number;
    averageServiceRating: number;
  };
}
