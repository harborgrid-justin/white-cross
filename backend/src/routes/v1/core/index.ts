/**
 * Core Module Routes
 * Aggregates all core module routes (auth, users, access control)
 */

import { ServerRoute } from '@hapi/hapi';
import { authRoutes } from './routes/auth.routes';
import { usersRoutes } from './routes/users.routes';
import { accessControlRoutes } from './routes/accessControl.routes';

/**
 * All core module routes
 */
export const coreRoutes: ServerRoute[] = [
  ...authRoutes,
  ...usersRoutes,
  ...accessControlRoutes
];
