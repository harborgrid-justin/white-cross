/**
 * Vendor Payment Type Definitions
 *
 * Payment-related types for vendor invoices, payments,
 * and financial transaction tracking.
 *
 * @module hooks/domains/vendors/vendor-payment-types
 *
 * @since 1.0.0
 */

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
