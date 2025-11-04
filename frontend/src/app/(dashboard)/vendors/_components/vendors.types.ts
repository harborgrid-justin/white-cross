/**
 * @fileoverview Vendor Component Type Definitions
 * @module app/(dashboard)/vendors/_components/vendors.types
 *
 * TypeScript interfaces and types for vendor management UI components.
 * These types extend the server-side vendor types with UI-specific properties.
 */

/**
 * Vendor contact information interface
 */
export interface VendorContact {
  id: string
  name: string
  title: string
  email: string
  phone: string
  isPrimary: boolean
}

/**
 * Vendor address information interface
 */
export interface VendorAddress {
  id: string
  type: 'BILLING' | 'SHIPPING' | 'BOTH'
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isPrimary: boolean
}

/**
 * Vendor certification interface
 */
export interface VendorCertification {
  id: string
  name: string
  type: string
  issuedBy: string
  issuedDate: string
  expiryDate: string
  status: 'VALID' | 'EXPIRED' | 'EXPIRING_SOON'
  documentUrl?: string
}

/**
 * Vendor performance metrics interface
 */
export interface VendorPerformance {
  vendorId: string
  overallRating: VendorRating
  ratingScore: number
  onTimeDeliveryRate: number
  averageDeliveryDays: number
  lateDeliveries: number
  earlyDeliveries: number
  defectRate: number
  returnRate: number
  qualityScore: number
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalValue: number
  averageOrderValue: number
  complianceRate: number
  documentationScore: number
  averageResponseTime: number
  communicationScore: number
  priceCompetitiveness: number
  totalSpend: number
  costSavings: number
  periodStart: string
  periodEnd: string
  lastUpdated: string
}

/**
 * Vendor status enumeration
 */
export type VendorStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'BLACKLISTED'

/**
 * Vendor rating enumeration
 */
export type VendorRating = 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR' | 'UNRATED'

/**
 * Main vendor interface for UI display
 */
export interface Vendor {
  id: string
  name: string
  legalName: string
  vendorNumber: string
  status: VendorStatus
  rating: VendorRating
  contacts: VendorContact[]
  addresses: VendorAddress[]
  website?: string
  taxId: string
  paymentTerms: string
  preferredPaymentMethod: string
  creditLimit: number
  categories: string[]
  productLines: string[]
  certifications: VendorCertification[]
  performance?: VendorPerformance
  w9OnFile: boolean
  insuranceCertOnFile: boolean
  contractOnFile: boolean
  backgroundCheckCompleted: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  lastModifiedBy: string
  lastOrderDate?: string
}

/**
 * Vendor statistics interface
 */
export interface VendorStats {
  totalVendors: number
  activeVendors: number
  excellentRated: number
  totalCertifications: number
  totalSpend: number
  avgDeliveryTime: number
  complianceRate: number
  onTimeDeliveryRate: number
}

/**
 * Vendor filter state interface
 */
export interface VendorFilterState {
  searchQuery: string
  statusFilter: VendorStatus | 'ALL'
  ratingFilter: VendorRating | 'ALL'
  categoryFilter: string
}
