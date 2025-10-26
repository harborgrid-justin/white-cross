/**
 * Inventory API Endpoints
 * To be imported and merged with main API_ENDPOINTS
 */

export const INVENTORY_ENDPOINTS = {
  MEDICATIONS: {
    BASE: '/medications',
  },
  INVENTORY: {
    ITEMS: '/inventory/items',
    LOCATIONS: '/inventory/locations',
    STOCK: '/inventory/stock',
    BATCHES: '/inventory/batches',
    TRANSACTIONS: '/inventory/transactions',
    TRANSFERS: '/inventory/transfers',
    ALERTS: '/inventory/alerts',
    ANALYTICS: '/inventory/analytics',
    DASHBOARD: '/inventory/dashboard',
    REPORTS: '/inventory/reports',
  },
} as const;
