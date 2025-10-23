# Backend API Structure Template

This template provides instructions for creating consistent backend API structures in the White Cross application. Use the existing backend structure in `/backend/src/` as reference implementation.

## Overview

The backend follows a modular, enterprise-grade architecture with:
- **Hapi.js framework** for HTTP server and routing
- **Sequelize ORM** for database operations
- **Modular route organization** with versioned APIs (v1, v2, etc.)
- **Service layer architecture** for business logic
- **Comprehensive middleware** for authentication, authorization, logging, and security
- **Type-safe validation** using Joi schemas
- **Enterprise monitoring** and error handling

## Directory Structure

```
backend/src/
├── index.ts                          # Main server entry point and configuration
├── config/
│   ├── database.ts                   # Database configuration
│   ├── server.ts                     # Hapi server configuration helpers
│   ├── swagger.ts                    # API documentation configuration  
│   └── redis.ts                      # Redis cache configuration
├── database/
│   ├── config/
│   │   └── sequelize.ts              # Sequelize ORM configuration
│   ├── models/
│   │   ├── index.ts                  # Model exports and associations
│   │   ├── base/                     # Base model classes
│   │   ├── core/                     # Core domain models (User, Student, etc.)
│   │   ├── {domain}/                 # Domain-specific models
│   │   │   ├── {Domain}Model.ts      # Individual model definitions
│   │   │   └── index.ts              # Domain model exports
│   │   └── security/                 # Security-related models
│   ├── migrations/                   # Database migration files
│   └── seeders/                      # Database seed data
├── routes/
│   ├── shared/                       # Shared routing utilities
│   └── v1/                          # API version 1 routes
│       ├── index.ts                  # v1 route aggregator
│       ├── core/                     # Core functionality routes
│       │   ├── index.ts              # Core route exports
│       │   ├── routes/               # Route definitions
│       │   │   ├── auth.routes.ts    # Authentication routes
│       │   │   ├── users.routes.ts   # User management routes
│       │   │   └── {domain}.routes.ts # Domain-specific routes
│       │   ├── controllers/          # Request handlers
│       │   │   ├── auth.controller.ts # Auth business logic
│       │   │   ├── users.controller.ts # User management logic
│       │   │   └── {domain}.controller.ts # Domain controllers
│       │   └── validators/           # Joi validation schemas
│       │       ├── auth.validators.ts # Auth validation rules
│       │       ├── users.validators.ts # User validation rules
│       │       └── {domain}.validators.ts # Domain validations
│       ├── {domain}/                 # Domain-specific route modules
│       │   ├── index.ts              # Domain route exports
│       │   ├── routes/               # HTTP route definitions
│       │   ├── controllers/          # Business logic handlers
│       │   └── validators/           # Input validation schemas
│       └── __tests__/               # Route integration tests
├── services/
│   ├── index.ts                      # Service exports
│   ├── shared/                       # Shared service utilities
│   ├── {domain}/                     # Domain-specific services
│   │   ├── {domain}.service.ts       # Main service class
│   │   ├── {domain}.repository.ts    # Data access layer
│   │   └── {domain}.types.ts         # Service type definitions
│   └── features/                     # Cross-cutting feature services
├── middleware/
│   ├── index.ts                      # Middleware exports and factory
│   ├── core/                         # Core middleware (auth, RBAC)
│   ├── security/                     # Security middleware
│   ├── monitoring/                   # Monitoring and metrics
│   ├── error-handling/               # Error handling middleware
│   └── utils/                        # Middleware utilities
├── validators/
│   ├── index.ts                      # Common validation exports
│   ├── shared/                       # Reusable validation schemas
│   └── {domain}/                     # Domain-specific validators
├── types/
│   ├── index.ts                      # Type exports
│   ├── enums.ts                      # Application enumerations
│   ├── interfaces.ts                 # Common interfaces
│   └── {domain}.types.ts             # Domain-specific types
├── utils/
│   ├── logger.ts                     # Logging utilities
│   ├── database/                     # Database utilities
│   ├── security/                     # Security utilities
│   └── resilience/                   # Error handling and retries
├── shared/                           # Shared utilities and helpers
├── jobs/                            # Background job processors
├── workers/                         # Worker processes
└── constants/                       # Application constants
```

## File Templates

### 1. Main Server Entry Point (`index.ts`)

