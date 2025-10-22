import { QueryClient } from '@tanstack/react-query';

// Query Keys Factory for Vendors Domain
export const vendorKeys = {
  all: ['vendors'] as const,
  list: (filters?: any) => [...vendorKeys.all, 'list', filters] as const,
  paginated: (filters?: any) => [...vendorKeys.all, 'paginated', filters] as const,
  detail: (id: string) => [...vendorKeys.all, 'detail', id] as const,
  analytics: (vendorId: string, period?: string) => [...vendorKeys.all, 'analytics', vendorId, period] as const,
  performance: (vendorId: string) => [...vendorKeys.all, 'performance', vendorId] as const,
  
  // Contracts
  contracts: (vendorId?: string) => [...vendorKeys.all, 'contracts', vendorId] as const,
  contract: (contractId: string) => [...vendorKeys.all, 'contract', contractId] as const,
  
  // Evaluations
  evaluations: (vendorId?: string) => [...vendorKeys.all, 'evaluations', vendorId] as const,
  evaluation: (evaluationId: string) => [...vendorKeys.all, 'evaluation', evaluationId] as const,
  
  // Documents
  documents: (vendorId: string) => [...vendorKeys.all, 'documents', vendorId] as const,
  
  // Payments
  payments: (vendorId?: string) => [...vendorKeys.all, 'payments', vendorId] as const,
} as const;

// Cache Configuration
export const VENDORS_CACHE_CONFIG = {
  DEFAULT_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  VENDORS_STALE_TIME: 10 * 60 * 1000, // 10 minutes
  CONTRACTS_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  EVALUATIONS_STALE_TIME: 30 * 60 * 1000, // 30 minutes
} as const;

// TypeScript Interfaces
export interface Vendor {
  id: string;
  name: string;
  type: 'SUPPLIER' | 'CONTRACTOR' | 'SERVICE_PROVIDER' | 'CONSULTANT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_APPROVAL';
  category: string;
  subcategory?: string;
  taxId?: string;
  registrationNumber?: string;
  
  // Contact Information
  primaryContact: VendorContact;
  alternateContacts: VendorContact[];
  
  // Address Information
  addresses: VendorAddress[];
  
  // Business Information
  yearEstablished?: number;
  numberOfEmployees?: number;
  annualRevenue?: number;
  certifications: string[];
  insurance: InsuranceInfo[];
  
  // Financial Information
  paymentTerms: string;
  creditLimit?: number;
  creditRating?: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  
  // Performance Metrics
  overallRating: number;
  onTimeDeliveryRate: number;
  qualityRating: number;
  
  // Compliance
  w9OnFile: boolean;
  insuranceCurrent: boolean;
  backgroundCheckDate?: string;
  
  // System Information
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface VendorContact {
  id: string;
  type: 'PRIMARY' | 'BILLING' | 'TECHNICAL' | 'EMERGENCY';
  name: string;
  title?: string;
  email: string;
  phone: string;
  mobile?: string;
  isPrimary: boolean;
}

export interface VendorAddress {
  id: string;
  type: 'BUSINESS' | 'BILLING' | 'SHIPPING' | 'MAILING';
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isPrimary: boolean;
}

export interface InsuranceInfo {
  type: 'GENERAL_LIABILITY' | 'PROFESSIONAL_LIABILITY' | 'WORKERS_COMP' | 'CYBER_LIABILITY';
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  effectiveDate: string;
  expirationDate: string;
  certificateUrl?: string;
}

export interface VendorContract {
  id: string;
  vendorId: string;
  contractNumber: string;
  title: string;
  type: 'MASTER_AGREEMENT' | 'PURCHASE_ORDER' | 'SERVICE_CONTRACT' | 'CONSULTING';
  status: 'DRAFT' | 'UNDER_REVIEW' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
  
