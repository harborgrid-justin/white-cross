import { ServerRoute } from '@hapi/hapi';
import { VendorService } from '../services/vendorService';
import Joi from 'joi';

// Get all vendors
const getVendorsHandler = async (request: any, h: any) => {
  try {
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 20;
    const activeOnly = request.query.activeOnly !== 'false';

    const result = await VendorService.getVendors(page, limit, activeOnly);

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

// Get vendor by ID
const getVendorByIdHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const result = await VendorService.getVendorById(id);

    return h.response({
      success: true,
      data: result
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(404);
  }
};

// Create vendor
const createVendorHandler = async (request: any, h: any) => {
  try {
    const vendor = await VendorService.createVendor(request.payload);

    return h.response({
      success: true,
      data: { vendor }
    }).code(201);
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Update vendor
const updateVendorHandler = async (request: any, h: any) => {
  try {
    const { id } = request.params;
    const vendor = await VendorService.updateVendor(id, request.payload);

    return h.response({
      success: true,
      data: { vendor }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(400);
  }
};

// Compare vendors for an item
const compareVendorsHandler = async (request: any, h: any) => {
  try {
    const { itemName } = request.params;
    const comparison = await VendorService.compareVendors(itemName);

    return h.response({
      success: true,
      data: { comparison }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Search vendors
const searchVendorsHandler = async (request: any, h: any) => {
  try {
    const { query } = request.params;
    const limit = parseInt(request.query.limit) || 20;

    const vendors = await VendorService.searchVendors(query, limit);

    return h.response({
      success: true,
      data: { vendors }
    });
  } catch (error) {
    return h.response({
      success: false,
      error: { message: (error as Error).message }
    }).code(500);
  }
};

// Define vendor routes for Hapi
export const vendorRoutes: ServerRoute[] = [
  {
    method: 'GET',
    path: '/api/vendors',
    handler: getVendorsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1).default(1),
          limit: Joi.number().integer().min(1).max(100).default(20),
          activeOnly: Joi.boolean().default(true)
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/vendors/{id}',
    handler: getVendorByIdHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'POST',
    path: '/api/vendors',
    handler: createVendorHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().required(),
          email: Joi.string().email().optional(),
          rating: Joi.number().integer().min(1).max(5).optional()
        })
      }
    }
  },
  {
    method: 'PUT',
    path: '/api/vendors/{id}',
    handler: updateVendorHandler,
    options: {
      auth: 'jwt',
      validate: {
        payload: Joi.object({
          name: Joi.string().trim().optional(),
          email: Joi.string().email().optional(),
          rating: Joi.number().integer().min(1).max(5).optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'GET',
    path: '/api/vendors/compare/{itemName}',
    handler: compareVendorsHandler,
    options: {
      auth: 'jwt'
    }
  },
  {
    method: 'GET',
    path: '/api/vendors/search/{query}',
    handler: searchVendorsHandler,
    options: {
      auth: 'jwt',
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(100).default(20)
        })
      }
    }
  }
];
