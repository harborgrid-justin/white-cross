/**
 * Core Module Routes
 * Aggregates all core module routes (auth, users, access control, health)
 */

import { ServerRoute } from '@hapi/hapi';
import { authRoutes } from './routes/auth.routes';
import { usersRoutes } from './routes/users.routes';
import { accessControlRoutes } from './routes/accessControl.routes';
import { healthRoutes } from './routes/health.routes';
import { contactRoutes } from './contacts';

/**
 * All core module routes
 */
export const coreRoutes: ServerRoute[] = [
  ...healthRoutes,
  ...authRoutes,
  ...usersRoutes,
  ...accessControlRoutes,
  ...contactRoutes
];
