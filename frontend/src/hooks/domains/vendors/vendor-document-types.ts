/**
 * Vendor Document Type Definitions
 *
 * Document management types for vendor-related files,
 * certifications, and compliance documents.
 *
 * @module hooks/domains/vendors/vendor-document-types
 *
 * @since 1.0.0
 */

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
