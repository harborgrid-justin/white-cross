/**
 * @fileoverview Purchase Order Type Definitions
 * @module lib/actions/purchase-orders.types
 *
 * TypeScript interfaces and type definitions for purchase order management.
 * Contains all shared types used across purchase order modules.
 */

// ==========================================
// CONFIGURATION
// ==========================================

// Custom cache tags for purchase orders
export const PURCHASE_ORDER_CACHE_TAGS = {
  ORDERS: 'purchase-orders',
  ITEMS: 'purchase-order-items',
  VENDORS: 'purchase-order-vendors',
  APPROVALS: 'purchase-order-approvals',
  BUDGETS: 'purchase-order-budgets',
} as const;

// ==========================================
// TYPE DEFINITIONS
// ==========================================

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  validationErrors?: string | Record<string, string[]>;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  vendorContact: {
    name: string;
    email: string;
    phone: string;
  };
  requestedBy: string;
  requestedByName: string;
  department: string;
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  budgetCode: string;
  category: 'medical-supplies' | 'medications' | 'equipment' | 'services' | 'office-supplies' | 'maintenance';
  items: PurchaseOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  requestedDeliveryDate?: string;
  actualDeliveryDate?: string;
  notes?: string;
  internalNotes?: string;
  approvals: PurchaseOrderApproval[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  itemName: string;
  itemDescription?: string;
  itemCode?: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unitOfMeasure: string;
  manufacturer?: string;
  model?: string;
  specifications?: Record<string, unknown>;
  receivedQuantity: number;
  status: 'pending' | 'ordered' | 'partial' | 'received' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrderApproval {
  id: string;
  purchaseOrderId: string;
  approverUserId: string;
  approverName: string;
  approverRole: string;
  level: number;
  status: 'pending' | 'approved' | 'rejected';
  decision?: 'approve' | 'reject' | 'request-changes';
  comments?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface CreatePurchaseOrderData {
  vendorId: string;
  department: string;
  priority?: PurchaseOrder['priority'];
  budgetCode: string;
  category: PurchaseOrder['category'];
  items: Omit<PurchaseOrderItem, 'id' | 'purchaseOrderId' | 'receivedQuantity' | 'status' | 'createdAt' | 'updatedAt'>[];
  requestedDeliveryDate?: string;
  notes?: string;
  internalNotes?: string;
  attachments?: string[];
}

export interface UpdatePurchaseOrderData {
  vendorId?: string;
  department?: string;
  priority?: PurchaseOrder['priority'];
  budgetCode?: string;
  category?: PurchaseOrder['category'];
  requestedDeliveryDate?: string;
  notes?: string;
  internalNotes?: string;
}

export interface PurchaseOrderFilters {
  status?: PurchaseOrder['status'];
  priority?: PurchaseOrder['priority'];
  category?: PurchaseOrder['category'];
  department?: string;
  vendorId?: string;
  requestedBy?: string;
  budgetCode?: string;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface PurchaseOrderAnalytics {
  totalOrders: number;
  totalValue: number;
  averageOrderValue: number;
  pendingOrders: number;
  approvedOrders: number;
  completedOrders: number;
  statusBreakdown: {
    status: PurchaseOrder['status'];
    count: number;
    percentage: number;
  }[];
  categoryBreakdown: {
    category: PurchaseOrder['category'];
    count: number;
    totalValue: number;
    percentage: number;
  }[];
  departmentBreakdown: {
    department: string;
    count: number;
    totalValue: number;
    percentage: number;
  }[];
  monthlyTrends: {
    month: string;
    orderCount: number;
    totalValue: number;
  }[];
}
