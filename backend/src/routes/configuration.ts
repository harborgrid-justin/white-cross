import { Server } from '@hapi/hapi';
import Joi from 'joi';
import { ConfigCategory, ConfigValueType, ConfigScope } from '../types';
import configurationService from '../services/configurationService';
import { AuthRequest } from '../middleware/auth';

export const configurationRoutes = (server: Server) => {
  /**
   * GET /api/configurations
   * Get all configurations with optional filtering
   */
  server.route({
    method: 'GET',
    path: '/api/configurations',
    options: {
      auth: 'jwt',
      description: 'Get all system configurations',
      notes: 'Retrieve configurations with optional filtering by category, scope, tags, etc.',
      tags: ['api', 'configurations'],
      validate: {
        query: Joi.object({
          category: Joi.string().valid(...Object.values(ConfigCategory)),
          subCategory: Joi.string(),
          scope: Joi.string().valid(...Object.values(ConfigScope)),
          scopeId: Joi.string(),
          tags: Joi.alternatives().try(
            Joi.string(),
            Joi.array().items(Joi.string())
          ),
          isPublic: Joi.boolean(),
          isEditable: Joi.boolean()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { category, subCategory, scope, scopeId, tags, isPublic, isEditable } = request.query;

        // Parse tags if it's a string
        const parsedTags = tags ? (Array.isArray(tags) ? tags : [tags]) : undefined;

        const configs = await configurationService.getConfigurations({
          category: category as ConfigCategory,
          subCategory,
          scope: scope as ConfigScope,
          scopeId,
          tags: parsedTags,
          isPublic,
          isEditable
        });

        return h.response({
          success: true,
          data: configs
        }).code(200);
      } catch (error) {
        console.error('Error fetching configurations:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * GET /api/configurations/public
   * Get all public configurations (safe for frontend)
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/public',
    options: {
      auth: false,
      description: 'Get public system configurations',
      notes: 'Retrieve configurations marked as public (safe to expose to frontend)',
      tags: ['api', 'configurations']
    },
    handler: async (_request, h) => {
      try {
        const configs = await configurationService.getPublicConfigurations();

        return h.response({
          success: true,
          data: configs
        }).code(200);
      } catch (error) {
        console.error('Error fetching public configurations:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * GET /api/configurations/{key}
   * Get a specific configuration by key
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/{key}',
    options: {
      auth: 'jwt',
      description: 'Get a specific configuration by key',
      notes: 'Retrieve a single configuration value',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          key: Joi.string().required()
        }),
        query: Joi.object({
          scopeId: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { key } = request.params;
        const { scopeId } = request.query;

        const config = await configurationService.getConfigByKey(key, scopeId);

        return h.response({
          success: true,
          data: config
        }).code(200);
      } catch (error) {
        console.error('Error fetching configuration:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(404);
      }
    }
  });

  /**
   * GET /api/configurations/category/{category}
   * Get configurations by category
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/category/{category}',
    options: {
      auth: 'jwt',
      description: 'Get configurations by category',
      notes: 'Retrieve all configurations in a specific category',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          category: Joi.string().valid(...Object.values(ConfigCategory)).required()
        }),
        query: Joi.object({
          scopeId: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { category } = request.params;
        const { scopeId } = request.query;

        const configs = await configurationService.getConfigsByCategory(
          category as ConfigCategory,
          scopeId
        );

        return h.response({
          success: true,
          data: configs
        }).code(200);
      } catch (error) {
        console.error('Error fetching configurations by category:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * PUT /api/configurations/{key}
   * Update a configuration value
   */
  server.route({
    method: 'PUT',
    path: '/api/configurations/{key}',
    options: {
      auth: 'jwt',
      description: 'Update a configuration value',
      notes: 'Update a single configuration with validation and audit trail',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          key: Joi.string().required()
        }),
        payload: Joi.object({
          value: Joi.string().required(),
          changeReason: Joi.string(),
          scopeId: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { key } = request.params;
        const { value, changeReason, scopeId } = request.payload as any;
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const updatedConfig = await configurationService.updateConfiguration(
          key,
          {
            value,
            changedBy: user.userId,
            changedByName: user.email,
            changeReason,
            ipAddress: request.info.remoteAddress,
            userAgent: request.headers['user-agent']
          },
          scopeId
        );

        return h.response({
          success: true,
          data: updatedConfig,
          message: 'Configuration updated successfully'
        }).code(200);
      } catch (error) {
        console.error('Error updating configuration:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });

  /**
   * PUT /api/configurations/bulk
   * Bulk update configurations
   */
  server.route({
    method: 'PUT',
    path: '/api/configurations/bulk',
    options: {
      auth: 'jwt',
      description: 'Bulk update configurations',
      notes: 'Update multiple configurations in a single request',
      tags: ['api', 'configurations'],
      validate: {
        payload: Joi.object({
          updates: Joi.array().items(
            Joi.object({
              key: Joi.string().required(),
              value: Joi.string().required(),
              scopeId: Joi.string()
            })
          ).required(),
          changeReason: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { updates, changeReason } = request.payload as any;
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const results = await configurationService.bulkUpdateConfigurations(
          updates,
          user.userId,
          changeReason
        );

        return h.response({
          success: true,
          data: results,
          message: 'Bulk update completed'
        }).code(200);
      } catch (error) {
        console.error('Error bulk updating configurations:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });

  /**
   * POST /api/configurations
   * Create a new configuration
   */
  server.route({
    method: 'POST',
    path: '/api/configurations',
    options: {
      auth: 'jwt',
      description: 'Create a new configuration',
      notes: 'Add a new system configuration',
      tags: ['api', 'configurations'],
      validate: {
        payload: Joi.object({
          key: Joi.string().required(),
          value: Joi.string().required(),
          valueType: Joi.string().valid(...Object.values(ConfigValueType)).required(),
          category: Joi.string().valid(...Object.values(ConfigCategory)).required(),
          subCategory: Joi.string(),
          description: Joi.string(),
          defaultValue: Joi.string(),
          validValues: Joi.array().items(Joi.string()),
          minValue: Joi.number(),
          maxValue: Joi.number(),
          isPublic: Joi.boolean().default(false),
          isEditable: Joi.boolean().default(true),
          requiresRestart: Joi.boolean().default(false),
          scope: Joi.string().valid(...Object.values(ConfigScope)).default('SYSTEM'),
          scopeId: Joi.string(),
          tags: Joi.array().items(Joi.string()),
          sortOrder: Joi.number().default(0)
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const config = await configurationService.createConfiguration(request.payload as any);

        return h.response({
          success: true,
          data: config,
          message: 'Configuration created successfully'
        }).code(201);
      } catch (error) {
        console.error('Error creating configuration:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });

  /**
   * DELETE /api/configurations/{key}
   * Delete a configuration
   */
  server.route({
    method: 'DELETE',
    path: '/api/configurations/{key}',
    options: {
      auth: 'jwt',
      description: 'Delete a configuration',
      notes: 'Remove a configuration from the system',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          key: Joi.string().required()
        }),
        query: Joi.object({
          scopeId: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { key } = request.params;
        const { scopeId } = request.query;
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        await configurationService.deleteConfiguration(key, scopeId);

        return h.response({
          success: true,
          message: 'Configuration deleted successfully'
        }).code(200);
      } catch (error) {
        console.error('Error deleting configuration:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });

  /**
   * POST /api/configurations/{key}/reset
   * Reset configuration to default value
   */
  server.route({
    method: 'POST',
    path: '/api/configurations/{key}/reset',
    options: {
      auth: 'jwt',
      description: 'Reset configuration to default',
      notes: 'Reset a configuration to its default value',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          key: Joi.string().required()
        }),
        query: Joi.object({
          scopeId: Joi.string()
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { key } = request.params;
        const { scopeId } = request.query;
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const config = await configurationService.resetToDefault(key, user.userId, scopeId);

        return h.response({
          success: true,
          data: config,
          message: 'Configuration reset to default value'
        }).code(200);
      } catch (error) {
        console.error('Error resetting configuration:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });

  /**
   * GET /api/configurations/{key}/history
   * Get configuration change history
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/{key}/history',
    options: {
      auth: 'jwt',
      description: 'Get configuration history',
      notes: 'Retrieve change history for a specific configuration',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          key: Joi.string().required()
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(500).default(50)
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { key } = request.params;
        const { limit } = request.query;

        const history = await configurationService.getConfigHistory(key, limit);

        return h.response({
          success: true,
          data: history
        }).code(200);
      } catch (error) {
        console.error('Error fetching configuration history:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * GET /api/configurations/history/recent
   * Get recent configuration changes
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/history/recent',
    options: {
      auth: 'jwt',
      description: 'Get recent configuration changes',
      notes: 'Retrieve recent changes across all configurations',
      tags: ['api', 'configurations'],
      validate: {
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(500).default(100)
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { limit } = request.query;

        const history = await configurationService.getRecentChanges(limit);

        return h.response({
          success: true,
          data: history
        }).code(200);
      } catch (error) {
        console.error('Error fetching recent changes:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * GET /api/configurations/history/user/{userId}
   * Get configuration changes by user
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/history/user/{userId}',
    options: {
      auth: 'jwt',
      description: 'Get configuration changes by user',
      notes: 'Retrieve all changes made by a specific user',
      tags: ['api', 'configurations'],
      validate: {
        params: Joi.object({
          userId: Joi.string().required()
        }),
        query: Joi.object({
          limit: Joi.number().integer().min(1).max(500).default(50)
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const { userId } = request.params;
        const { limit } = request.query;

        const history = await configurationService.getConfigChangesByUser(userId, limit);

        return h.response({
          success: true,
          data: history
        }).code(200);
      } catch (error) {
        console.error('Error fetching user changes:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * GET /api/configurations/export
   * Export configurations as JSON
   */
  server.route({
    method: 'GET',
    path: '/api/configurations/export',
    options: {
      auth: 'jwt',
      description: 'Export configurations',
      notes: 'Export configurations as JSON with optional filtering',
      tags: ['api', 'configurations'],
      validate: {
        query: Joi.object({
          category: Joi.string().valid(...Object.values(ConfigCategory)),
          scope: Joi.string().valid(...Object.values(ConfigScope))
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const { category, scope } = request.query;

        const json = await configurationService.exportConfigurations({
          category: category as ConfigCategory,
          scope: scope as ConfigScope
        });

        return h.response(json)
          .type('application/json')
          .header('Content-Disposition', 'attachment; filename=configurations.json')
          .code(200);
      } catch (error) {
        console.error('Error exporting configurations:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(500);
      }
    }
  });

  /**
   * POST /api/configurations/import
   * Import configurations from JSON
   */
  server.route({
    method: 'POST',
    path: '/api/configurations/import',
    options: {
      auth: 'jwt',
      description: 'Import configurations',
      notes: 'Import configurations from JSON file',
      tags: ['api', 'configurations'],
      validate: {
        payload: Joi.object({
          configurations: Joi.string().required(),
          overwrite: Joi.boolean().default(false)
        })
      }
    },
    handler: async (request: AuthRequest, h) => {
      try {
        const user = request.user;

        if (!user) {
          return h.response({
            success: false,
            error: { message: 'Authentication required' }
          }).code(401);
        }

        // Check if user has admin role
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
          return h.response({
            success: false,
            error: { message: 'Insufficient permissions. Admin role required.' }
          }).code(403);
        }

        const { configurations, overwrite } = request.payload as any;

        const results = await configurationService.importConfigurations(
          configurations,
          user.userId,
          overwrite
        );

        return h.response({
          success: true,
          data: results,
          message: `Import completed: ${results.created} created, ${results.updated} updated, ${results.errors.length} errors`
        }).code(200);
      } catch (error) {
        console.error('Error importing configurations:', error);
        return h.response({
          success: false,
          error: { message: (error as Error).message }
        }).code(400);
      }
    }
  });
};