```typescript
/**
 * WC-IDX-MAIN-XXX | Main Application Entry Point & Server Configuration
 * Purpose: Hapi.js server initialization, route registration, middleware setup
 * Upstream: config/*, routes/*, middleware/*, database/models, utils/logger, constants
 * Downstream: None (entry point) | Called by: npm start, docker container
 * Related: docker-compose.yml, package.json, .env.example
 * Exports: server (default) | Key Services: Hapi server, Sequelize ORM, Swagger docs
 * Last Updated: {date} | Dependencies: @hapi/hapi, sequelize, dotenv
 * Critical Path: Database connection → Auth setup → Route registration → Server start
 * LLM Context: Main server orchestration, handles all HTTP requests, graceful shutdown
 */

// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import Hapi from '@hapi/hapi';
import sequelize from './database/models';
import Joi from 'joi';

// Import utilities
import { logger } from './utils/logger';
import { ENVIRONMENT, CORS_CONFIG } from './constants';

// Import v1 routes (new modular structure)
import { v1Routes, getV1RouteStats } from './routes/v1';

// Import middleware and plugins
import { configureAuth, configureSecurity, errorHandler } from './config/server';
import { swaggerOptions } from './config/swagger';

/**
 * Create and configure Hapi server instance
 */
const server = Hapi.server({
  port: process.env.PORT || 3001,
  host: process.env.HOST || 'localhost',
  routes: {
    cors: CORS_CONFIG,
    validate: {
      failAction: (request, h, err) => {
        logger.error('Validation error:', err);
        throw err;
      }
    }
  }
});

/**
 * Initialize server with all configurations
 */
async function initializeServer(): Promise<void> {
  try {
    // Test database connection
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // Configure security middleware (must be first)
    await configureSecurity(server);

    // Configure authentication
    await configureAuth(server);

    // Register Swagger documentation
    await server.register([
      require('@hapi/inert'),
      require('@hapi/vision'),
      {
        plugin: require('hapi-swagger'),
        options: swaggerOptions
      }
    ]);

    // Register all v1 routes
    server.route(v1Routes);

    // Add global error handling
    server.ext('onPreResponse', errorHandler);

    // Log route statistics
    const routeStats = getV1RouteStats();
    logger.info(`Registered ${routeStats.total} routes across ${Object.keys(routeStats.byModule).length} modules`);

    // Start the server
    await server.start();
    logger.info(`Server running on ${server.info.uri}`);
    logger.info(`Swagger documentation available at ${server.info.uri}/documentation`);

  } catch (error) {
    logger.error('Server initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown handling
 */
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err);
  process.exit(1);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  await server.stop();
  await sequelize.close();
  process.exit(0);
});

// Initialize and start server
initializeServer();

export default server;
```

### 2. Route Module Index (`routes/v1/{domain}/index.ts`)

```typescript
/**
 * {Domain} Module Routes
 * Aggregates all {domain} module routes
 */

import { ServerRoute } from '@hapi/hapi';
import { {domain}Routes } from './routes/{domain}.routes';
// Import additional route files as needed
// import { {domain}AdminRoutes } from './routes/{domain}Admin.routes';

/**
 * All {domain} module routes
 */
export const {domain}Routes: ServerRoute[] = [
  ...{domain}Routes,
  // ...{domain}AdminRoutes,
];
```

### 3. Route Definitions (`routes/v1/{domain}/routes/{domain}.routes.ts`)

```typescript
/**
 * {Domain} Routes (v1)
 * HTTP route definitions for {domain} endpoints
 */

import { ServerRoute } from '@hapi/hapi';
import { {Domain}Controller } from '../controllers/{domain}.controller';
import {
  create{Domain}Schema,
  update{Domain}Schema,
  get{Domain}Schema,
  {domain}FiltersSchema
} from '../validators/{domain}.validators';
import { asyncHandler } from '../../../shared/utils';
import { requireAuth, requireRoles } from '../../../middleware/auth';

/**
 * {Domain} routes with comprehensive CRUD operations
 */
export const {domain}Routes: ServerRoute[] = [
  // Get all {domain} items with filtering and pagination
  {
    method: 'GET',
    path: '/api/v1/{domain-kebab}',
    handler: asyncHandler({Domain}Controller.getAll),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Get all {domain} items',
      notes: 'Retrieves paginated list of {domain} items with optional filtering, sorting, and search capabilities.',
      validate: {
        query: {domain}FiltersSchema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Successfully retrieved {domain} items',
              schema: {
                success: true,
                data: {
                  items: [{
                    id: 'uuid',
                    name: 'Example {Domain}',
                    description: 'Example description',
                    status: 'active',
                    createdAt: '2025-01-01T00:00:00Z',
                    updatedAt: '2025-01-01T00:00:00Z'
                  }],
                  pagination: {
                    page: 1,
                    limit: 20,
                    total: 1,
                    totalPages: 1,
                    hasNext: false,
                    hasPrev: false
                  }
                }
              }
            },
            '400': { description: 'Invalid query parameters' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          }
        }
      }
    }
  },

  // Get single {domain} item by ID
  {
    method: 'GET',
    path: '/api/v1/{domain-kebab}/{id}',
    handler: asyncHandler({Domain}Controller.getById),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN', 'MANAGER', 'STAFF'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Get {domain} item by ID',
      notes: 'Retrieves detailed information about a specific {domain} item.',
      validate: {
        params: get{Domain}Schema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Successfully retrieved {domain} item',
              schema: {
                success: true,
                data: {
                  id: 'uuid',
                  name: 'Example {Domain}',
                  description: 'Example description',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00Z',
                  updatedAt: '2025-01-01T00:00:00Z'
                }
              }
            },
            '400': { description: 'Invalid ID format' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '404': { description: '{Domain} item not found' }
          }
        }
      }
    }
  },

  // Create new {domain} item
  {
    method: 'POST',
    path: '/api/v1/{domain-kebab}',
    handler: asyncHandler({Domain}Controller.create),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN', 'MANAGER'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Create new {domain} item',
      notes: 'Creates a new {domain} item with the provided data. All required fields must be included.',
      validate: {
        payload: create{Domain}Schema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              description: 'Successfully created {domain} item',
              schema: {
                success: true,
                data: {
                  id: 'uuid',
                  name: 'Example {Domain}',
                  description: 'Example description',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00Z',
                  updatedAt: '2025-01-01T00:00:00Z'
                }
              }
            },
            '400': { description: 'Validation error or invalid data' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '409': { description: 'Conflict - item already exists' }
          }
        }
      }
    }
  },

  // Update existing {domain} item
  {
    method: 'PUT',
    path: '/api/v1/{domain-kebab}/{id}',
    handler: asyncHandler({Domain}Controller.update),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN', 'MANAGER'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Update {domain} item',
      notes: 'Updates an existing {domain} item with the provided data. Only provided fields will be updated.',
      validate: {
        params: get{Domain}Schema,
        payload: update{Domain}Schema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Successfully updated {domain} item',
              schema: {
                success: true,
                data: {
                  id: 'uuid',
                  name: 'Updated {Domain}',
                  description: 'Updated description',
                  status: 'active',
                  createdAt: '2025-01-01T00:00:00Z',
                  updatedAt: '2025-01-01T12:00:00Z'
                }
              }
            },
            '400': { description: 'Validation error or invalid data' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '404': { description: '{Domain} item not found' }
          }
        }
      }
    }
  },

  // Delete {domain} item
  {
    method: 'DELETE',
    path: '/api/v1/{domain-kebab}/{id}',
    handler: asyncHandler({Domain}Controller.delete),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Delete {domain} item',
      notes: 'Permanently deletes a {domain} item. This action cannot be undone.',
      validate: {
        params: get{Domain}Schema
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '204': { description: 'Successfully deleted {domain} item' },
            '400': { description: 'Invalid ID format' },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' },
            '404': { description: '{Domain} item not found' },
            '409': { description: 'Cannot delete - item has dependencies' }
          }
        }
      }
    }
  },

  // Get {domain} statistics
  {
    method: 'GET',
    path: '/api/v1/{domain-kebab}/statistics',
    handler: asyncHandler({Domain}Controller.getStatistics),
    options: {
      auth: 'jwt',
      pre: [
        requireAuth,
        requireRoles(['ADMIN', 'MANAGER'])
      ],
      tags: ['api', '{Domain}', 'v1'],
      description: 'Get {domain} statistics',
      notes: 'Retrieves statistical information about {domain} items.',
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              description: 'Successfully retrieved statistics',
              schema: {
                success: true,
                data: {
                  total: 100,
                  active: 85,
                  inactive: 15,
                  recentlyCreated: 5,
                  byStatus: {
                    active: 85,
                    inactive: 15
                  }
                }
              }
            },
            '401': { description: 'Authentication required' },
            '403': { description: 'Insufficient permissions' }
          }
        }
      }
    }
  }
];
```

