/**
 * Inventory Routes
 * HTTP endpoints for inventory management, stock control, purchase orders, and supplier management
 * All routes prefixed with /api/v1/inventory
 */

import { ServerRoute } from '@hapi/hapi';
import { asyncHandler } from '../../../shared/utils';
import { InventoryController } from '../controllers/inventory.controller';
import {
  listItemsQuerySchema,
  itemIdParamSchema,
  createItemSchema,
  updateItemSchema,
  stockLevelsQuerySchema,
  adjustStockSchema,
  recordStockCountSchema,
  stockHistoryQuerySchema,
  listPurchaseOrdersQuerySchema,
  createPurchaseOrderSchema,
  receivePurchaseOrderSchema,
  purchaseOrderIdParamSchema,
  listSuppliersQuerySchema,
  createSupplierSchema,
  updateSupplierSchema,
  supplierIdParamSchema,
  analyticsQuerySchema,
  usageReportQuerySchema
} from '../validators/inventory.validators';

/**
 * INVENTORY ITEMS CRUD ROUTES
 */

const listItemsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/items',
  handler: asyncHandler(InventoryController.listItems),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Operations', 'v1'],
    description: 'Get all inventory items with pagination and filters',
    notes: 'Returns paginated list of inventory items with current stock levels. Supports filtering by category (MEDICATION, MEDICAL_SUPPLY, EQUIPMENT, FIRST_AID, OFFICE_SUPPLY, PPE, OTHER), supplier, location, low stock status, and active status. Includes stock level indicators and earliest expiration dates.',
    validate: {
      query: listItemsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Inventory items retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getItemRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/items/{id}',
  handler: asyncHandler(InventoryController.getItem),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Operations', 'v1'],
    description: 'Get inventory item by ID',
    notes: 'Returns detailed item information including current stock level, recent transactions (last 10), and maintenance history (last 5). Used for item detail views and stock verification.',
    validate: {
      params: itemIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Item retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' }
        }
      }
    }
  }
};

const createItemRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/inventory/items',
  handler: asyncHandler(InventoryController.createItem),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Operations', 'v1'],
    description: 'Create new inventory item',
    notes: 'Adds a new item to inventory catalog. Validates: (1) Name uniqueness - prevents duplicate item names, (2) Category validity - must be valid healthcare category, (3) Cost limits - unit cost cannot exceed $999,999.99, (4) Reorder logic - reorder quantity must be positive. Supports expiration tracking, lot numbers, and cost tracking. Requires NURSE or ADMIN role.',
    validate: {
      payload: createItemSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Item created successfully' },
          '400': { description: 'Validation error - Invalid data or duplicate item name' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires NURSE or ADMIN role' }
        }
      }
    }
  }
};

const updateItemRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/inventory/items/{id}',
  handler: asyncHandler(InventoryController.updateItem),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Operations', 'v1'],
    description: 'Update inventory item',
    notes: 'Updates item details including name, category, cost, reorder levels, and location. Does not affect stock quantities - use stock adjustment endpoint for that. All updates are logged for audit trail. Can mark items as inactive for archival without deleting history.',
    validate: {
      params: itemIdParamSchema,
      payload: updateItemSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Item updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' }
        }
      }
    }
  }
};

const deleteItemRoute: ServerRoute = {
  method: 'DELETE',
  path: '/api/v1/inventory/items/{id}',
  handler: asyncHandler(InventoryController.deleteItem),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Operations', 'v1'],
    description: 'Delete inventory item (soft delete)',
    notes: 'Archives inventory item by marking as inactive. Does not physically delete - preserves all historical data for compliance and audit purposes. Item will no longer appear in active lists but remains accessible in reports and transaction history. Can be reactivated by updating isActive to true.',
    validate: {
      params: itemIdParamSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '204': { description: 'Item archived successfully (no content)' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' }
        }
      }
    }
  }
};

/**
 * STOCK MANAGEMENT ROUTES
 */

const getStockLevelsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/stock',
  handler: asyncHandler(InventoryController.getStockLevels),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Stock', 'Operations', 'v1'],
    description: 'Get stock levels across all items',
    notes: 'Returns current stock levels for all active inventory items with pagination. Includes calculated fields: currentStock (sum of all transactions), isLowStock (current <= reorder level), and earliestExpiration (next expiration date). Used for stock monitoring dashboards and inventory reports.',
    validate: {
      query: stockLevelsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Stock levels retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const adjustStockRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/inventory/stock/{id}/adjust',
  handler: asyncHandler(InventoryController.adjustStock),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Stock', 'Operations', 'v1'],
    description: 'Adjust stock levels (add/remove)',
    notes: 'Manually adjusts stock quantity for corrections, waste disposal, transfers, or usage. Positive values add stock, negative values remove. Creates audit trail transaction with: (1) Adjustment amount, (2) Reason (required), (3) Performed by (auto-captured from JWT), (4) Previous and new stock levels. Cannot be used for purchase orders - use purchase order workflow instead. All adjustments are permanent and logged.',
    validate: {
      params: itemIdParamSchema,
      payload: adjustStockSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Stock adjusted successfully' },
          '400': { description: 'Validation error - Invalid quantity or missing reason' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' }
        }
      }
    }
  }
};

const getLowStockAlertsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/stock/low',
  handler: asyncHandler(InventoryController.getLowStockAlerts),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Stock', 'Alerts', 'Operations', 'v1'],
    description: 'Get low stock alerts',
    notes: 'Returns items requiring attention due to low or depleted stock. Two categories: (1) Low Stock - items at or below reorder level but not empty, (2) Out of Stock - items with zero quantity. Used for reorder notifications, dashboard alerts, and automated purchase order generation. Helps prevent stockouts of critical medical supplies.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Stock alerts retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const recordStockCountRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/inventory/stock/{id}/count',
  handler: asyncHandler(InventoryController.recordStockCount),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Stock', 'Operations', 'v1'],
    description: 'Record physical stock count',
    notes: 'Records results of physical inventory count and automatically adjusts stock if discrepancy found. Compares counted quantity to system quantity and creates adjustment transaction if different. Used for: (1) Regular inventory audits, (2) Compliance verification, (3) Shrinkage detection, (4) Expiration management. All counts are logged with performer, date, and notes for audit compliance.',
    validate: {
      params: itemIdParamSchema,
      payload: recordStockCountSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Stock count recorded successfully' },
          '400': { description: 'Validation error - Invalid count quantity' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' }
        }
      }
    }
  }
};

const getStockHistoryRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/stock/history/{id}',
  handler: asyncHandler(InventoryController.getStockHistory),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Stock', 'Operations', 'v1'],
    description: 'Get stock transaction history for an item',
    notes: 'Returns complete transaction history for an inventory item with pagination. Each transaction includes: type (PURCHASE, USAGE, ADJUSTMENT, TRANSFER, DISPOSAL), quantity change, running stock total after transaction, performed by user, timestamp, batch number, expiration date (if applicable), and reason/notes. Used for: compliance audits, usage analysis, shrinkage investigation, and inventory reconciliation.',
    validate: {
      params: itemIdParamSchema,
      query: stockHistoryQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Stock history retrieved successfully with pagination' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Item not found' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * PURCHASE ORDER ROUTES
 */

const listPurchaseOrdersRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/orders',
  handler: asyncHandler(InventoryController.listPurchaseOrders),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Purchase Orders', 'Operations', 'v1'],
    description: 'Get purchase orders with filters',
    notes: 'Returns purchase orders with optional filtering by status (PENDING, APPROVED, ORDERED, PARTIALLY_RECEIVED, RECEIVED, CANCELLED) and vendor. Each order includes: order number, vendor details, order/expected/received dates, line items with quantities and costs, subtotal/tax/shipping/total, and current status. Used for order management, receiving workflows, and budget tracking.',
    validate: {
      query: listPurchaseOrdersQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Purchase orders retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const createPurchaseOrderRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/inventory/orders',
  handler: asyncHandler(InventoryController.createPurchaseOrder),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Purchase Orders', 'Operations', 'v1'],
    description: 'Create new purchase order',
    notes: 'Creates purchase order for ordering supplies from vendors. Validates: (1) Vendor exists and is active, (2) Order number is unique, (3) All items exist and are active, (4) No duplicate items in order, (5) Quantities are positive, (6) Costs within limits, (7) Expected date after order date. Automatically calculates subtotal. Supports 1-100 line items per order. Creates complete audit trail.',
    validate: {
      payload: createPurchaseOrderSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Purchase order created successfully' },
          '400': { description: 'Validation error - Invalid order data, duplicate order number, or inactive vendor/items' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Vendor or inventory item not found' }
        }
      }
    }
  }
};

const receivePurchaseOrderRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/inventory/orders/{id}/receive',
  handler: asyncHandler(InventoryController.receivePurchaseOrder),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Purchase Orders', 'Operations', 'v1'],
    description: 'Receive purchase order and update stock',
    notes: 'Updates purchase order status when items are received. Status transitions: PENDING → APPROVED → ORDERED → PARTIALLY_RECEIVED/RECEIVED or CANCELLED. Setting to RECEIVED automatically updates stock levels for all items in the order. Validates status transition workflow to prevent invalid state changes. Records received date (defaults to now). Used for receiving workflow and inventory replenishment.',
    validate: {
      params: purchaseOrderIdParamSchema,
      payload: receivePurchaseOrderSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Purchase order status updated successfully' },
          '400': { description: 'Validation error - Invalid status transition' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Purchase order not found' }
        }
      }
    }
  }
};

/**
 * SUPPLIER/VENDOR ROUTES
 */

const listSuppliersRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/suppliers',
  handler: asyncHandler(InventoryController.listSuppliers),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Suppliers', 'Operations', 'v1'],
    description: 'Get all suppliers/vendors',
    notes: 'Returns list of vendors/suppliers with optional active status filter. Each supplier includes: name, contact information (name, email, phone), address, website, tax ID, payment terms, rating (1-5 stars), notes, and active status. Used for vendor selection in purchase orders and vendor management.',
    validate: {
      query: listSuppliersQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Suppliers retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const createSupplierRoute: ServerRoute = {
  method: 'POST',
  path: '/api/v1/inventory/suppliers',
  handler: asyncHandler(InventoryController.createSupplier),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Suppliers', 'Operations', 'v1'],
    description: 'Create new supplier/vendor',
    notes: 'Adds new vendor to supplier database. Only name is required - all other fields optional. Supports: contact information, business address, website URL, tax ID/EIN, payment terms (e.g., "Net 30"), performance rating (1-5), and notes. Used for vendor onboarding before creating purchase orders. Requires ADMIN role.',
    validate: {
      payload: createSupplierSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '201': { description: 'Supplier created successfully' },
          '400': { description: 'Validation error - Invalid supplier data' },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Requires ADMIN role' }
        }
      }
    }
  }
};

const updateSupplierRoute: ServerRoute = {
  method: 'PUT',
  path: '/api/v1/inventory/suppliers/{id}',
  handler: asyncHandler(InventoryController.updateSupplier),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Suppliers', 'Operations', 'v1'],
    description: 'Update supplier/vendor',
    notes: 'Updates vendor information including contact details, address, payment terms, rating, and active status. Can deactivate vendors by setting isActive to false - inactive vendors cannot be used for new purchase orders but historical data is preserved. All updates are logged for audit trail.',
    validate: {
      params: supplierIdParamSchema,
      payload: updateSupplierSchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Supplier updated successfully' },
          '400': { description: 'Validation error - Invalid update data' },
          '401': { description: 'Unauthorized' },
          '404': { description: 'Supplier not found' }
        }
      }
    }
  }
};

/**
 * ANALYTICS & REPORTING ROUTES
 */

const getAnalyticsRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/analytics',
  handler: asyncHandler(InventoryController.getAnalytics),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Analytics', 'Operations', 'v1'],
    description: 'Get inventory analytics and statistics',
    notes: 'Returns comprehensive inventory analytics including: (1) Overview - total items, active items, total valuation, low/out of stock counts, (2) Category Breakdown - item count, quantity, and value by category, (3) Valuation - total inventory value by category, (4) Top Used Items - most frequently used items in last 30 days. Used for executive dashboards, budget planning, and inventory optimization.',
    validate: {
      query: analyticsQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Analytics retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getUsageReportRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/reports/usage',
  handler: asyncHandler(InventoryController.getUsageReport),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Reports', 'Analytics', 'Operations', 'v1'],
    description: 'Get usage report for date range',
    notes: 'Generates usage analysis report for specified period (defaults to last 30 days). Includes: (1) Usage Analytics - transaction count, total/average usage by item and category, (2) Inventory Turnover - turnover rate calculation (usage / average stock) for each item, (3) Period Summary - date range and duration. Used for: consumption forecasting, budget planning, reorder optimization, and identifying high-usage items.',
    validate: {
      query: usageReportQuerySchema
    },
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Usage report generated successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

const getSupplierPerformanceRoute: ServerRoute = {
  method: 'GET',
  path: '/api/v1/inventory/suppliers/performance',
  handler: asyncHandler(InventoryController.getSupplierPerformance),
  options: {
    auth: 'jwt',
    tags: ['api', 'Inventory', 'Suppliers', 'Analytics', 'Operations', 'v1'],
    description: 'Get supplier performance analytics',
    notes: 'Returns supplier performance metrics including: item count (number of items supplied), average unit cost (cost analysis), total purchased (quantity ordered historically), total spent (dollar amount spent). Ordered by total spend (highest first). Used for vendor evaluation, contract negotiations, and supplier consolidation decisions.',
    plugins: {
      'hapi-swagger': {
        responses: {
          '200': { description: 'Supplier performance retrieved successfully' },
          '401': { description: 'Unauthorized' },
          '500': { description: 'Internal server error' }
        }
      }
    }
  }
};

/**
 * EXPORT ALL ROUTES
 */

export const inventoryRoutes: ServerRoute[] = [
  // Inventory Items CRUD (5 routes)
  listItemsRoute,
  getItemRoute,
  createItemRoute,
  updateItemRoute,
  deleteItemRoute,

  // Stock Management (5 routes)
  getStockLevelsRoute,
  adjustStockRoute,
  getLowStockAlertsRoute,
  recordStockCountRoute,
  getStockHistoryRoute,

  // Purchase Orders (3 routes)
  listPurchaseOrdersRoute,
  createPurchaseOrderRoute,
  receivePurchaseOrderRoute,

  // Suppliers/Vendors (3 routes)
  listSuppliersRoute,
  createSupplierRoute,
  updateSupplierRoute,

  // Analytics & Reports (3 routes)
  getAnalyticsRoute,
  getUsageReportRoute,
  getSupplierPerformanceRoute
];
