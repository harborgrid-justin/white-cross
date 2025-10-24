/**
 * WF-COMP-331 | purchaseOrders.ts - React component or utility module
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
 * Purchase Order Management Types
 * Defines all types for purchase order creation, approval workflow, receiving, and fulfillment
 */

import type { BaseEntity, PaginationParams } from './common';
import type { Vendor } from './vendors';

// =====================
// ENUMS
// =====================

export enum PurchaseOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  ORDERED = 'ORDERED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED',
}

export enum OrderPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// =====================
// PURCHASE ORDER ENTITIES
// =====================

/**
 * Purchase Order
 * @aligned_with backend/src/database/models/inventory/PurchaseOrder.ts
 */
export interface PurchaseOrder extends BaseEntity {
  orderNumber: string;
  vendorId: string;
  vendor?: Vendor;
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  status: PurchaseOrderStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;

  // Relations
  items?: PurchaseOrderItem[];

  // Computed fields (UI-specific)
  totalItems?: number;
  receivedItems?: number;
  pendingItems?: number;
  fulfillmentPercentage?: number;
}

/**
 * Purchase Order Item (Line Item)
 * @aligned_with backend/src/database/models/inventory/PurchaseOrderItem.ts
 *
 * Note: Backend model has timestamps: false (only createdAt, no updatedAt)
 */
export interface PurchaseOrderItem extends BaseEntity {
  purchaseOrderId: string;
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  receivedQty: number;
  notes?: string;

  // Relations
  purchaseOrder?: PurchaseOrder;
  inventoryItem?: InventoryItemDetail;

  // Computed fields (UI-specific)
  pendingQty?: number;
  isFullyReceived?: boolean;
}

export interface InventoryItemDetail {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  description?: string;
  unitOfMeasure?: string;
  currentStock?: number;
  reorderLevel?: number;
  supplier?: string;
}

// =====================
// ORDER WORKFLOW
// =====================

export interface OrderApproval {
  orderId: string;
  approvedBy: string;
  approvedAt: string;
  comments?: string;
}

export interface OrderReceiving {
  orderId: string;
  receivedBy: string;
  receivedAt: string;
  items: ReceiveOrderItem[];
  notes?: string;
}

export interface ReceiveOrderItem {
  purchaseOrderItemId: string;
  receivedQty: number;
  condition?: 'GOOD' | 'DAMAGED' | 'INCOMPLETE';
  notes?: string;
}

export interface OrderCancellation {
  orderId: string;
  reason: string;
  cancelledBy: string;
  cancelledAt: string;
}

// =====================
// ORDER ANALYTICS
// =====================

export interface PurchaseOrderStatistics {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  partiallyReceivedOrders: number;
  totalValue: number;
  recentOrders: number;
  avgDeliveryTime?: number;
  onTimeDeliveryRate?: number;
}

export interface OrderHistoryItem {
  date: string;
  status: PurchaseOrderStatus;
  performedBy: string;
  notes?: string;
}

export interface VendorOrderHistory {
  vendor: Vendor;
  orders: PurchaseOrder[];
  totalOrders: number;
  totalSpent: number;
  avgOrderValue: number;
}

// =====================
// REORDER SUGGESTIONS
// =====================

export interface ReorderItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  sku?: string;
  supplier?: string;
  unitCost?: number;
  reorderLevel: number;
  reorderQuantity: number;
  currentStock: number;
  location?: string;
  suggestedOrderQty: number;
  lastOrderDate?: string;
  avgUsagePerDay?: number;
  daysUntilStockout?: number;
}

export interface ReorderSuggestion {
  items: ReorderItem[];
  totalItems: number;
  estimatedCost: number;
  urgentItems: number;
}

// =====================
// FILTERS & QUERIES
// =====================

export interface PurchaseOrderFilters extends PaginationParams {
  status?: PurchaseOrderStatus | PurchaseOrderStatus[];
  vendorId?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  minTotal?: number;
  maxTotal?: number;
  search?: string;
  sortBy?: 'orderDate' | 'total' | 'status' | 'vendor' | 'expectedDate';
  order?: 'asc' | 'desc';
}

export interface OrderItemFilters {
  orderId?: string;
  inventoryItemId?: string;
  fullyReceived?: boolean;
  pendingOnly?: boolean;
}

// =====================
// FORM DATA TYPES
// =====================

export interface CreatePurchaseOrderData {
  vendorId: string;
  items: CreateOrderItemData[];
  expectedDate?: string | Date;
  notes?: string;
  tax?: number;
  shipping?: number;
}

export interface CreateOrderItemData {
  inventoryItemId: string;
  quantity: number;
  unitCost: number;
  notes?: string;
}

export interface UpdatePurchaseOrderData {
  status?: PurchaseOrderStatus;
  expectedDate?: string | Date;
  receivedDate?: string | Date;
  notes?: string;
  approvedBy?: string;
  tax?: number;
  shipping?: number;
}

