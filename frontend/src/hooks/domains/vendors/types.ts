/**
 * Type Definitions for Vendor Domain
 *
 * Comprehensive TypeScript interfaces for vendor management including vendors,
 * contracts, evaluations, payments, and compliance tracking.
 *
 * @module hooks/domains/vendors/types
 *
 * @since 1.0.0
 */

/**
 * Complete vendor entity with all business information.
 *
 * Represents a vendor/supplier through entire lifecycle from onboarding to
 * performance management. Includes contact info, financial terms, performance
 * metrics, and compliance tracking.
 *
 * @interface Vendor
 *
 * @property {string} id - Unique vendor identifier
 * @property {string} name - Vendor business name
 * @property {string} type - Vendor classification (SUPPLIER, CONTRACTOR, SERVICE_PROVIDER, CONSULTANT)
 * @property {string} status - Current vendor status (ACTIVE, INACTIVE, SUSPENDED, PENDING_APPROVAL)
 * @property {string} category - Primary business category
 * @property {string} [subcategory] - Detailed category classification
 * @property {string} [taxId] - Tax identification number (EIN/SSN)
 * @property {string} [registrationNumber] - Business registration number
 *
 * @property {VendorContact} primaryContact - Main point of contact
 * @property {VendorContact[]} alternateContacts - Additional contacts (billing, technical, emergency)
 * @property {VendorAddress[]} addresses - Business, billing, shipping addresses
 *
 * @property {number} [yearEstablished] - Year business was established
 * @property {number} [numberOfEmployees] - Company size
 * @property {number} [annualRevenue] - Reported annual revenue
 * @property {string[]} certifications - Business certifications (ISO, etc.)
 * @property {InsuranceInfo[]} insurance - Insurance policies (liability, workers comp, etc.)
 *
 * @property {string} paymentTerms - Payment terms (Net 30, Net 60, etc.)
 * @property {number} [creditLimit] - Maximum outstanding credit allowed
 * @property {string} [creditRating] - Credit rating (EXCELLENT, GOOD, FAIR, POOR)
 *
 * @property {number} overallRating - Performance rating (1-5 scale)
 * @property {number} onTimeDeliveryRate - Percentage of on-time deliveries (0-100)
 * @property {number} qualityRating - Quality score (1-5 scale)
 *
 * @property {boolean} w9OnFile - W-9 form on file for IRS compliance
 * @property {boolean} insuranceCurrent - All insurance policies current
 * @property {string} [backgroundCheckDate] - Last background check date (ISO format)
 *
 * @property {string} createdAt - Creation timestamp (ISO format)
 * @property {string} updatedAt - Last update timestamp (ISO format)
 * @property {string} createdBy - User ID who created vendor
 * @property {string} lastModifiedBy - User ID who last modified vendor
 *
 * @example
 * ```typescript
 * const vendor: Vendor = {
 *   id: 'vendor-123',
 *   name: 'Medical Supplies Inc',
 *   type: 'SUPPLIER',
 *   status: 'ACTIVE',
 *   category: 'Medical Equipment',
 *   primaryContact: {
 *     id: 'contact-1',
 *     type: 'PRIMARY',
 *     name: 'John Smith',
 *     email: 'john@medicalsupplies.com',
 *     phone: '555-0100',
 *     isPrimary: true
 *   },
 *   paymentTerms: 'Net 30',
 *   overallRating: 4.5,
 *   onTimeDeliveryRate: 95,
 *   qualityRating: 4.8,
 *   w9OnFile: true,
 *   insuranceCurrent: true,
 *   // ... other fields
 * };
 * ```
 *
 * @see {@link VendorContact} for contact structure
 * @see {@link VendorAddress} for address structure
 * @see {@link InsuranceInfo} for insurance details
 */
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

/**
 * Vendor contact information
 */
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

/**
 * Vendor address information
 */
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

/**
 * Insurance policy information
 */
export interface InsuranceInfo {
  type: 'GENERAL_LIABILITY' | 'PROFESSIONAL_LIABILITY' | 'WORKERS_COMP' | 'CYBER_LIABILITY';
  provider: string;
  policyNumber: string;
  coverageAmount: number;
  effectiveDate: string;
  expirationDate: string;
  certificateUrl?: string;
}

/**
 * Vendor contract information
 */
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

/**
 * Contract amendment information
 */
export interface ContractAmendment {
  id: string;
  amendmentNumber: number;
  description: string;
  effectiveDate: string;
  documentUrl?: string;
  createdAt: string;
}

/**
 * Vendor evaluation information
 */
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

/**
 * Vendor payment information
 */
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

/**
 * Payment attachment information
 */
export interface PaymentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

/**
 * Vendor document information
 */
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
