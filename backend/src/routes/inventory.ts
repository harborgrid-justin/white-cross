/**
 * LOC: DD7027552D
 * WC-RTE-INV-039 | inventory.ts - Medical Supply Inventory Management API Routes
 *
 * UPSTREAM (imports from):
 *   - inventoryService.ts (services/inventoryService.ts)
 *
 * DOWNSTREAM (imported by):
 *   - index.ts (index.ts)
 */

/**
 * WC-RTE-INV-039 | inventory.ts - Medical Supply Inventory Management API Routes
 * Purpose: Hapi.js routes for comprehensive healthcare inventory management including stock control, maintenance tracking, and purchase automation
 * Upstream: ../services/inventoryService/InventoryService | Dependencies: @hapi/hapi, joi
 * Downstream: Frontend inventory UI, stock management systems, purchase order automation, maintenance scheduling | Called by: Inventory management interfaces, automated reorder systems
 * Related: ../services/inventoryService.ts, medications.ts, purchaseOrder.ts, vendor.ts, budget.ts
 * Exports: inventoryRoutes | Key Services: Item CRUD, stock transactions, maintenance logs, alerts, analytics, purchase order generation, supplier performance
 * Last Updated: 2025-10-18 | File Type: .ts | Lines: ~400
 * Critical Path: Authentication → Inventory validation → Stock operations → Transaction logging → Alert generation → Response
 * LLM Context: Medical supply inventory system with 18 endpoints for managing stock levels, transactions, maintenance, analytics, and automated reordering for healthcare facilities
 */

import { ServerRoute } from '@hapi/hapi';
import { InventoryService } from '../services/inventoryService';
import Joi from 'joi';

// Get inventory items
const getInventoryItemsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.category) filters.category = request.query.category;
    if (request.query.supplier) filters.supplier = request.query.supplier;
    if (request.query.location) filters.location = request.query.location;
    if (request.query.lowStock !== undefined) filters.lowStock = request.query.lowStock === 'true';
    if (request.query.needsMaintenance !== undefined) filters.needsMaintenance = request.query.needsMaintenance === 'true';
    if (request.query.isActive !== undefined) filters.isActive = request.query.isActive === 'true';

    const result = await InventoryService.getInventoryItems(page, limit, filters);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create new inventory item