export interface PurchaseOrderFormData {
  id?: string;
  vendorId: string;
  items: OrderItemFormData[];
  expectedDate?: string;
  notes?: string;
  tax: number;
  shipping: number;
}

export interface OrderItemFormData {
  inventoryItemId: string;
  inventoryItemName?: string;
  quantity: number;
  unitCost: number;
  totalCost?: number;
  notes?: string;
}

export interface ReceiveItemsData {
  items: ReceiveOrderItem[];
}

export interface ApproveOrderData {
  approvedBy: string;
  comments?: string;
}

export interface CancelOrderData {
  reason: string;
}

// =====================
// API RESPONSE TYPES
// =====================

export interface PurchaseOrdersResponse {
  orders: PurchaseOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface PurchaseOrderDetailResponse {
  order: PurchaseOrder;
}

export interface OrderItemsResponse {
  items: PurchaseOrderItem[];
  total: number;
}

export interface ReorderItemsResponse {
  items: ReorderItem[];
  totalItems: number;
}

export interface VendorOrderHistoryResponse {
  vendor: Vendor;
  orders: PurchaseOrder[];
  totalOrders: number;
}

// =====================
// VALIDATION & ERRORS
// =====================

export interface PurchaseOrderFormErrors {
  vendorId?: string;
  expectedDate?: string;
  notes?: string;
  tax?: string;
  shipping?: string;
  items?: OrderItemFormError[];
  general?: string;
  [key: string]: string | OrderItemFormError[] | undefined;
}

export interface OrderItemFormError {
  inventoryItemId?: string;
  quantity?: string;
  unitCost?: string;
  notes?: string;
}

export interface ReceiveItemsErrors {
  items?: ReceiveItemError[];
  general?: string;
}

export interface ReceiveItemError {
  purchaseOrderItemId?: string;
  receivedQty?: string;
  condition?: string;
  notes?: string;
}

// =====================
// EVENT HANDLERS
// =====================

export interface PurchaseOrderEventHandlers {
  onCreate: () => void;
  onEdit: (order: PurchaseOrder) => void;
  onView: (order: PurchaseOrder) => void;
  onApprove: (orderId: string) => void;
  onReceive: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onDelete: (orderId: string) => void;
  onPrint: (orderId: string) => void;
  onExport: (orderId: string) => void;
}

export interface OrderItemEventHandlers {
  onAdd: () => void;
  onEdit: (item: PurchaseOrderItem) => void;
  onRemove: (itemId: string) => void;
  onReceive: (itemId: string, quantity: number) => void;
}

// =====================
// COMPONENT PROPS
// =====================

export interface PurchaseOrderListProps {
  orders: PurchaseOrder[];
  isLoading?: boolean;
  onOrderClick?: (order: PurchaseOrder) => void;
  onEdit?: (order: PurchaseOrder) => void;
  onApprove?: (orderId: string) => void;
  onCancel?: (orderId: string) => void;
}

export interface PurchaseOrderCardProps {
  order: PurchaseOrder;
  onClick?: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
  onReceive?: () => void;
  onCancel?: () => void;
  showActions?: boolean;
}

export interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order?: PurchaseOrder | null;
  onSave: (data: PurchaseOrderFormData) => Promise<void>;
  errors?: PurchaseOrderFormErrors;
  vendors?: Vendor[];
  inventoryItems?: InventoryItemDetail[];
}

export interface ReceiveItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PurchaseOrder;
  onReceive: (data: ReceiveItemsData) => Promise<void>;
  errors?: ReceiveItemsErrors;
}

export interface OrderStatusBadgeProps {
  status: PurchaseOrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

export interface OrderProgressProps {
  order: PurchaseOrder;
  showDetails?: boolean;
}

// =====================
// HOOK RETURN TYPES
// =====================

export interface UsePurchaseOrdersReturn {
  // Data
  orders: PurchaseOrder[];
  order: PurchaseOrder | null;
  statistics: PurchaseOrderStatistics | null;
  reorderItems: ReorderItem[];

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
  fetchOrders: (filters?: PurchaseOrderFilters) => Promise<void>;
  fetchOrder: (id: string) => Promise<PurchaseOrder | null>;
  createOrder: (data: CreatePurchaseOrderData) => Promise<PurchaseOrder | null>;
  updateOrder: (id: string, data: UpdatePurchaseOrderData) => Promise<PurchaseOrder | null>;
  approveOrder: (id: string, approvedBy: string) => Promise<PurchaseOrder | null>;
  receiveItems: (id: string, data: ReceiveItemsData, performedBy: string) => Promise<PurchaseOrder | null>;
  cancelOrder: (id: string, reason?: string) => Promise<PurchaseOrder | null>;
  deleteOrder: (id: string) => Promise<boolean>;
  fetchReorderItems: () => Promise<ReorderItem[]>;
  fetchStatistics: () => Promise<PurchaseOrderStatistics | null>;
  fetchVendorHistory: (vendorId: string, limit?: number) => Promise<VendorOrderHistory | null>;

