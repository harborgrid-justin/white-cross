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
  apiInstance
} from './index';

import { integrationApi as realIntegrationApi } from './modules/integrationApi';
import { administrationApi as realAdministrationApi } from './modules/administrationApi';

import type {
  ApiResponse
} from '../types';

// Using any for now since these types don't exist in the types file
type AdminSettings = any;
type CreateUserRequest = any;
type UpdateUserRequest = any;
type User = any;
type Integration = any;
type IntegrationConfig = any;
type InventoryItem = any;
type Vendor = any;
type PurchaseOrder = any;
type BudgetSummary = any;
type UpdateBudgetRequest = any;

// Legacy exports for backward compatibility
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

// Real Administration API - uses actual backend implementation
export const administrationApi = {
  // System Settings
  getSettings: async (): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getSettings();
    return { success: true, data: result };
  },
  updateSettings: async (settings: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.updateSettings(settings);
    return { success: true, data: result };
  },

  // User Management
  getUsers: async (filters?: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getUsers(filters);
    return { success: true, data: result };
  },
  createUser: async (user: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.createUser(user);
    return { success: true, data: result };
  },
  updateUser: async (id: string, user: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.updateUser(id, user);
    return { success: true, data: result };
  },
  deleteUser: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    await realAdministrationApi.deleteUser(id);
    return { success: true, data: { id } };
  },

  // System Health
  getSystemHealth: async (): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getSystemHealth();
    return { success: true, data: result };
  },

  // District Management
  getDistricts: async (page: number = 1, limit: number = 50): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getDistricts(page, limit);
    return { success: true, data: result };
  },
  createDistrict: async (district: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.createDistrict(district);
    return { success: true, data: result };
  },
  updateDistrict: async (id: string, district: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.updateDistrict(id, district);
    return { success: true, data: result };
  },
  deleteDistrict: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    await realAdministrationApi.deleteDistrict(id);
    return { success: true, data: { id } };
  },

  // School Management
  getSchools: async (page: number = 1, limit: number = 50, districtId?: string): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getSchools(page, limit, districtId);
    return { success: true, data: result };
  },
  createSchool: async (school: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.createSchool(school);
    return { success: true, data: result };
  },
  updateSchool: async (id: string, school: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.updateSchool(id, school);
    return { success: true, data: result };
  },
  deleteSchool: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    await realAdministrationApi.deleteSchool(id);
    return { success: true, data: { id } };
  },

  // Configuration Management (placeholder - not yet implemented in administrationApi)
  getAllConfigurations: async (): Promise<ApiResponse<any>> => ({
    success: true,
    data: {
      configurations: []
    }
  }),
  setConfiguration: async (config: any): Promise<ApiResponse<any>> => ({
    success: true,
    data: {
      id: crypto.randomUUID(),
      ...config,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }),

  // Backup Management
  getBackupLogs: async (page: number = 1, limit: number = 50): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getBackupLogs(page, limit);
    return { success: true, data: result };
  },
  createBackup: async (): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.createBackup();
    return { success: true, data: result };
  },

  // License Management
  getLicenses: async (page: number = 1, limit: number = 50): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getLicenses(page, limit);
    return { success: true, data: result };
  },

  // Training Management (placeholder - not yet implemented in administrationApi)
  getTrainingModules: async (): Promise<ApiResponse<any>> => ({
    success: true,
    data: {
      modules: []
    }
  }),

  // Audit Logs
  getAuditLogs: async (page: number = 1, limit: number = 50, filters?: any): Promise<ApiResponse<any>> => {
    const result = await realAdministrationApi.getAuditLogs({ page, limit, ...filters });
    return { success: true, data: result };
  }
};

