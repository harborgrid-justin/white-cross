/**
 * Purchase Orders Type Definitions
 *
 * TypeScript interfaces for all purchase order domain entities.
 *
 * @module hooks/domains/purchase-orders/types
 */

/**
 * Complete purchase order entity.
 *
 * Represents a purchase order through its entire lifecycle from draft to closed.
 *
 * Status Workflow:
 * DRAFT → PENDING_APPROVAL → APPROVED → SENT → ACKNOWLEDGED →
 * PARTIALLY_RECEIVED / RECEIVED → CLOSED
 *
 * Can transition to CANCELLED from any non-terminal state.
 *
 * @interface PurchaseOrder
 */
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  title: string;
  description?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'SENT' | 'ACKNOWLEDGED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CLOSED' | 'CANCELLED';

  // Vendor Information
  vendorId: string;
  vendorName: string;
  vendorContact: POContact;

  // Financial Information
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;

  // Dates
  orderDate: string;
  requestedDeliveryDate: string;
  expectedDeliveryDate?: string;
  actualDeliveryDate?: string;

  // Shipping Information
  shippingAddress: POAddress;
  billingAddress: POAddress;
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'OVERNIGHT' | 'FREIGHT' | 'PICKUP';
  trackingNumber?: string;

  // Line Items
  lineItems: POLineItem[];

  // Approval Workflow
  approvalWorkflow: POApprovalWorkflow;
  currentApprovalLevel: number;

  // Terms and Conditions
  paymentTerms: string;
  deliveryTerms: string;
  notes?: string;
  internalNotes?: string;

  // Compliance and Audit
  budgetCode?: string;
  projectCode?: string;
  departmentId?: string;

  // System Information
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  lastModifiedBy: string;
}

export interface POContact {
  name: string;
  email: string;
  phone?: string;
  title?: string;
}

export interface POAddress {
  name?: string;
  street1: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface POLineItem {
  id: string;
  lineNumber: number;

  // Product Information
  productId?: string;
  sku?: string;
  description: string;
  category: string;

  // Quantities
  quantityOrdered: number;
  quantityReceived: number;
  quantityInvoiced: number;
  unit: string;

  // Pricing
  unitPrice: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;

  // Delivery
  requestedDeliveryDate: string;
  actualDeliveryDate?: string;

  // Status
  status: 'PENDING' | 'ACKNOWLEDGED' | 'BACKORDERED' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';

  // Additional Information
  manufacturerPartNumber?: string;
  vendorPartNumber?: string;
  notes?: string;

  // Compliance
  requiresInspection: boolean;
  hazardousMaterial: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface POApprovalWorkflow {
  levels: POApprovalLevel[];
  currentLevel: number;
  overallStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  completedAt?: string;
}

export interface POApprovalLevel {
  level: number;
  approverType: 'USER' | 'ROLE' | 'DEPARTMENT';
  approverIds: string[];
  approverNames: string[];
  requiredApprovals: number;

  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SKIPPED';
  approvedBy?: string[];
  rejectedBy?: string;
  rejectionReason?: string;

  approvedAt?: string;
  rejectedAt?: string;

  // Thresholds
  amountThreshold?: number;
  requiresAllApprovers: boolean;
}

export interface POReceipt {
  id: string;
  purchaseOrderId: string;
  receiptNumber: string;

  // Receiving Information
  receivedBy: string;
  receivedDate: string;
  receivingLocation: string;

  // Status
  status: 'PARTIAL' | 'COMPLETE' | 'OVER_RECEIVED' | 'DAMAGED' | 'REJECTED';

  // Line Items
  lineItems: POReceiptLineItem[];

  // Quality Control
  inspectionRequired: boolean;
  inspectionStatus?: 'PENDING' | 'PASSED' | 'FAILED' | 'CONDITIONAL';
  inspectedBy?: string;
  inspectionDate?: string;
  inspectionNotes?: string;

  // Documents
  packingSlip?: string;
  deliveryNote?: string;
  photos: string[];

  // Notes
  notes?: string;
  issuesReported?: string;

  createdAt: string;
  updatedAt: string;
}

export interface POReceiptLineItem {
  id: string;
  poLineItemId: string;

  // Quantities
  quantityOrdered: number;
  quantityReceived: number;
  quantityAccepted: number;
  quantityRejected: number;
  quantityDamaged: number;

  // Quality
  condition: 'GOOD' | 'DAMAGED' | 'DEFECTIVE' | 'WRONG_ITEM' | 'EXPIRED';
  notes?: string;

  // Lot/Serial Information
  lotNumbers: string[];
  serialNumbers: string[];
  expirationDate?: string;

  createdAt: string;
}

export interface PODocument {
  id: string;
  purchaseOrderId: string;
  type: 'PURCHASE_ORDER' | 'QUOTE' | 'CONTRACT' | 'RECEIPT' | 'INVOICE' | 'PACKING_SLIP' | 'OTHER';
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;

  version: number;
  isLatestVersion: boolean;

  uploadedBy: string;
  uploadedAt: string;

  // Approval/Review
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: string;

  // Metadata
  tags: string[];
  description?: string;
}

export interface POAnalytics {
  poId: string;

  // Performance Metrics
  cycleTime: {
    orderToApproval: number;
    approvalToSent: number;
    sentToAcknowledged: number;
    acknowledgedToReceived: number;
    totalCycleTime: number;
  };

  // Cost Analysis
  costVariance: {
    budgetedAmount: number;
    actualAmount: number;
    variance: number;
    variancePercent: number;
  };

  // Delivery Performance
  deliveryPerformance: {
    requestedDate: string;
    promisedDate?: string;
    actualDate?: string;
    daysEarly: number;
    daysLate: number;
    onTimeDelivery: boolean;
  };

  // Quality Metrics
  qualityMetrics: {
    totalItemsOrdered: number;
    itemsReceived: number;
    itemsAccepted: number;
    itemsRejected: number;
    defectRate: number;
  };

  // Vendor Performance Impact
  vendorImpact: {
    vendorRating: number;
    impactOnRating: number;
    performanceCategory: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'POOR';
  };
}
