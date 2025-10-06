import { ServerRoute, Request, ResponseToolkit } from '@hapi/hapi';
import { VendorService, CreateVendorData, UpdateVendorData } from '../services/vendorService';
import Joi from 'joi';

// Get all vendors
const getVendorsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const page = parseInt(request.query.page as string) || 1;
    const limit = parseInt(request.query.limit as string) || 20;
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
const getVendorByIdHandler = async (request: Request, h: ResponseToolkit) => {
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
const createVendorHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const vendor = await VendorService.createVendor(request.payload as CreateVendorData);

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
const updateVendorHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const vendor = await VendorService.updateVendor(id, request.payload as UpdateVendorData);

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

// Delete vendor
const deleteVendorHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { id } = request.params;
    const vendor = await VendorService.deleteVendor(id);

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
const compareVendorsHandler = async (request: Request, h: ResponseToolkit) => {
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
const searchVendorsHandler = async (request: Request, h: ResponseToolkit) => {
  try {
    const { query } = request.params;
    const limit = parseInt(request.query.limit as string) || 20;

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
          contactName: Joi.string().trim().optional(),
          email: Joi.string().email().optional(),
          phone: Joi.string().trim().optional(),
          address: Joi.string().trim().optional(),
          website: Joi.string().uri().optional(),
          taxId: Joi.string().trim().optional(),
          paymentTerms: Joi.string().trim().optional(),
          notes: Joi.string().trim().optional(),
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
          contactName: Joi.string().trim().optional(),
          email: Joi.string().email().optional(),
          phone: Joi.string().trim().optional(),
          address: Joi.string().trim().optional(),
          website: Joi.string().uri().optional(),
          taxId: Joi.string().trim().optional(),
          paymentTerms: Joi.string().trim().optional(),
          notes: Joi.string().trim().optional(),
          rating: Joi.number().integer().min(1).max(5).optional(),
          isActive: Joi.boolean().optional()
        })
      }
    }
  },
  {
    method: 'DELETE',
    path: '/api/vendors/{id}',
    handler: deleteVendorHandler,
    options: {
      auth: 'jwt'
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
