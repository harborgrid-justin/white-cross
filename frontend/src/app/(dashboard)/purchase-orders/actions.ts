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

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

/**
 * Get comprehensive purchase orders statistics for dashboard
 * @returns Promise<PurchaseOrdersStats> Statistics object with procurement metrics
 */
export async function getPurchaseOrdersStats(): Promise<{
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  completedOrders: number;
  totalValue: number;
  averageOrderValue: number;
  monthlySpend: number;
  budgetUtilization: number;
  vendorCount: number;
  urgentOrders: number;
  overdueOrders: number;
}> {
  try {
    console.log('[PurchaseOrders] Loading purchase order statistics');

    // Get purchase orders data
    const orders = await getPurchaseOrders();

    // Calculate current month for filtering
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    // Calculate statistics based on purchase order schema properties
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const approvedOrders = orders.filter(o => o.status === 'approved').length;
    const rejectedOrders = orders.filter(o => o.status === 'rejected').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const totalValue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;
    
    // Calculate monthly spend
    const monthlySpend = orders
      .filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= currentMonth;
      })
      .reduce((sum, o) => sum + (o.total || 0), 0);

    // Mock budget utilization (would come from budget settings)
    const budgetUtilization = monthlySpend > 0 ? Math.min((monthlySpend / 100000) * 100, 100) : 0;

    // Count unique vendors
    const uniqueVendors = new Set(orders.filter(o => o.vendorId).map(o => o.vendorId));
    const vendorCount = uniqueVendors.size;

    // Calculate urgent and overdue orders
    const urgentOrders = orders.filter(o => o.priority === 'urgent').length;
    const today = new Date();
    const overdueOrders = orders.filter(o => {
      if (!o.expectedDelivery) return false;
      const expectedDate = new Date(o.expectedDelivery);
      return expectedDate < today && o.status !== 'completed';
    }).length;

    const stats = {
      totalOrders,
      pendingOrders,
      approvedOrders,
      rejectedOrders,
      completedOrders,
      totalValue,
      averageOrderValue,
      monthlySpend,
      budgetUtilization,
      vendorCount,
      urgentOrders,
      overdueOrders,
    };

    console.log('[PurchaseOrders] Statistics calculated:', stats);

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'purchase_orders_dashboard_stats',
      details: 'Retrieved purchase order dashboard statistics'
    });

    return stats;
  } catch (error) {
    console.error('[PurchaseOrders] Error calculating stats:', error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      approvedOrders: 0,
      rejectedOrders: 0,
      completedOrders: 0,
      totalValue: 0,
      averageOrderValue: 0,
      monthlySpend: 0,
      budgetUtilization: 0,
      vendorCount: 0,
      urgentOrders: 0,
      overdueOrders: 0,
    };
  }
}

/**
 * Get purchase orders dashboard data with recent orders and workflow metrics
 * @returns Promise<PurchaseOrdersDashboardData> Dashboard data with recent orders and approvals
 */
export async function getPurchaseOrdersDashboardData(): Promise<{
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    priority: string;
    total: number;
    vendor: string;
    timestamp: string;
    expectedDelivery?: string;
  }>;
  pendingApprovals: Array<{
    id: string;
    orderNumber: string;
    total: number;
    vendor: string;
    requestedBy: string;
    timestamp: string;
    priority: string;
  }>;
  ordersByStatus: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
    cancelled: number;
  };
  budgetTracking: {
    allocated: number;
    spent: number;
    remaining: number;
    utilizationPercent: number;
  };
  topVendors: Array<{
    vendorId: string;
    vendorName: string;
    orderCount: number;
    totalSpend: number;
  }>;
  stats: {
    totalOrders: number;
    pendingOrders: number;
    approvedOrders: number;
    rejectedOrders: number;
    completedOrders: number;
    totalValue: number;
    averageOrderValue: number;
    monthlySpend: number;
    budgetUtilization: number;
    vendorCount: number;
    urgentOrders: number;
    overdueOrders: number;
  };
}> {
  try {
    // Get stats and purchase orders data
    const stats = await getPurchaseOrdersStats();
    const orders = await getPurchaseOrders();

    // Sort orders by date descending and get recent orders (last 10)
    const sortedOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    const recentOrders = sortedOrders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || `PO-${order.id.slice(-6)}`,
      status: order.status,
      priority: order.priority || 'normal',
      total: order.total || 0,
      vendor: order.vendor?.name || 'Unknown Vendor',
      timestamp: order.createdAt,
      expectedDelivery: order.expectedDelivery,
    }));

    // Get pending approvals
    const pendingApprovals = orders
      .filter(o => o.status === 'pending')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        orderNumber: order.orderNumber || `PO-${order.id.slice(-6)}`,
        total: order.total || 0,
        vendor: order.vendor?.name || 'Unknown Vendor',
        requestedBy: order.requestedBy?.name || 'Unknown User',
        timestamp: order.createdAt,
        priority: order.priority || 'normal',
      }));

    // Calculate orders by status
    const ordersByStatus = {
      pending: orders.filter(o => o.status === 'pending').length,
      approved: orders.filter(o => o.status === 'approved').length,
      rejected: orders.filter(o => o.status === 'rejected').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };

    // Mock budget tracking (would come from budget management system)
    const budgetTracking = {
      allocated: 100000, // Mock monthly budget
      spent: stats.monthlySpend,
      remaining: Math.max(0, 100000 - stats.monthlySpend),
      utilizationPercent: stats.budgetUtilization,
    };

    // Calculate top vendors
    const vendorSpending = orders.reduce((acc, order) => {
      if (!order.vendorId) return acc;
      
      const vendorId = order.vendorId;
      const vendorName = order.vendor?.name || 'Unknown Vendor';
      const amount = order.total || 0;
      
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorId,
          vendorName,
          orderCount: 0,
          totalSpend: 0,
        };
      }
      
      acc[vendorId].orderCount++;
      acc[vendorId].totalSpend += amount;
      
      return acc;
    }, {} as Record<string, { vendorId: string; vendorName: string; orderCount: number; totalSpend: number; }>);

    const topVendors = Object.values(vendorSpending)
      .sort((a, b) => b.totalSpend - a.totalSpend)
      .slice(0, 5);

    const dashboardData = {
      recentOrders,
      pendingApprovals,
      ordersByStatus,
      budgetTracking,
      topVendors,
      stats,
    };

    console.log('[PurchaseOrders] Dashboard data prepared:', {
      recentCount: recentOrders.length,
      pendingCount: pendingApprovals.length,
      topVendorsCount: topVendors.length,
    });

    await auditLog({
      action: AUDIT_ACTIONS.ACCESS_PHI_RECORD,
      resource: 'purchase_orders_dashboard_data',
      details: 'Retrieved purchase order dashboard data'
    });

    return dashboardData;
  } catch (error) {
    console.error('[PurchaseOrders] Error loading dashboard data:', error);
    // Return safe defaults with stats fallback
    return {
      recentOrders: [],
      pendingApprovals: [],
      ordersByStatus: {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
        cancelled: 0,
      },
      budgetTracking: {
        allocated: 0,
        spent: 0,
        remaining: 0,
        utilizationPercent: 0,
      },
      topVendors: [],
      stats: await getPurchaseOrdersStats(), // Will return safe defaults
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
  revalidateTag('purchase-order-dashboard');

  // Clear paths
  revalidatePath('/purchase-orders', 'page');
  revalidatePath('/purchase-orders/analytics', 'page');
}