### 4. Controller Implementation (`routes/v1/{domain}/controllers/{domain}.controller.ts`)

```typescript
/**
 * {Domain} Controller
 * Business logic for {domain} operations
 */

import { Request, ResponseToolkit } from '@hapi/hapi';
import { {Domain}Service } from '../../../../services/{domain}/{domain}.service';
import { logger } from '../../../../utils/logger';
import {
  successResponse,
  createdResponse,
  noContentResponse,
  errorResponse,
  notFoundResponse,
  conflictResponse,
  badRequestResponse
} from '../../../shared/utils/responses';
import { AuthenticatedRequest } from '../../../shared/types/route.types';

export class {Domain}Controller {
  /**
   * Get all {domain} items with filtering and pagination
   */
  static async getAll(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'DESC',
        search,
        status,
        ...filters
      } = request.query || {};

      const result = await {Domain}Service.getAll({
        page: Number(page),
        limit: Number(limit),
        sort,
        order: order.toUpperCase(),
        search,
        status,
        ...filters
      });

      return successResponse(h, result);
    } catch (error) {
      logger.error('Error in {Domain}Controller.getAll:', error);
      return errorResponse(h, 'Failed to retrieve {domain} items');
    }
  }

  /**
   * Get single {domain} item by ID
   */
  static async getById(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const { id } = request.params;

      const item = await {Domain}Service.getById(id);

      if (!item) {
        return notFoundResponse(h, '{Domain} item not found');
      }

      return successResponse(h, item);
    } catch (error) {
      logger.error('Error in {Domain}Controller.getById:', error);
      return errorResponse(h, 'Failed to retrieve {domain} item');
    }
  }

  /**
   * Create new {domain} item
   */
  static async create(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const userId = request.auth.credentials.userId;
      const itemData = request.payload;

      // Check for duplicates if applicable
      const existing = await {Domain}Service.findByUniqueField(itemData.uniqueField);
      if (existing) {
        return conflictResponse(h, '{Domain} item already exists with this identifier');
      }

      const newItem = await {Domain}Service.create({
        ...itemData,
        createdBy: userId
      });

      return createdResponse(h, newItem);
    } catch (error) {
      logger.error('Error in {Domain}Controller.create:', error);
      
      // Handle specific validation errors
      if (error.name === 'SequelizeValidationError') {
        return badRequestResponse(h, 'Validation error', {
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return conflictResponse(h, 'Item already exists with this data');
      }

      return errorResponse(h, 'Failed to create {domain} item');
    }
  }

  /**
   * Update existing {domain} item
   */
  static async update(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const { id } = request.params;
      const userId = request.auth.credentials.userId;
      const updateData = request.payload;

      const existingItem = await {Domain}Service.getById(id);
      if (!existingItem) {
        return notFoundResponse(h, '{Domain} item not found');
      }

      const updatedItem = await {Domain}Service.update(id, {
        ...updateData,
        updatedBy: userId
      });

      return successResponse(h, updatedItem);
    } catch (error) {
      logger.error('Error in {Domain}Controller.update:', error);
      
      // Handle specific validation errors
      if (error.name === 'SequelizeValidationError') {
        return badRequestResponse(h, 'Validation error', {
          errors: error.errors.map(e => ({
            field: e.path,
            message: e.message
          }))
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return conflictResponse(h, 'Item already exists with this data');
      }

      return errorResponse(h, 'Failed to update {domain} item');
    }
  }

  /**
   * Delete {domain} item
   */
  static async delete(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const { id } = request.params;

      const existingItem = await {Domain}Service.getById(id);
      if (!existingItem) {
        return notFoundResponse(h, '{Domain} item not found');
      }

      // Check for dependencies before deletion
      const hasDependencies = await {Domain}Service.checkDependencies(id);
      if (hasDependencies) {
        return conflictResponse(h, 'Cannot delete item with existing dependencies');
      }

      await {Domain}Service.delete(id);

      return noContentResponse(h);
    } catch (error) {
      logger.error('Error in {Domain}Controller.delete:', error);
      return errorResponse(h, 'Failed to delete {domain} item');
    }
  }

  /**
   * Get {domain} statistics
   */
  static async getStatistics(request: AuthenticatedRequest, h: ResponseToolkit) {
    try {
      const filters = request.query || {};
      const statistics = await {Domain}Service.getStatistics(filters);

      return successResponse(h, statistics);
    } catch (error) {
      logger.error('Error in {Domain}Controller.getStatistics:', error);
      return errorResponse(h, 'Failed to retrieve statistics');
    }
  }
}
```

