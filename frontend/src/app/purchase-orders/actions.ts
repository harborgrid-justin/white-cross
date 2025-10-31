/**
 * @fileoverview Purchase Order Management Server Actions - Next.js v14+ Compatible
 * @module app/purchase-orders/actions
 *
 * HIPAA-compliant server actions for purchase order management with comprehensive
 * caching, audit logging, and error handling.
 *
 * Features:
 * - Server actions with proper 'use server' directive
 * - Next.js cache integration with revalidateTag/revalidatePath
 * - HIPAA audit logging for all purchase order operations
 * - Type-safe CRUD operations
 * - Form data handling for UI integration
 * - Comprehensive error handling and validation
 */

'use server';

import { cache } from 'react';
import { revalidateTag, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Core API integrations
import { serverGet, serverPost, serverPut, serverDelete, NextApiClientError } from '@/lib/api/nextjs-client';
import { API_ENDPOINTS } from '@/constants/api';
import { auditLog, AUDIT_ACTIONS } from '@/lib/audit';
import { CACHE_TAGS, CACHE_TTL } from '@/lib/cache/constants';

// Types
import type { ApiResponse } from '@/types/api';

// Utils
import { formatDate } from '@/utils/dateUtils';
import { validateEmail, validatePhone } from '@/utils/validation/userValidation';
import { generateId } from '@/utils/generators';
import { formatName, formatPhone } from '@/utils/formatters';

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

// ==========================================
// CACHED DATA FUNCTIONS
// ==========================================

/**
 * Get purchase order by ID with caching
 * Uses Next.js cache() for automatic memoization
 */
export const getPurchaseOrder = cache(async (id: string): Promise<PurchaseOrder | null> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${id}`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`purchase-order-${id}`, PURCHASE_ORDER_CACHE_TAGS.ORDERS] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get purchase order:', error);
    return null;
  }
});

/**
 * Get all purchase orders with caching
 */
export const getPurchaseOrders = cache(async (filters?: PurchaseOrderFilters): Promise<PurchaseOrder[]> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrder[]>>(
      `/api/purchase-orders`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, 'purchase-order-list'] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get purchase orders:', error);
    return [];
  }
});

/**
 * Get purchase order analytics with caching
 */
export const getPurchaseOrderAnalytics = cache(async (filters?: Record<string, unknown>): Promise<PurchaseOrderAnalytics | null> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrderAnalytics>>(
      `/api/purchase-orders/analytics`,
      filters as Record<string, string | number | boolean>,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.STATS,
          tags: ['purchase-order-analytics', 'purchase-order-stats'] 
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get purchase order analytics:', error);
    return null;
  }
});

/**
 * Get purchase order items with caching
 */
export const getPurchaseOrderItems = cache(async (purchaseOrderId: string): Promise<PurchaseOrderItem[]> => {
  try {
    const response = await serverGet<ApiResponse<PurchaseOrderItem[]>>(
      `/api/purchase-orders/${purchaseOrderId}/items`,
      undefined,
      {
        cache: 'force-cache',
        next: { 
          revalidate: CACHE_TTL.SESSION,
          tags: [`purchase-order-items-${purchaseOrderId}`, PURCHASE_ORDER_CACHE_TAGS.ITEMS] 
        }
      }
    );

    return response.data || [];
  } catch (error) {
    console.error('Failed to get purchase order items:', error);
    return [];
  }
});

// ==========================================
// PURCHASE ORDER OPERATIONS
// ==========================================

/**
 * Create a new purchase order
 * Includes audit logging and cache invalidation
 */
export async function createPurchaseOrderAction(data: CreatePurchaseOrderData): Promise<ActionResult<PurchaseOrder>> {
  try {
    // Validate required fields
    if (!data.vendorId || !data.department || !data.budgetCode || !data.items || data.items.length === 0) {
      return {
        success: false,
        error: 'Missing required fields: vendorId, department, budgetCode, items'
      };
    }

    // Validate items
    for (const item of data.items) {
      if (!item.itemName || !item.quantity || !item.unitPrice) {
        return {
          success: false,
          error: 'Each item must have itemName, quantity, and unitPrice'
        };
      }
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders`,
      data,
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create purchase order');
    }

    // AUDIT LOG - Purchase order creation
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: response.data.id,
      details: `Created purchase order ${response.data.orderNumber} for vendor ${data.vendorId}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order created successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to create purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.CREATE_DOCUMENT,
      resource: 'PurchaseOrder',
      details: `Failed to create purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Update purchase order
 * Includes audit logging and cache invalidation
 */
export async function updatePurchaseOrderAction(
  purchaseOrderId: string,
  data: UpdatePurchaseOrderData
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPut<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}`,
      data,
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update purchase order');
    }

    // AUDIT LOG - Purchase order update
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Updated purchase order ${response.data.orderNumber}`,
      changes: data as Record<string, unknown>,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order updated successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to update purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to update purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Submit purchase order for approval
 * Includes audit logging and cache invalidation
 */
export async function submitPurchaseOrderAction(purchaseOrderId: string): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/submit`,
      {},
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to submit purchase order');
    }

    // AUDIT LOG - Purchase order submission
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Submitted purchase order ${response.data.orderNumber} for approval`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS);
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order submitted for approval successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to submit purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to submit purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Approve purchase order
 * Includes audit logging and cache invalidation
 */