  // Utilities
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  resetFilters: () => void;
  refreshOrders: () => void;
  calculateOrderTotal: (items: OrderItemFormData[], tax?: number, shipping?: number) => number;
  validateOrder: (data: PurchaseOrderFormData) => PurchaseOrderFormErrors;
}

// =====================
// WORKFLOW HELPERS
// =====================

export interface OrderWorkflowState {
  canEdit: boolean;
  canApprove: boolean;
  canReceive: boolean;
  canCancel: boolean;
  canDelete: boolean;
  nextActions: OrderAction[];
}

export interface OrderAction {
  type: 'APPROVE' | 'RECEIVE' | 'CANCEL' | 'EDIT' | 'DELETE' | 'PRINT' | 'EXPORT';
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  requiresConfirmation?: boolean;
}

// =====================
// CONSTANTS
// =====================

export const PURCHASE_ORDER_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  DEFAULT_TAX_RATE: 0,
  DEFAULT_SHIPPING_COST: 0,
  MIN_ORDER_AMOUNT: 0,
  MAX_ORDER_AMOUNT: 1000000,
  STATUS_COLORS: {
    PENDING: 'yellow',
    APPROVED: 'blue',
    ORDERED: 'purple',
    PARTIALLY_RECEIVED: 'orange',
    RECEIVED: 'green',
    CANCELLED: 'red',
  },
  STATUS_LABELS: {
    PENDING: 'Pending Approval',
    APPROVED: 'Approved',
    ORDERED: 'Ordered',
    PARTIALLY_RECEIVED: 'Partially Received',
    RECEIVED: 'Received',
    CANCELLED: 'Cancelled',
  },
  WORKFLOW_TRANSITIONS: {
    PENDING: ['APPROVED', 'CANCELLED'],
    APPROVED: ['ORDERED', 'CANCELLED'],
    ORDERED: ['PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED'],
    PARTIALLY_RECEIVED: ['RECEIVED', 'CANCELLED'],
    RECEIVED: [],
    CANCELLED: [],
  },
} as const;

export const ORDER_VALIDATION = {
  MIN_QUANTITY: 1,
  MAX_QUANTITY: 999999,
  MIN_UNIT_COST: 0.01,
  MAX_UNIT_COST: 999999.99,
  MAX_ITEMS_PER_ORDER: 100,
  MIN_ITEMS_PER_ORDER: 1,
  EXPECTED_DATE_MIN_DAYS: 0,
  EXPECTED_DATE_MAX_DAYS: 365,
} as const;

// =====================
// UTILITY FUNCTIONS
// =====================

export const calculateOrderTotals = (
  items: OrderItemFormData[],
  tax: number = 0,
  shipping: number = 0
): { subtotal: number; tax: number; shipping: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
  const total = subtotal + tax + shipping;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

export const getOrderWorkflowState = (
  order: PurchaseOrder,
  userRole?: string
): OrderWorkflowState => {
  const canEdit = order.status === PurchaseOrderStatus.PENDING;
  const canApprove = order.status === PurchaseOrderStatus.PENDING;
  const canReceive = [
    PurchaseOrderStatus.APPROVED,
    PurchaseOrderStatus.ORDERED,
    PurchaseOrderStatus.PARTIALLY_RECEIVED,
  ].includes(order.status);
  const canCancel = order.status !== PurchaseOrderStatus.RECEIVED &&
                    order.status !== PurchaseOrderStatus.CANCELLED;
  const canDelete = order.status === PurchaseOrderStatus.PENDING;

  const nextActions: OrderAction[] = [];

  if (canApprove) {
    nextActions.push({
      type: 'APPROVE',
      label: 'Approve Order',
      variant: 'success',
      requiresConfirmation: true,
    });
  }

  if (canReceive) {
    nextActions.push({
      type: 'RECEIVE',
      label: 'Receive Items',
      variant: 'primary',
    });
  }

  if (canEdit) {
    nextActions.push({
      type: 'EDIT',
      label: 'Edit Order',
      variant: 'secondary',
    });
  }

  if (canCancel) {
    nextActions.push({
      type: 'CANCEL',
      label: 'Cancel Order',
      variant: 'danger',
      requiresConfirmation: true,
    });
  }

  return {
    canEdit,
    canApprove,
    canReceive,
    canCancel,
    canDelete,
    nextActions,
  };
};

export const calculateFulfillmentPercentage = (order: PurchaseOrder): number => {
  if (!order.items || order.items.length === 0) return 0;

  const totalOrdered = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalReceived = order.items.reduce((sum, item) => sum + item.receivedQty, 0);

  if (totalOrdered === 0) return 0;

  return Math.round((totalReceived / totalOrdered) * 100);
};