### 5. Joi Validators (`routes/v1/{domain}/validators/{domain}.validators.ts`)

```typescript
/**
 * {Domain} Validation Schemas
 * Joi validation schemas for {domain} endpoints
 */

import Joi from 'joi';
import { 
  uuidSchema, 
  paginationSchema, 
  searchSchema,
  timestampSchema 
} from '../../../shared/validators/common.validators';

/**
 * Status enum for {domain} items
 */
const {domain}Statuses = ['active', 'inactive', 'pending', 'archived'];

/**
 * Common {domain} field validators
 */
const {domain}NameSchema = Joi.string()
  .trim()
  .min(1)
  .max(100)
  .required()
  .description('{Domain} name')
  .messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 1 character',
    'string.max': 'Name cannot exceed 100 characters'
  });

const {domain}DescriptionSchema = Joi.string()
  .trim()
  .max(500)
  .optional()
  .allow('')
  .description('{Domain} description')
  .messages({
    'string.max': 'Description cannot exceed 500 characters'
  });

const {domain}StatusSchema = Joi.string()
  .valid(...{domain}Statuses)
  .default('active')
  .description('{Domain} status')
  .messages({
    'any.only': `Status must be one of: ${({domain}Statuses).join(', ')}`
  });

/**
 * Create {domain} payload schema
 */
export const create{Domain}Schema = Joi.object({
  name: {domain}NameSchema,
  description: {domain}DescriptionSchema,
  status: {domain}StatusSchema,
  
  // Add domain-specific fields here
  // Example fields:
  category: Joi.string()
    .trim()
    .max(50)
    .optional()
    .description('{Domain} category'),
    
  tags: Joi.array()
    .items(Joi.string().trim().max(30))
    .max(10)
    .optional()
    .description('Tags for categorization'),
    
  metadata: Joi.object()
    .optional()
    .description('Additional metadata'),
    
  isPublic: Joi.boolean()
    .default(false)
    .description('Whether item is publicly visible'),
    
  priority: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .default(5)
    .description('Priority level (1-10)'),
    
}).messages({
  'object.unknown': 'Unknown field: {{#label}}'
});

/**
 * Update {domain} payload schema (partial of create)
 */
export const update{Domain}Schema = Joi.object({
  name: {domain}NameSchema.optional(),
  description: {domain}DescriptionSchema,
  status: {domain}StatusSchema.optional(),
  
  // Make all fields optional for updates
  category: Joi.string()
    .trim()
    .max(50)
    .optional(),
    
  tags: Joi.array()
    .items(Joi.string().trim().max(30))
    .max(10)
    .optional(),
    
  metadata: Joi.object()
    .optional(),
    
  isPublic: Joi.boolean()
    .optional(),
    
  priority: Joi.number()
    .integer()
    .min(1)
    .max(10)
    .optional(),
    
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
  'object.unknown': 'Unknown field: {{#label}}'
});

/**
 * Get {domain} by ID params schema
 */
export const get{Domain}Schema = Joi.object({
  id: uuidSchema.required().description('{Domain} ID')
});

/**
 * {Domain} query filters schema
 */
export const {domain}FiltersSchema = Joi.object({
  // Pagination
  ...paginationSchema,
  
  // Search
  search: searchSchema.description('Search in name and description'),
  
  // Filtering
  status: Joi.alternatives()
    .try(
      Joi.string().valid(...{domain}Statuses),
      Joi.array().items(Joi.string().valid(...{domain}Statuses))
    )
    .optional()
    .description('Filter by status (single value or array)'),
    
  category: Joi.string()
    .trim()
    .max(50)
    .optional()
    .description('Filter by category'),
    
  tags: Joi.alternatives()
    .try(
      Joi.string().trim(),
      Joi.array().items(Joi.string().trim())
    )
    .optional()
    .description('Filter by tags'),
    
  isPublic: Joi.boolean()
    .optional()
    .description('Filter by public visibility'),
    
  priority: Joi.alternatives()
    .try(
      Joi.number().integer().min(1).max(10),
      Joi.object({
        min: Joi.number().integer().min(1).max(10),
        max: Joi.number().integer().min(1).max(10)
      })
    )
    .optional()
    .description('Filter by priority (single value or range)'),
    
  // Date filtering
  createdAfter: timestampSchema.optional().description('Filter items created after this date'),
  createdBefore: timestampSchema.optional().description('Filter items created before this date'),
  updatedAfter: timestampSchema.optional().description('Filter items updated after this date'),
  updatedBefore: timestampSchema.optional().description('Filter items updated before this date'),
  
  // Sorting
  sort: Joi.string()
    .valid('name', 'status', 'category', 'priority', 'createdAt', 'updatedAt')
    .default('createdAt')
    .description('Sort field'),
    
  order: Joi.string()
    .valid('ASC', 'DESC', 'asc', 'desc')
    .default('DESC')
    .description('Sort order')
    
}).messages({
  'object.unknown': 'Unknown query parameter: {{#label}}'
});

/**
 * Bulk operations schema
 */
export const bulk{Domain}Schema = Joi.object({
  ids: Joi.array()
    .items(uuidSchema)
    .min(1)
    .max(100)
    .unique()
    .required()
    .description('Array of {domain} IDs'),
    
  action: Joi.string()
    .valid('delete', 'activate', 'deactivate', 'archive')
    .required()
    .description('Bulk action to perform'),
    
  data: Joi.object()
    .optional()
    .description('Additional data for the action')
    
}).messages({
  'array.unique': 'Duplicate IDs are not allowed',
  'array.min': 'At least one ID is required',
  'array.max': 'Maximum 100 IDs allowed per operation'
});
```