export async function approvePurchaseOrderAction(
  purchaseOrderId: string,
  comments?: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/approve`,
      { comments },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, PURCHASE_ORDER_CACHE_TAGS.APPROVALS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to approve purchase order');
    }

    // AUDIT LOG - Purchase order approval
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Approved purchase order ${response.data.orderNumber}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS);
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order approved successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to approve purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to approve purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Reject purchase order
 * Includes audit logging and cache invalidation
 */
export async function rejectPurchaseOrderAction(
  purchaseOrderId: string,
  comments: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    if (!comments) {
      return {
        success: false,
        error: 'Rejection comments are required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/reject`,
      { comments },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, PURCHASE_ORDER_CACHE_TAGS.APPROVALS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reject purchase order');
    }

    // AUDIT LOG - Purchase order rejection
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Rejected purchase order ${response.data.orderNumber}: ${comments}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.APPROVALS);
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order rejected successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to reject purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to reject purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Cancel purchase order
 * Includes audit logging and cache invalidation
 */
export async function cancelPurchaseOrderAction(
  purchaseOrderId: string,
  reason: string
): Promise<ActionResult<PurchaseOrder>> {
  try {
    if (!purchaseOrderId) {
      return {
        success: false,
        error: 'Purchase order ID is required'
      };
    }

    if (!reason) {
      return {
        success: false,
        error: 'Cancellation reason is required'
      };
    }

    const response = await serverPost<ApiResponse<PurchaseOrder>>(
      `/api/purchase-orders/${purchaseOrderId}/cancel`,
      { reason },
      {
        cache: 'no-store',
        next: { tags: [PURCHASE_ORDER_CACHE_TAGS.ORDERS, `purchase-order-${purchaseOrderId}`] }
      }
    );

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to cancel purchase order');
    }

    // AUDIT LOG - Purchase order cancellation
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Cancelled purchase order ${response.data.orderNumber}: ${reason}`,
      success: true
    });

    // Cache invalidation
    revalidateTag(PURCHASE_ORDER_CACHE_TAGS.ORDERS);
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag('purchase-order-list');
    revalidatePath('/purchase-orders', 'page');
    revalidatePath(`/purchase-orders/${purchaseOrderId}`, 'page');

    return {
      success: true,
      data: response.data,
      message: 'Purchase order cancelled successfully'
    };
  } catch (error) {
    const errorMessage = error instanceof NextApiClientError
      ? error.message
      : error instanceof Error
      ? error.message
      : 'Failed to cancel purchase order';

    // AUDIT LOG - Log failed attempt
    await auditLog({
      action: AUDIT_ACTIONS.UPDATE_DOCUMENT,
      resource: 'PurchaseOrder',
      resourceId: purchaseOrderId,
      details: `Failed to cancel purchase order: ${errorMessage}`,
      success: false,
      errorMessage
    });

    return {
      success: false,
      error: errorMessage
    };
  }
}

// ==========================================
// FORM HANDLING OPERATIONS
// ==========================================

/**
 * Create purchase order from form data
 * Form-friendly wrapper for createPurchaseOrderAction
 */
export async function createPurchaseOrderFromForm(formData: FormData): Promise<ActionResult<PurchaseOrder>> {
  // Parse items from form data (assuming JSON string)
  const itemsJson = formData.get('items') as string;
  let items: Omit<PurchaseOrderItem, 'id' | 'purchaseOrderId' | 'receivedQuantity' | 'status' | 'createdAt' | 'updatedAt'>[] = [];
  
  try {
    items = JSON.parse(itemsJson || '[]');
  } catch {
    return {
      success: false,
      error: 'Invalid items data'
    };
  }

  const attachmentsJson = formData.get('attachments') as string;
  let attachments: string[] = [];
  
  try {
    attachments = JSON.parse(attachmentsJson || '[]');
  } catch {
    // Ignore attachment parsing errors
  }

  const purchaseOrderData: CreatePurchaseOrderData = {
    vendorId: formData.get('vendorId') as string,
    department: formData.get('department') as string,
    priority: (formData.get('priority') as PurchaseOrder['priority']) || 'normal',
    budgetCode: formData.get('budgetCode') as string,
    category: formData.get('category') as PurchaseOrder['category'],
    items,
    requestedDeliveryDate: formData.get('requestedDeliveryDate') as string || undefined,
    notes: formData.get('notes') as string || undefined,
    internalNotes: formData.get('internalNotes') as string || undefined,
    attachments: attachments.length > 0 ? attachments : undefined,
  };

  const result = await createPurchaseOrderAction(purchaseOrderData);
  
  if (result.success && result.data) {
    revalidatePath('/purchase-orders', 'page');
  }
  
  return result;
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if purchase order exists
 */
export async function purchaseOrderExists(purchaseOrderId: string): Promise<boolean> {
  const purchaseOrder = await getPurchaseOrder(purchaseOrderId);
  return purchaseOrder !== null;
}

/**
 * Get purchase order count
 */
export const getPurchaseOrderCount = cache(async (filters?: PurchaseOrderFilters): Promise<number> => {
  try {
    const orders = await getPurchaseOrders(filters);
    return orders.length;
  } catch {
    return 0;
  }
});

/**
 * Get purchase order overview
 */
export async function getPurchaseOrderOverview(): Promise<{
  totalOrders: number;
  pendingApproval: number;
  approvedOrders: number;
  totalValue: number;
  recentOrders: number;
}> {
  try {
    const orders = await getPurchaseOrders();
    
    return {
      totalOrders: orders.length,
      pendingApproval: orders.filter(o => o.status === 'pending').length,
      approvedOrders: orders.filter(o => o.status === 'approved').length,
      totalValue: orders.reduce((sum, o) => sum + o.total, 0),
      recentOrders: orders.filter(o => {
        const createdAt = new Date(o.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt >= weekAgo;
      }).length,
    };
  } catch {
    return {
      totalOrders: 0,
      pendingApproval: 0,
      approvedOrders: 0,
      totalValue: 0,
      recentOrders: 0,
    };
  }
}

/**
 * Clear purchase order cache
 */
export async function clearPurchaseOrderCache(purchaseOrderId?: string): Promise<void> {
  if (purchaseOrderId) {
    revalidateTag(`purchase-order-${purchaseOrderId}`);
    revalidateTag(`purchase-order-items-${purchaseOrderId}`);
  }
  
  // Clear all purchase order caches
  Object.values(PURCHASE_ORDER_CACHE_TAGS).forEach(tag => {
    revalidateTag(tag);
  });

  // Clear list caches
  revalidateTag('purchase-order-list');
  revalidateTag('purchase-order-stats');

  // Clear paths
  revalidatePath('/purchase-orders', 'page');
  revalidatePath('/purchase-orders/analytics', 'page');
}
