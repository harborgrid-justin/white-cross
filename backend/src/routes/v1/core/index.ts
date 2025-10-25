/**
 * @fileoverview Core Module Routes Aggregator
 *
 * Central aggregation point for all core system routes including authentication,
 * user management, access control, health checks, and contact management.
 * Core routes provide fundamental platform functionality required by all other domains.
 *
 * @module routes/v1/core
 * @requires @hapi/hapi
 * @see {@link module:routes/v1/core/routes/auth.routes} for authentication endpoints
 * @see {@link module:routes/v1/core/routes/users.routes} for user management endpoints
 * @see {@link module:routes/v1/core/routes/accessControl.routes} for RBAC endpoints
 * @see {@link module:routes/v1/core/routes/health.routes} for health check endpoints
 * @since 1.0.0
 */

import { ServerRoute } from '@hapi/hapi';
import { authRoutes } from './routes/auth.routes';
import { usersRoutes } from './routes/users.routes';
import { accessControlRoutes } from './routes/accessControl.routes';
import { healthRoutes } from './routes/health.routes';
import { contactRoutes } from './contacts';

/**
 * Complete collection of core module routes.
 *
 * Aggregates authentication, user management, RBAC, health monitoring,
 * and contact management routes. Routes are ordered by priority with
 * health checks first (no auth required) followed by authentication.
 *
 * @const {ServerRoute[]}
 *
 * @example
 * ```typescript
 * // In main server configuration
 * import { coreRoutes } from './routes/v1/core';
 *
 * server.route(coreRoutes);
 * ```
 */
export const coreRoutes: ServerRoute[] = [
  ...healthRoutes,
  ...authRoutes,
  ...usersRoutes,
  ...accessControlRoutes,
  ...contactRoutes
];
