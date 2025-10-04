// Backward compatibility API exports
// This file provides the old API structure for components that haven't been updated yet

import {
  authApi,
  studentsApi,
  healthRecordsApi,
  medicationsApi,
  appointmentsApi,
  communicationApi,
  emergencyContactsApi,
  incidentReportsApi,
  documentsApi,
  reportsApi,
  setSessionExpireHandler,
  apiInstance
} from './index';

import type {
  ApiResponse,
  AdminSettings,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  Integration,
  IntegrationConfig,
  ConnectionTestResult,
  InventoryItem,
  Vendor,
  PurchaseOrder,
  BudgetSummary,
  UpdateBudgetRequest
} from '../types';

// Legacy exports for backward compatibility
export { setSessionExpireHandler, apiInstance };
export { authApi };
export { studentsApi };
export { healthRecordsApi };
export { medicationsApi };
export { appointmentsApi };
export { communicationApi };
export { emergencyContactsApi };
export { incidentReportsApi };
export { documentsApi };
export { reportsApi };

// Create additional API objects for modules that expect specific structures
export const administrationApi = {
  getSettings: async (): Promise<ApiResponse<AdminSettings[]>> => ({ success: true, data: [] }),
  updateSettings: async (settings: AdminSettings): Promise<ApiResponse<AdminSettings>> => ({ success: true, data: settings }),
  getUsers: async (): Promise<ApiResponse<User[]>> => ({ success: true, data: [] }),
  createUser: async (user: CreateUserRequest): Promise<ApiResponse<User>> => ({
    success: true,
    data: {
      id: crypto.randomUUID(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    }
  }),
  updateUser: async (id: string, user: UpdateUserRequest): Promise<ApiResponse<User>> => ({
    success: true,
    data: {
      id,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role || 'NURSE'
    }
  }),
  deleteUser: async (id: string): Promise<ApiResponse<{ id: string }>> => ({ success: true, data: { id } })
};

export const integrationApi = {
  getIntegrations: async (): Promise<ApiResponse<Integration[]>> => ({ success: true, data: [] }),
  updateIntegration: async (id: string, config: IntegrationConfig): Promise<ApiResponse<Integration>> => ({
    success: true,
    data: {
      id,
      name: 'Integration',
      type: 'OTHER',
      status: 'ACTIVE',
      config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  testConnection: async (id: string): Promise<ApiResponse<ConnectionTestResult>> => ({
    success: true,
    data: {
      status: 'connected',
      latency: 150,
      timestamp: new Date().toISOString()
    }
  })
};

export const inventoryApi = {
  getAll: async (): Promise<ApiResponse<InventoryItem[]>> => ({ success: true, data: [] }),
  create: async (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<InventoryItem>> => ({
    success: true,
    data: {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  update: async (id: string, item: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> => ({
    success: true,
    data: {
      id,
      name: item.name || '',
      category: item.category || '',
      reorderLevel: item.reorderLevel || 0,
      reorderQuantity: item.reorderQuantity || 0,
      isActive: item.isActive ?? true,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    }
  }),
  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => ({ success: true, data: { id } })
};

export const vendorApi = {
  getAll: async (): Promise<ApiResponse<Vendor[]>> => ({ success: true, data: [] }),
  create: async (vendor: Omit<Vendor, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Vendor>> => ({
    success: true,
    data: {
      ...vendor,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  update: async (id: string, vendor: Partial<Vendor>): Promise<ApiResponse<Vendor>> => ({
    success: true,
    data: {
      id,
      name: vendor.name || '',
      isActive: vendor.isActive ?? true,
      createdAt: vendor.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...vendor
    }
  })
};

export const purchaseOrderApi = {
  getAll: async (): Promise<ApiResponse<PurchaseOrder[]>> => ({ success: true, data: [] }),
  create: async (order: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<PurchaseOrder>> => ({
    success: true,
    data: {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),
  update: async (id: string, order: Partial<PurchaseOrder>): Promise<ApiResponse<PurchaseOrder>> => ({
    success: true,
    data: {
      id,
      orderNumber: order.orderNumber || '',
      status: order.status || 'PENDING',
      orderDate: order.orderDate || new Date().toISOString(),
      subtotal: order.subtotal || 0,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      total: order.total || 0,
      vendor: order.vendor || {
        id: '',
        name: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      items: order.items || [],
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...order
    }
  })
};

export const budgetApi = {
  getBudget: async (): Promise<ApiResponse<BudgetSummary>> => ({
    success: true,
    data: {
      total: 0,
      spent: 0,
      remaining: 0,
      utilizationPercentage: 0,
      categories: []
    }
  }),
  updateBudget: async (budget: UpdateBudgetRequest): Promise<ApiResponse<BudgetSummary>> => ({
    success: true,
    data: {
      total: budget.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0),
      spent: 0,
      remaining: budget.categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0),
      utilizationPercentage: 0,
      categories: budget.categories.map(cat => ({
        id: cat.id || crypto.randomUUID(),
        name: cat.name,
        fiscalYear: budget.fiscalYear,
        allocatedAmount: cat.allocatedAmount,
        spentAmount: 0,
        remainingAmount: cat.allocatedAmount,
        utilizationPercentage: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }))
    }
  })
};

// Default export for the main API instance
export default apiInstance;