### 6. Service Layer (`services/{domain}/{domain}.service.ts`)

```typescript
/**
 * {Domain} Service
 * Business logic and data operations for {domain} management
 */

import { Op, Transaction } from 'sequelize';
import { logger } from '../../utils/logger';
import { {Domain} } from '../../database/models/{domain}/{Domain}';
import { sequelize } from '../../database/models';
import { AuditService } from '../audit/audit.service';

export interface Create{Domain}Data {
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isPublic?: boolean;
  priority?: number;
  createdBy: string;
}

export interface Update{Domain}Data {
  name?: string;
  description?: string;
  status?: 'active' | 'inactive' | 'pending' | 'archived';
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isPublic?: boolean;
  priority?: number;
  updatedBy: string;
}

export interface {Domain}Filters {
  search?: string;
  status?: string | string[];
  category?: string;
  tags?: string | string[];
  isPublic?: boolean;
  priority?: number | { min: number; max: number };
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface {Domain}Statistics {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  archived: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  recentlyCreated: number;
  recentlyUpdated: number;
}

export class {Domain}Service {
  /**
   * Get all {domain} items with filtering and pagination
   */
  static async getAll(filters: {Domain}Filters = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        sort = 'createdAt',
        order = 'DESC',
        search,
        status,
        category,
        tags,
        isPublic,
        priority,
        createdAfter,
        createdBefore,
        updatedAfter,
        updatedBefore
      } = filters;

      const offset = (page - 1) * limit;
      const whereClause: any = {};

      // Search functionality
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { category: { [Op.iLike]: `%${search}%` } }
        ];
      }

      // Status filtering
      if (status) {
        if (Array.isArray(status)) {
          whereClause.status = { [Op.in]: status };
        } else {
          whereClause.status = status;
        }
      }

      // Category filtering
      if (category) {
        whereClause.category = { [Op.iLike]: `%${category}%` };
      }

      // Tags filtering
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        whereClause.tags = { [Op.overlap]: tagArray };
      }

      // Public visibility filtering
      if (isPublic !== undefined) {
        whereClause.isPublic = isPublic;
      }

      // Priority filtering
      if (priority) {
        if (typeof priority === 'number') {
          whereClause.priority = priority;
        } else if (priority.min !== undefined || priority.max !== undefined) {
          whereClause.priority = {};
          if (priority.min !== undefined) {
            whereClause.priority[Op.gte] = priority.min;
          }
          if (priority.max !== undefined) {
            whereClause.priority[Op.lte] = priority.max;
          }
        }
      }

      // Date filtering
      if (createdAfter || createdBefore) {
        whereClause.createdAt = {};
        if (createdAfter) {
          whereClause.createdAt[Op.gte] = createdAfter;
        }
        if (createdBefore) {
          whereClause.createdAt[Op.lte] = createdBefore;
        }
      }

      if (updatedAfter || updatedBefore) {
        whereClause.updatedAt = {};
        if (updatedAfter) {
          whereClause.updatedAt[Op.gte] = updatedAfter;
        }
        if (updatedBefore) {
          whereClause.updatedAt[Op.lte] = updatedBefore;
        }
      }

      const { count: total, rows: items } = await {Domain}.findAndCountAll({
        where: whereClause,
        offset,
        limit,
        order: [[sort, order]],
        include: [
          // Add any necessary associations
        ]
      });

      const totalPages = Math.ceil(total / limit);

      return {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      logger.error('Error in {Domain}Service.getAll:', error);
      throw error;
    }
  }

  /**
   * Get single {domain} item by ID
   */
  static async getById(id: string) {
    try {
      const item = await {Domain}.findByPk(id, {
        include: [
          // Add any necessary associations
        ]
      });

      return item;
    } catch (error) {
      logger.error('Error in {Domain}Service.getById:', error);
      throw error;
    }
  }

  /**
   * Create new {domain} item
   */
  static async create(data: Create{Domain}Data) {
    const transaction = await sequelize.transaction();
    
    try {
      const newItem = await {Domain}.create(data, { transaction });

      // Log audit trail
      await AuditService.log({
        action: 'CREATE',
        resourceType: '{DOMAIN}',
        resourceId: newItem.id,
        userId: data.createdBy,
        details: { created: data },
        transaction
      });

      await transaction.commit();
      return newItem;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in {Domain}Service.create:', error);
      throw error;
    }
  }

  /**
   * Update existing {domain} item
   */
  static async update(id: string, data: Update{Domain}Data) {
    const transaction = await sequelize.transaction();
    
    try {
      const existingItem = await {Domain}.findByPk(id, { transaction });
      if (!existingItem) {
        throw new Error('{Domain} not found');
      }

      const updatedItem = await existingItem.update(data, { transaction });

      // Log audit trail
      await AuditService.log({
        action: 'UPDATE',
        resourceType: '{DOMAIN}',
        resourceId: id,
        userId: data.updatedBy,
        details: { 
          updated: data,
          previous: existingItem.dataValues
        },
        transaction
      });

      await transaction.commit();
      return updatedItem;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in {Domain}Service.update:', error);
      throw error;
    }
  }

  /**
   * Delete {domain} item
   */
  static async delete(id: string, userId?: string) {
    const transaction = await sequelize.transaction();
    
    try {
      const item = await {Domain}.findByPk(id, { transaction });
      if (!item) {
        throw new Error('{Domain} not found');
      }

      await item.destroy({ transaction });

      // Log audit trail
      if (userId) {
        await AuditService.log({
          action: 'DELETE',
          resourceType: '{DOMAIN}',
          resourceId: id,
          userId,
          details: { deleted: item.dataValues },
          transaction
        });
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      logger.error('Error in {Domain}Service.delete:', error);
      throw error;
    }
  }

  /**
   * Find {domain} item by unique field
   */
  static async findByUniqueField(value: string, field: string = 'name') {
    try {
      const whereClause = { [field]: value };
      return await {Domain}.findOne({ where: whereClause });
    } catch (error) {
      logger.error('Error in {Domain}Service.findByUniqueField:', error);
      throw error;
    }
  }

  /**
   * Check if item has dependencies before deletion
   */
  static async checkDependencies(id: string): Promise<boolean> {
    try {
      // Check for any related records that would prevent deletion
      // Example: Check if item is referenced by other entities
      
      // const relatedCount = await RelatedModel.count({
      //   where: { {domain}Id: id }
      // });
      
      // return relatedCount > 0;
      
      return false; // No dependencies found
    } catch (error) {
      logger.error('Error in {Domain}Service.checkDependencies:', error);
      throw error;
    }
  }

  /**
   * Get {domain} statistics
   */
  static async getStatistics(filters: Partial<{Domain}Filters> = {}): Promise<{Domain}Statistics> {
    try {
      const whereClause: any = {};

      // Apply any filters for statistics
      if (filters.category) {
        whereClause.category = filters.category;
      }

      // Get total counts by status
      const statusCounts = await {Domain}.findAll({
        where: whereClause,
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      // Get counts by category
      const categoryCounts = await {Domain}.findAll({
        where: whereClause,
        attributes: [
          'category',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['category'],
        raw: true
      });

      // Get counts by priority
      const priorityCounts = await {Domain}.findAll({
        where: whereClause,
        attributes: [
          'priority',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['priority'],
        raw: true
      });

      // Get recently created count (last 7 days)
      const recentlyCreated = await {Domain}.count({
        where: {
          ...whereClause,
          createdAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      });

      // Get recently updated count (last 7 days)
      const recentlyUpdated = await {Domain}.count({
        where: {
          ...whereClause,
          updatedAt: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      });

      // Process results
      const statusStats = statusCounts.reduce((acc, item: any) => {
        acc[item.status] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>);

      const categoryStats = categoryCounts.reduce((acc, item: any) => {
        acc[item.category || 'uncategorized'] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>);

      const priorityStats = priorityCounts.reduce((acc, item: any) => {
        acc[item.priority] = parseInt(item.count);
        return acc;
      }, {} as Record<string, number>);

      const total = Object.values(statusStats).reduce((sum, count) => sum + count, 0);

      return {
        total,
        active: statusStats.active || 0,
        inactive: statusStats.inactive || 0,
        pending: statusStats.pending || 0,
        archived: statusStats.archived || 0,
        byCategory: categoryStats,
        byPriority: priorityStats,
        recentlyCreated,
        recentlyUpdated
      };
    } catch (error) {
      logger.error('Error in {Domain}Service.getStatistics:', error);
      throw error;
    }
  }
}
```

