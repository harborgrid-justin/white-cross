/**
 * Roles Decorator
 *
 * Marks a route with required roles for access control.
 * Use with RolesGuard to enforce role-based authorization.
 */

import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
