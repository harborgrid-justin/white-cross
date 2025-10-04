import { ServerRoute } from '@hapi/hapi';
import { PurchaseOrderService } from '../services/purchaseOrderService';
import Joi from 'joi';

// Get purchase orders
const getPurchaseOrdersHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;

    const filters: any = {};
    if (request.query.status) filters.status = request.query.status;
    if (request.query.vendorId) filters.vendorId = request.query.vendorId;
    if (request.query.startDate) filters.startDate = new Date(request.query.startDate);
    if (request.query.endDate) filters.endDate = new Date(request.query.endDate);

    const result = await PurchaseOrderService.getPurchaseOrders(page, limit, filters);

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

// Get purchase order by ID
const getPurchaseOrderByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const order = await PurchaseOrderService.getPurchaseOrderById(id);

    return h.response({
      success: true,
      data: { order }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(404);
  }
};

// Create purchase order
const createPurchaseOrderHandler = async (request: any, h: any) => {
  try {
    const orderData = {
      ...request.payload,
      expectedDate: request.payload.expectedDate ? new Date(request.payload.expectedDate) : undefined
    };

    const order = await PurchaseOrderService.createPurchaseOrder(orderData);

    return h.response({
      success: true,
      data: { order }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update purchase order
const updatePurchaseOrderHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const updateData = {
      ...request.payload,
      expectedDate: request.payload.expectedDate ? new Date(request.payload.expectedDate) : undefined,
      receivedDate: request.payload.receivedDate ? new Date(request.payload.receivedDate) : undefined
    };

    const order = await PurchaseOrderService.updatePurchaseOrder(id, updateData);

    return h.response({
      success: true,
      data: { order }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Approve purchase order
const approvePurchaseOrderHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const approvedBy = request.auth.credentials?.userId;

    const order = await PurchaseOrderService.approvePurchaseOrder(id, approvedBy);

    return h.response({
      success: true,
      data: { order }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Receive items
const receiveItemsHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const performedBy = request.auth.credentials?.userId;

    const order = await PurchaseOrderService.receiveItems(id, request.payload, performedBy);

    return h.response({
      success: true,
      data: { order }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Cancel purchase order
const cancelPurchaseOrderHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const { reason } = request.payload;

    const order = await PurchaseOrderService.cancelPurchaseOrder(id, reason);

    return h.response({
      success: true,
      data: { order }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Get items needing reorder
const getItemsNeedingReorderHandler = async (request: any, h: any) => {
  try {
    const items = await PurchaseOrderService.getItemsNeedingReorder();

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

// Define purchase order routes for Hapi
export const purchaseOrderRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/purchase-orders',
    handler: getPurchaseOrdersHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          status: Joi.string().optional(),
          vendorId: Joi.string().optional(),
          startDate: Joi.date().iso().optional(),
          endDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/purchase-orders/{id}',
    handler: getPurchaseOrderByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/purchase-orders',
    handler: createPurchaseOrderHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          vendorId: Joi.string().required(),
          items: Joi.array().items(Joi.object({
            inventoryItemId: Joi.string().required(),
            quantity: Joi.number().integer().min(1).required(),
            unitCost: Joi.number().required()
          })).min(1).required(),
          expectedDate: Joi.date().iso().optional(),
          tax: Joi.number().optional(),
          shipping: Joi.number().optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/purchase-orders/{id}',
    handler: updatePurchaseOrderHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          status: Joi.string().valid('PENDING', 'APPROVED', 'ORDERED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED').optional(),
          expectedDate: Joi.date().iso().optional(),
          receivedDate: Joi.date().iso().optional()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/purchase-orders/{id}/approve',
    handler: approvePurchaseOrderHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/purchase-orders/{id}/receive',
    handler: receiveItemsHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          items: Joi.array().items(Joi.object({
            purchaseOrderItemId: Joi.string().required(),
            receivedQty: Joi.number().integer().min(1).required()
          })).min(1).required()
        })
      }
    }
  },
  {
    method: 'POST',
    path: '/api/purchase-orders/{id}/cancel',
    handler: cancelPurchaseOrderHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          reason: Joi.string().trim().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/purchase-orders/reorder/needed',
    handler: getItemsNeedingReorderHandler,
    options: {
      auth: 'jwt'
    }
  }
];