### 7. Database Model (`database/models/{domain}/{Domain}.ts`)

```typescript
/**
 * @fileoverview {Domain} Database Model
 * @module database/models/{domain}/{Domain}
 * @description Sequelize model definition for {domain} entities with comprehensive validation and associations
 *
 * Key Features:
 * - Full CRUD operations with validation
 * - Soft delete support with paranoid mode
 * - Audit trail integration
 * - JSON field support for flexible metadata
 * - Index optimization for common queries
 * - Association management
 *
 * @security Sensitive fields should be excluded from public responses
 * @compliance Audit logging for all data changes
 *
 * LOC: {LOC_ID}
 * WC-{DOMAIN}-XXX | {Domain}.ts
 */

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';

/**
 * @interface {Domain}Attributes
 * @description TypeScript interface defining all {Domain} model attributes
 */
export interface {Domain}Attributes {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  category?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  isPublic: boolean;
  priority: number;
  
  // Audit fields
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @interface {Domain}CreationAttributes
 * @description Attributes required for creating a new {Domain} record
 */
export interface {Domain}CreationAttributes 
  extends Optional<{Domain}Attributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

/**
 * @class {Domain}
 * @extends {Model<{Domain}Attributes, {Domain}CreationAttributes>}
 * @description Sequelize model for {domain} entities
 */
export class {Domain} extends Model<{Domain}Attributes, {Domain}CreationAttributes> 
  implements {Domain}Attributes {
  
  // Core attributes
  public id!: string;
  public name!: string;
  public description?: string;
  public status!: 'active' | 'inactive' | 'pending' | 'archived';
  public category?: string;
  public tags?: string[];
  public metadata?: Record<string, any>;
  public isPublic!: boolean;
  public priority!: number;
  
  // Audit fields
  public createdBy?: string;
  public updatedBy?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  /**
   * Get safe object representation (excludes sensitive fields)
   */
  public toSafeObject() {
    const { ...safeData } = this.toJSON();
    
    // Remove any sensitive fields if applicable
    // delete safeData.sensitiveField;
    
    return safeData;
  }

  /**
   * Get public object representation (excludes internal fields)
   */
  public toPublicObject() {
    const { createdBy, updatedBy, deletedAt, ...publicData } = this.toSafeObject();
    return publicData;
  }

  /**
   * Check if item is active
   */
  public isActive(): boolean {
    return this.status === 'active';
  }

  /**
   * Check if item is archived
   */
  public isArchived(): boolean {
    return this.status === 'archived';
  }
}

// Initialize the model
{Domain}.init(
  {
    // Primary key
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      comment: 'Unique identifier for the {domain} item'
    },

    // Core fields
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name cannot be empty'
        },
        len: {
          args: [1, 100],
          msg: 'Name must be between 1 and 100 characters'
        }
      },
      comment: '{Domain} name or title'
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Description cannot exceed 1000 characters'
        }
      },
      comment: 'Optional description of the {domain} item'
    },

    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending', 'archived'),
      allowNull: false,
      defaultValue: 'active',
      validate: {
        isIn: {
          args: [['active', 'inactive', 'pending', 'archived']],
          msg: 'Status must be one of: active, inactive, pending, archived'
        }
      },
      comment: 'Current status of the {domain} item'
    },

    category: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: {
          args: [0, 50],
          msg: 'Category cannot exceed 50 characters'
        }
      },
      comment: 'Optional category classification'
    },

    tags: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      validate: {
        isArrayOfStrings(value: any) {
          if (value !== null && value !== undefined) {
            if (!Array.isArray(value)) {
              throw new Error('Tags must be an array');
            }
            if (value.length > 10) {
              throw new Error('Maximum 10 tags allowed');
            }
            if (!value.every((tag: any) => typeof tag === 'string' && tag.length <= 30)) {
              throw new Error('Each tag must be a string with maximum 30 characters');
            }
          }
        }
      },
      comment: 'Array of tags for categorization and search'
    },

    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Additional flexible metadata in JSON format'
    },

    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: 'Whether the item is publicly visible'
    },

    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
      validate: {
        min: {
          args: [1],
          msg: 'Priority must be at least 1'
        },
        max: {
          args: [10],
          msg: 'Priority cannot exceed 10'
        }
      },
      comment: 'Priority level from 1 (lowest) to 10 (highest)'
    },

    // Audit fields
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User who created this record'
    },

    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      comment: 'User who last updated this record'
    }
  },
  {
    sequelize,
    modelName: '{Domain}',
    tableName: '{domain_snake_case}', // Convert to snake_case for table name
    timestamps: true,
    paranoid: true, // Enables soft delete
    
    // Indexes for performance optimization
    indexes: [
      {
        fields: ['name']
      },
      {
        fields: ['status']
      },
      {
        fields: ['category']
      },
      {
        fields: ['isPublic']
      },
      {
        fields: ['priority']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['updatedAt']
      },
      {
        name: '{domain_snake_case}_search_idx',
        fields: ['name', 'description'],
        using: 'gin',
        operator: 'gin_trgm_ops'
      }
    ],

    // Hooks for audit logging and validation
    hooks: {
      beforeCreate: async (instance: {Domain}) => {
        // Additional validation or data processing before create
        if (!instance.name) {
          throw new Error('Name is required');
        }
      },

      beforeUpdate: async (instance: {Domain}) => {
        // Additional validation or data processing before update
        if (instance.changed('status') && instance.status === 'archived') {
          // Handle archiving logic if needed
        }
      },

      afterCreate: async (instance: {Domain}) => {
        // Post-creation hooks (e.g., notifications, cache invalidation)
      },

      afterUpdate: async (instance: {Domain}) => {
        // Post-update hooks
      },

      afterDestroy: async (instance: {Domain}) => {
        // Post-deletion hooks (cleanup, notifications)
      }
    },

    // Default scope excludes deleted records
    defaultScope: {
      where: {
        deletedAt: null
      }
    },

    // Additional scopes for different use cases
    scopes: {
      active: {
        where: {
          status: 'active',
          deletedAt: null
        }
      },
      
      public: {
        where: {
          isPublic: true,
          status: 'active',
          deletedAt: null
        }
      },
      
      withDeleted: {
        where: {}
      },
      
      onlyDeleted: {
        where: {
          deletedAt: {
            [DataTypes.Op.ne]: null
          }
        }
      }
    },

    comment: '{Domain} entities for the White Cross application'
  }
);

export default {Domain};
```

