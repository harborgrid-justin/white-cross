/**
 * LOC: ROLESDEC001
 * File: decorators/roles.decorator.ts
 * Purpose: Roles decorator for role-based access control
 */

import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, UserRole } from '../guards/roles.guard';

/**
 * Roles decorator
 *
 * Specifies required roles for accessing an endpoint.
 * User must have at least ONE of the specified roles.
 *
 * @example
 * ```typescript
 * @Get('admin-panel')
 * @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
 * getAdminPanel() {
 *   return this.adminService.getDashboard();
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export { UserRole };