const createInventoryItemHandler = async (request: any, h: any) => {
  try {
    const item = await InventoryService.createInventoryItem(request.payload);

    return h.response({
      success: true,
      data: { item }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update inventory item
const updateInventoryItemHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const item = await InventoryService.updateInventoryItem(id, request.payload);

    return h.response({
      success: true,
      data: { item }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Create inventory transaction
const createInventoryTransactionHandler = async (request: any, h: any) => {
  try {
    const performedBy = request.auth.credentials?.userId;

    const transaction = await InventoryService.createInventoryTransaction({
      ...request.payload,
      performedBy,
      expirationDate: request.payload.expirationDate ? new Date(request.payload.expirationDate) : undefined
    });

    return h.response({
      success: true,
      data: { transaction }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get current stock for an item
const getCurrentStockHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const currentStock = await InventoryService.getCurrentStock(id);

    return h.response({
      success: true,
      data: { currentStock }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get inventory alerts
const getInventoryAlertsHandler = async (request: any, h: any) => {
  try {
    const alerts = await InventoryService.getInventoryAlerts();

    return h.response({
      success: true,
      data: { alerts }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Create maintenance log
const createMaintenanceLogHandler = async (request: any, h: any) => {
  try {
    const performedBy = request.auth.credentials?.userId;

    const maintenanceLog = await InventoryService.createMaintenanceLog({
      ...request.payload,
      performedBy,
      nextMaintenanceDate: request.payload.nextMaintenanceDate ? new Date(request.payload.nextMaintenanceDate) : undefined
    });

    return h.response({
      success: true,
      data: { maintenanceLog }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get maintenance schedule
const getMaintenanceScheduleHandler = async (request: any, h: any) => {
  try {
    const startDate = request.query.startDate ? new Date(request.query.startDate) : new Date();
    const endDate = request.query.endDate ? new Date(request.query.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const schedule = await InventoryService.getMaintenanceSchedule(startDate, endDate);

    return h.response({
      success: true,
      data: { schedule }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Generate purchase order
const generatePurchaseOrderHandler = async (request: any, h: any) => {
  try {
    const { items } = request.payload;
    const purchaseOrder = await InventoryService.generatePurchaseOrder(items);

    return h.response({
      success: true,
      data: { purchaseOrder }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get inventory valuation
const getInventoryValuationHandler = async (request: any, h: any) => {
  try {
    const valuation = await InventoryService.getInventoryValuation();

    return h.response({
      success: true,
      data: { valuation }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get usage analytics
const getUsageAnalyticsHandler = async (request: any, h: any) => {
  try {
    const startDate = request.query.startDate ? new Date(request.query.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = request.query.endDate ? new Date(request.query.endDate) : new Date();

    const analytics = await InventoryService.getUsageAnalytics(startDate, endDate);

    return h.response({
      success: true,
      data: { analytics }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get supplier performance
const getSupplierPerformanceHandler = async (request: any, h: any) => {
  try {
    const performance = await InventoryService.getSupplierPerformance();

    return h.response({
      success: true,
      data: { performance }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Search inventory items
const searchInventoryItemsHandler = async (request: any, h: any) => {
  try {
    const { query } = request.params;
    const limit = parseInt(request.query.limit) || 20;

    const items = await InventoryService.searchInventoryItems(query, limit);

    return h.response({
      success: true,
      data: { items }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get single inventory item
const getInventoryItemHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const item = await InventoryService.getInventoryItem(id);

    return h.response({
      success: true,
      data: { item }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error.message === 'Inventory item not found' ? 404 : 500);
  }
};

// Delete inventory item
const deleteInventoryItemHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const item = await InventoryService.deleteInventoryItem(id);

    return h.response({
      success: true,
      data: { item }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error.message === 'Inventory item not found' ? 404 : 500);
  }
};

// Adjust stock
const adjustStockHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { quantity, reason } = request.payload;
    const performedBy = request.auth.credentials?.userId;

    const result = await InventoryService.adjustStock(id, quantity, reason, performedBy);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(error.message === 'Inventory item not found' ? 404 : 400);
  }
};

// Get stock history
const getStockHistoryHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 50;

    const result = await InventoryService.getStockHistory(id, page, limit);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Get inventory statistics
const getInventoryStatsHandler = async (request: any, h: any) => {
  try {
    const stats = await InventoryService.getInventoryStats();

    return h.response({
      success: true,
      data: stats
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define inventory routes for Hapi
export const inventoryRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/inventory',
    handler: getInventoryItemsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          category: Joi.string().optional(),
          supplier: Joi.string().optional(),
          location: Joi.string().optional(),
          lowStock: Joi.boolean().optional(),
          needsMaintenance: Joi.boolean().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/inventory',
    handler: createInventoryItemHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required(),
          category: Joi.string().trim().required(),
          reorderLevel: Joi.number().integer().min(0).required(),
          reorderQuantity: Joi.number().integer().min(1).required(),
          unitCost: Joi.number().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/inventory/{id}',
    handler: updateInventoryItemHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().optional(),
          category: Joi.string().trim().optional(),
          reorderLevel: Joi.number().integer().min(0).optional(),
          reorderQuantity: Joi.number().integer().min(1).optional(),
          unitCost: Joi.number().optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/inventory/transactions',
    handler: createInventoryTransactionHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          inventoryItemId: Joi.string().required(),
          type: Joi.string().valid('PURCHASE', 'USAGE', 'ADJUSTMENT', 'TRANSFER', 'DISPOSAL').required(),
          quantity: Joi.number().integer().min(1).required(),
          unitCost: Joi.number().optional(),
          expirationDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/{id}/stock',
    handler: getCurrentStockHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/alerts',
    handler: getInventoryAlertsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/inventory/maintenance',
    handler: createMaintenanceLogHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          inventoryItemId: Joi.string().required(),
          type: Joi.string().valid('ROUTINE', 'REPAIR', 'CALIBRATION', 'INSPECTION', 'CLEANING').required(),
          description: Joi.string().trim().required(),
          cost: Joi.number().optional(),
          nextMaintenanceDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/maintenance/schedule',
    handler: getMaintenanceScheduleHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          startDate: Joi.date().iso().optional(),
          endDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/inventory/purchase-order',
    handler: generatePurchaseOrderHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          items: Joi.array().items(Joi.object({
            inventoryItemId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required()
          })).min(1).required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/valuation',
    handler: getInventoryValuationHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/analytics/usage',
    handler: getUsageAnalyticsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          startDate: Joi.date().iso().optional(),
          endDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/analytics/suppliers',
    handler: getSupplierPerformanceHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/search/{query}',
    handler: searchInventoryItemsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/{id}',
    handler: getInventoryItemHandler,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/inventory/{id}',
    handler: deleteInventoryItemHandler,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/inventory/{id}/adjust',
    handler: adjustStockHandler,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        payload: Joi.object({
          quantity: Joi.number().integer().required(),
          reason: Joi.string().trim().required()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/{id}/history',
    handler: getStockHistoryHandler,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.string().required()
        }),
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(50)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/inventory/stats',
    handler: getInventoryStatsHandler,
    options: {
      auth: 'jwt'
    }
  }
];