  // Financial Terms
  totalValue: number;
  currency: string;
  paymentSchedule: 'NET_30' | 'NET_60' | 'MILESTONE' | 'MONTHLY' | 'CUSTOM';
  
  // Dates
  startDate: string;
  endDate: string;
  signedDate?: string;
  
  // Terms
  renewalOptions: boolean;
  autoRenewal: boolean;
  terminationClause: string;
  penaltyClause?: string;
  
  // Documents
  documentUrl?: string;
  amendments: ContractAmendment[];
  
  // Approval
  approvedBy?: string;
  approvalDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ContractAmendment {
  id: string;
  amendmentNumber: number;
  description: string;
  effectiveDate: string;
  documentUrl?: string;
  createdAt: string;
}

export interface VendorEvaluation {
  id: string;
  vendorId: string;
  evaluationType: 'ANNUAL' | 'PROJECT_BASED' | 'INCIDENT' | 'RENEWAL';
  evaluationPeriod: string;
  
  // Ratings (1-5 scale)
  qualityRating: number;
  deliveryRating: number;
  communicationRating: number;
  costEffectivenessRating: number;
  overallRating: number;
  
  // Detailed Feedback
  strengths: string[];
  areasForImprovement: string[];
  comments: string;
  
  // Recommendations
  recommendForFutureWork: boolean;
  contractRenewalRecommendation: 'RENEW' | 'RENEW_WITH_CONDITIONS' | 'DO_NOT_RENEW';
  
  // System Information
  evaluatedBy: string;
  evaluationDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface VendorPayment {
  id: string;
  vendorId: string;
  invoiceNumber: string;
  purchaseOrderNumber?: string;
  contractId?: string;
  
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'OVERDUE' | 'DISPUTED' | 'CANCELLED';
  
  description: string;
  category: string;
  
  // Approval Workflow
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvalDate?: string;
  rejectionReason?: string;
  
  // Payment Information
  paymentMethod?: 'CHECK' | 'ACH' | 'WIRE' | 'CREDIT_CARD';
  paymentReference?: string;
  
  attachments: PaymentAttachment[];
  
  createdAt: string;
  updatedAt: string;
}

export interface PaymentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface VendorDocument {
  id: string;
  vendorId: string;
  type: 'W9' | 'INSURANCE_CERT' | 'LICENSE' | 'CERTIFICATION' | 'CONTRACT' | 'OTHER';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  
  expirationDate?: string;
  isRequired: boolean;
  status: 'CURRENT' | 'EXPIRED' | 'EXPIRING_SOON' | 'MISSING';
  
  uploadedBy: string;
  uploadedAt: string;
  lastReviewedBy?: string;
  lastReviewedAt?: string;
}

// Utility Functions
export const invalidateVendorQueries = (queryClient: QueryClient, vendorId?: string) => {
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
    queryClient.invalidateQueries({ queryKey: vendorKeys.evaluations(vendorId) });
  }
  queryClient.invalidateQueries({ queryKey: vendorKeys.all });
};

export const invalidateVendorContractQueries = (queryClient: QueryClient, vendorId?: string) => {
  queryClient.invalidateQueries({ queryKey: vendorKeys.contracts(vendorId) });
  if (vendorId) {
    queryClient.invalidateQueries({ queryKey: vendorKeys.detail(vendorId) });
  }
};

export const calculateVendorScore = (vendor: Vendor): number => {
  const weights = {
    overall: 0.4,
    delivery: 0.3,
    quality: 0.3
  };
  
  return (
    vendor.overallRating * weights.overall +
    vendor.onTimeDeliveryRate * weights.delivery +
    vendor.qualityRating * weights.quality
  );
};

export const getVendorRiskLevel = (vendor: Vendor): 'LOW' | 'MEDIUM' | 'HIGH' => {
  const score = calculateVendorScore(vendor);
  
  if (score >= 4.0) return 'LOW';
  if (score >= 3.0) return 'MEDIUM';
  return 'HIGH';
};