## Implementation Guidelines

### 1. Naming Conventions
- **Routes**: Use kebab-case for URL paths (`/api/v1/user-management`)
- **Files**: Use PascalCase for classes and camelCase for instances
- **Database**: Use snake_case for table and column names
- **Controllers**: Use PascalCase class names with descriptive method names
- **Services**: Use PascalCase class names with static methods

### 2. Security & Authentication
- **JWT Authentication**: Use `auth: 'jwt'` for protected routes
- **Role-based Access**: Use `requireRoles` middleware for authorization
- **Input Validation**: Always validate input with Joi schemas
- **Audit Logging**: Log all CRUD operations for compliance

### 3. Error Handling
- **Consistent Responses**: Use standardized response utilities
- **Proper HTTP Status Codes**: Return appropriate status codes
- **Detailed Logging**: Log errors with context for debugging
- **User-friendly Messages**: Return meaningful error messages

### 4. Database Best Practices
- **Transactions**: Use transactions for multi-step operations
- **Indexes**: Add indexes for frequently queried fields
- **Soft Deletes**: Use paranoid mode for audit compliance
- **Validation**: Implement both database and application validation

### 5. API Documentation
- **Swagger Integration**: Document all endpoints with hapi-swagger
- **Response Examples**: Provide example responses for all status codes
- **Parameter Descriptions**: Document all parameters and their validation rules
- **Tags**: Use consistent tags for endpoint grouping