// Real Integration API - uses actual backend implementation
export const integrationApi = {
  getIntegrations: async (): Promise<ApiResponse<Integration[]>> => {
    const result = await realIntegrationApi.getAll();
    return { success: true, data: result.integrations };
  },
  getAll: async (): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.getAll();
    return { success: true, data: result };
  },
  getStatistics: async (): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.getStatistics();
    return { success: true, data: result };
  },
  updateIntegration: async (id: string, config: any): Promise<ApiResponse<Integration>> => {
    const result = await realIntegrationApi.update(id, config);
    return { success: true, data: result.integration };
  },
  create: async (integration: any): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.create(integration);
    return { success: true, data: result.integration };
  },
  update: async (id: string, integration: any): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.update(id, integration);
    return { success: true, data: result.integration };
  },
  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    await realIntegrationApi.delete(id);
    return { success: true, data: { id } };
  },
  testConnection: async (id: string): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.testConnection(id);
    return { success: true, data: result };
  },
  sync: async (id: string): Promise<ApiResponse<any>> => {
    const result = await realIntegrationApi.sync(id);
    return { success: true, data: result };
  }
};

export const inventoryApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    supplier?: string;
    location?: string;
    lowStock?: boolean;
    needsMaintenance?: boolean;
    isActive?: boolean;
  }): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory', { params });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get(`/api/inventory/${id}`);
    return response.data;
  },

  create: async (item: any): Promise<ApiResponse<any>> => {
    const response = await apiInstance.post('/api/inventory', item);
    return response.data;
  },

  update: async (id: string, item: any): Promise<ApiResponse<any>> => {
    const response = await apiInstance.put(`/api/inventory/${id}`, item);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await apiInstance.delete(`/api/inventory/${id}`);
    return response.data;
  },

  getAlerts: async (): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/alerts');
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/stats');
    return response.data;
  },

  getCurrentStock: async (id: string): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get(`/api/inventory/${id}/stock`);
    return response.data;
  },

  adjustStock: async (id: string, quantity: number, reason: string): Promise<ApiResponse<any>> => {
    const response = await apiInstance.post(`/api/inventory/${id}/adjust`, {
      quantity,
      reason
    });
    return response.data;
  },

  getStockHistory: async (id: string, page?: number, limit?: number): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get(`/api/inventory/${id}/history`, {
      params: { page, limit }
    });
    return response.data;
  },

  createTransaction: async (transaction: {
    inventoryItemId: string;
    type: 'PURCHASE' | 'USAGE' | 'ADJUSTMENT' | 'TRANSFER' | 'DISPOSAL';
    quantity: number;
    unitCost?: number;
    reason?: string;
    batchNumber?: string;
    expirationDate?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiInstance.post('/api/inventory/transactions', transaction);
    return response.data;
  },

  createMaintenanceLog: async (maintenance: {
    inventoryItemId: string;
    type: 'ROUTINE' | 'REPAIR' | 'CALIBRATION' | 'INSPECTION' | 'CLEANING';
    description: string;
    cost?: number;
    nextMaintenanceDate?: string;
    vendor?: string;
    notes?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await apiInstance.post('/api/inventory/maintenance', maintenance);
    return response.data;
  },

  getMaintenanceSchedule: async (startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/maintenance/schedule', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  generatePurchaseOrder: async (items: Array<{ inventoryItemId: string; quantity: number }>): Promise<ApiResponse<any>> => {
    const response = await apiInstance.post('/api/inventory/purchase-order', { items });
    return response.data;
  },

  getValuation: async (): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/valuation');
    return response.data;
  },

  getUsageAnalytics: async (startDate?: string, endDate?: string): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/analytics/usage', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  getSupplierPerformance: async (): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get('/api/inventory/analytics/suppliers');
    return response.data;
  },

  search: async (query: string, limit?: number): Promise<ApiResponse<any>> => {
    const response = await apiInstance.get(`/api/inventory/search/${query}`, {
      params: { limit }
    });
    return response.data;
  }
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
      total: budget.categories.reduce((sum: number, cat: any) => sum + cat.allocatedAmount, 0),
      spent: 0,
      remaining: budget.categories.reduce((sum: number, cat: any) => sum + cat.allocatedAmount, 0),
      utilizationPercentage: 0,
      categories: budget.categories.map((cat: any) => ({
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
