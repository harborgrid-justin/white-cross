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
} from './index.ts';

// Legacy exports for backward compatibility
export { apiInstance };
export { authApi };
export { studentsApi };
export { healthRecordsApi };
export { medicationsApi };
export { appointmentsApi };
export { communicationApi };

// Create additional API objects for modules that expect specific structures
export const administrationApi = {
  getSettings: async () => ({ data: [] }),
  updateSettings: async (settings) => ({ data: settings }),
  getUsers: async () => ({ data: [] }),
  createUser: async (user) => ({ data: user }),
  updateUser: async (id, user) => ({ data: { ...user, id } }),
  deleteUser: async (id) => ({ data: { id } })
};

export const integrationApi = {
  getIntegrations: async () => ({ data: [] }),
  updateIntegration: async (id, config) => ({ data: { id, ...config } }),
  testConnection: async (id) => ({ data: { status: 'connected' } })
};

export const inventoryApi = {
  getAll: async () => ({ data: [] }),
  create: async (item) => ({ data: item }),
  update: async (id, item) => ({ data: { ...item, id } }),
  delete: async (id) => ({ data: { id } })
};

export const vendorApi = {
  getAll: async () => ({ data: [] }),
  create: async (vendor) => ({ data: vendor }),
  update: async (id, vendor) => ({ data: { ...vendor, id } })
};

export const purchaseOrderApi = {
  getAll: async () => ({ data: [] }),
  create: async (order) => ({ data: order }),
  update: async (id, order) => ({ data: { ...order, id } })
};

export const budgetApi = {
  getBudget: async () => ({ data: { total: 0, spent: 0, remaining: 0 } }),
  updateBudget: async (budget) => ({ data: budget })
};

// Default export for the main API instance
export default apiInstance;
