/**
 * LOC: DECORATOR-AUTH-001
 * File: /reuse/server/health/composites/shared/decorators/auth.decorators.ts
 * Purpose: Authentication and authorization decorators
 *
 * @description
 * Comprehensive set of decorators for authentication, authorization, and access control
 */

import { SetMetadata, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRole } from '../guards/jwt-auth.guard';
import { PhiAccessType } from '../guards/phi-access.guard';
import {
  IS_PUBLIC_KEY,
  ROLES_KEY,
  PERMISSIONS_KEY,
  PHI_ACCESS_KEY,
  BREAK_GLASS_ALLOWED_KEY,
} from '../guards/jwt-auth.guard';

/**
 * Mark route as public (no authentication required)
 *
 * @example
 * ```typescript
 * @Get('health')
 * @Public()
 * healthCheck() {
 *   return { status: 'ok' };
 * }
 * ```
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Require specific roles to access route
 *
 * @example
 * ```typescript
 * @Post('prescriptions')
 * @Roles(UserRole.PHYSICIAN, UserRole.NURSE)
 * async createPrescription() {
 *   // Only physicians and nurses can access
 * }
 * ```
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Require specific permissions to access route
 *
 * @example
 * ```typescript
 * @Delete('users/:id')
 * @RequirePermissions('users:delete', 'admin:full')
 * async deleteUser() {
 *   // User must have both permissions
 * }
 * ```
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Require PHI access verification
 *
 * @example
 * ```typescript
 * @Get('patients/:id/medical-records')
 * @RequirePhiAccess(PhiAccessType.VIEW_MEDICAL_RECORDS)
 * async getMedicalRecords() {
 *   // PHI access is verified and logged
 * }
 * ```
 */
export const RequirePhiAccess = (accessType: PhiAccessType) =>
  SetMetadata(PHI_ACCESS_KEY, accessType);

/**
 * Allow break-glass emergency access on this endpoint
 *
 * @example
 * ```typescript
 * @Get('patients/:id/emergency-info')
 * @AllowBreakGlass()
 * async getEmergencyInfo() {
 *   // Break-glass access allowed with audit
 * }
 * ```
 */
export const AllowBreakGlass = () => SetMetadata(BREAK_GLASS_ALLOWED_KEY, true);

/**
 * Get current authenticated user from request
 *
 * @example
 * ```typescript
 * @Get('profile')
 * async getProfile(@CurrentUser() user: UserPayload) {
 *   return user;
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

/**
 * Get user ID from request
 *
 * @example
 * ```typescript
 * @Post('appointments')
 * async createAppointment(@UserId() userId: string) {
 *   // userId extracted from JWT
 * }
 * ```
 */
export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id;
  },
);

/**
 * Get user role from request
 *
 * @example
 * ```typescript
 * @Get('dashboard')
 * async getDashboard(@UserRole() role: UserRole) {
 *   // Customize dashboard based on role
 * }
 * ```
 */
export const UserRoleDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.role;
  },
);

/**
 * Get IP address from request
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@IpAddress() ip: string) {
 *   // Log IP for security
 * }
 * ```
 */
export const IpAddress = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.ip || request.connection.remoteAddress;
  },
);

/**
 * Get user agent from request
 *
 * @example
 * ```typescript
 * @Post('login')
 * async login(@UserAgent() userAgent: string) {
 *   // Track device/browser
 * }
 * ```
 */
export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['user-agent'];
  },
);

/**
 * Get PHI access metadata from request
 *
 * @example
 * ```typescript
 * @Get('patients/:id/records')
 * async getRecords(@PhiAccessMetadata() metadata: PhiAccessRequest) {
 *   // Access metadata set by PhiAccessGuard
 * }
 * ```
 */
export const PhiAccessMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.phiAccessMetadata;
  },
);

/**
 * Get access reason from request headers
 *
 * @example
 * ```typescript
 * @Get('patients/:id/records')
 * async getRecords(@AccessReason() reason: string) {
 *   // Reason provided by user
 * }
 * ```
 */
export const AccessReason = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.headers['x-access-reason'] || request.phiAccessMetadata?.reason;
  },
);