### 6. Performance Optimization
- **Pagination**: Always implement pagination for list endpoints
- **Efficient Queries**: Use appropriate includes and attributes
- **Caching**: Implement caching for frequently accessed data
- **Rate Limiting**: Implement rate limiting for API protection

## Service Integration Patterns

### 1. Database Transaction Usage
```typescript
const transaction = await sequelize.transaction();
try {
  // Perform multiple operations
  const result1 = await Model1.create(data1, { transaction });
  const result2 = await Model2.update(data2, { transaction });
  
  await transaction.commit();
  return { result1, result2 };
} catch (error) {
  await transaction.rollback();
  throw error;
}
```

### 2. Middleware Pre-handlers
```typescript
const requireRoles = (roles: string[]) => ({
  method: async (request: AuthenticatedRequest) => {
    const userRole = request.auth.credentials.role;
    if (!roles.includes(userRole)) {
      throw Boom.forbidden('Insufficient permissions');
    }
    return request;
  }
});
```

### 3. Audit Logging Integration
```typescript
await AuditService.log({
  action: 'CREATE',
  resourceType: 'USER',
  resourceId: newUser.id,
  userId: request.auth.credentials.userId,
  details: { created: userData },
  transaction
});
```

## Replacement Placeholders

When creating a new domain module, replace these placeholders:
- `{domain}` → lowercase domain name (e.g., `appointments`, `inventory`)
- `{Domain}` → PascalCase domain name (e.g., `Appointments`, `Inventory`)
- `{DOMAIN}` → UPPERCASE domain name (e.g., `APPOINTMENTS`, `INVENTORY`)
- `{domain-kebab}` → kebab-case domain name (e.g., `appointments`, `user-management`)
- `{domain_snake_case}` → snake_case for database (e.g., `appointments`, `user_management`)
- `{date}` → current date in YYYY-MM-DD format
- `WC-{DOMAIN}-XXX` → actual work item/ticket number
- `{LOC_ID}` → unique location identifier

## Integration Checklist

- [ ] Module follows the established directory structure
- [ ] Routes are properly organized with versioning (v1)
- [ ] Controllers handle business logic with proper error handling
- [ ] Joi validators provide comprehensive input validation
- [ ] Services implement business logic with transaction support
- [ ] Models include proper validation, indexes, and associations
- [ ] Authentication and authorization are properly configured
- [ ] Swagger documentation is complete and accurate
- [ ] Audit logging is implemented for all CRUD operations
- [ ] Error responses follow consistent format
- [ ] Database migrations are created for model changes
- [ ] Unit and integration tests cover all functionality
- [ ] Performance considerations are addressed (indexes, pagination)
- [ ] Security best practices are followed throughout

This template ensures all backend modules follow enterprise-grade patterns while maintaining consistency, security, and scalability in the White Cross healthcare application.