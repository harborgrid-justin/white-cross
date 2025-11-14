/**
 * File: /reuse/clinic/composites/security-guards.ts
 * Locator: WC-CLINIC-SECURITY-GUARDS-001
 * Purpose: NestJS Guards for HIPAA-compliant authorization and security
 *
 * Provides:
 * - Role-based access control (RBAC)
 * - HIPAA compliance validation
 * - PHI access authorization
 * - School-level data isolation
 * - Audit logging integration
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuditLogger } from './security-utils';

/**
 * User roles in the clinic system
 */
export enum ClinicRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  NURSE = 'nurse',
  PHYSICIAN = 'physician',
  COUNSELOR = 'counselor',
  TEACHER = 'teacher',
  PARENT = 'parent',
  STUDENT = 'student',
}

/**
 * Metadata keys for decorators
 */
export const ROLES_KEY = 'roles';
export const HIPAA_RESOURCE_KEY = 'hipaa_resource';
export const REQUIRE_SAME_SCHOOL_KEY = 'require_same_school';

/**
 * Decorators for applying security rules
 */

/**
 * Requires specific roles to access the endpoint
 * @example @Roles(ClinicRole.NURSE, ClinicRole.PHYSICIAN)
 */
export const Roles = (...roles: ClinicRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Marks an endpoint as accessing HIPAA-protected resources
 * @example @HIPAAResource('patient_health_visit')
 */
export const HIPAAResource = (resourceType: string) =>
  SetMetadata(HIPAA_RESOURCE_KEY, resourceType);

/**
 * Requires user to be from the same school as the resource being accessed
 * @example @RequireSameSchool()
 */
export const RequireSameSchool = () => SetMetadata(REQUIRE_SAME_SCHOOL_KEY, true);

/**
 * Guard for role-based access control
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<ClinicRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No role requirement
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.role) {
      AuditLogger.logSecurityEvent(
        'AUTHZ_FAILURE',
        'User object missing role',
        user.id,
        request.ip,
      );
      throw new UnauthorizedException('User role not found');
    }

    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      AuditLogger.logSecurityEvent(
        'AUTHZ_FAILURE',
        `Insufficient permissions. Required: ${requiredRoles.join(', ')}, User has: ${user.role}`,
        user.id,
        request.ip,
      );
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

/**
 * Guard for HIPAA-compliant PHI access
 */
@Injectable()
export class HIPAAGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const resourceType = this.reflector.getAllAndOverride<string>(HIPAA_RESOURCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!resourceType) {
      return true; // No HIPAA resource specified
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required for PHI access');
    }

    // Verify user has business need to access PHI
    const authorizedRoles: ClinicRole[] = [
      ClinicRole.NURSE,
      ClinicRole.PHYSICIAN,
      ClinicRole.COUNSELOR,
      ClinicRole.ADMIN,
    ];

    if (!authorizedRoles.includes(user.role)) {
      AuditLogger.logSecurityEvent(
        'INVALID_ACCESS',
        `Unauthorized PHI access attempt: ${resourceType}`,
        user.id,
        request.ip,
      );
      throw new ForbiddenException('Not authorized to access protected health information');
    }

    // Log PHI access for audit trail
    const resourceId = request.params.id || request.body?.id || 'unknown';
    AuditLogger.logPHIAccess(
      request.method,
      resourceType,
      resourceId,
      user.id,
      user.schoolId,
    );

    return true;
  }
}

/**
 * Guard for school-level data isolation
 * Ensures users can only access data from their assigned school
 */
@Injectable()
export class SchoolIsolationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireSameSchool = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_SAME_SCHOOL_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requireSameSchool) {
      return true; // School isolation not required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!user.schoolId) {
      AuditLogger.logSecurityEvent(
        'AUTHZ_FAILURE',
        'User missing school assignment',
        user.id,
        request.ip,
      );
      throw new ForbiddenException('User not assigned to a school');
    }

    // Check if requested resource is from the same school
    const requestedSchoolId = request.params.schoolId || request.body?.schoolId || request.query?.schoolId;

    // Super admins can access any school
    if (user.role === ClinicRole.SUPER_ADMIN) {
      return true;
    }

    if (requestedSchoolId && requestedSchoolId !== user.schoolId) {
      AuditLogger.logSecurityEvent(
        'AUTHZ_FAILURE',
        `Cross-school access attempt: user school ${user.schoolId}, requested ${requestedSchoolId}`,
        user.id,
        request.ip,
      );
      throw new ForbiddenException('Access denied: resource belongs to different school');
    }

    return true;
  }
}

/**
 * Combined security guard that applies all security checks
 * Use this for comprehensive protection
 */
@Injectable()
export class ClinicSecurityGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // 1. Authentication check
    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // 2. Check if user account is active
    if (user.isActive === false) {
      AuditLogger.logSecurityEvent(
        'AUTH_FAILURE',
        'Inactive user account attempted access',
        user.id,
        request.ip,
      );
      throw new UnauthorizedException('User account is inactive');
    }

    // 3. Check for suspended accounts
    if (user.isSuspended) {
      AuditLogger.logSecurityEvent(
        'AUTH_FAILURE',
        'Suspended user account attempted access',
        user.id,
        request.ip,
      );
      throw new ForbiddenException('User account is suspended');
    }

    // 4. Role-based access control
    const rolesGuard = new RolesGuard(this.reflector);
    const hasRoleAccess = rolesGuard.canActivate(context);
    if (!hasRoleAccess) {
      return false;
    }

    // 5. School isolation check
    const schoolGuard = new SchoolIsolationGuard(this.reflector);
    const hasSchoolAccess = schoolGuard.canActivate(context);
    if (!hasSchoolAccess) {
      return false;
    }

    // 6. HIPAA compliance check
    const hipaaGuard = new HIPAAGuard(this.reflector);
    const hasHIPAAAccess = hipaaGuard.canActivate(context);
    if (!hasHIPAAAccess) {
      return false;
    }

    return true;
  }
}

/**
 * Rate limiting guard for preventing abuse
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private requestCounts: Map<string, { count: number; resetAt: number }> = new Map();
  private readonly windowMs = 60000; // 1 minute
  private readonly maxRequests = 100; // 100 requests per minute

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const ip = request.ip;

    // Use user ID if authenticated, otherwise use IP
    const identifier = user?.id || ip;

    const now = Date.now();
    const rateLimitData = this.requestCounts.get(identifier);

    if (!rateLimitData || now > rateLimitData.resetAt) {
      // New window or expired window
      this.requestCounts.set(identifier, {
        count: 1,
        resetAt: now + this.windowMs,
      });
      return true;
    }

    if (rateLimitData.count >= this.maxRequests) {
      AuditLogger.logSecurityEvent(
        'SUSPICIOUS_ACTIVITY',
        `Rate limit exceeded: ${rateLimitData.count} requests`,
        user?.id,
        ip,
      );
      throw new ForbiddenException('Rate limit exceeded. Please try again later.');
    }

    rateLimitData.count++;
    return true;
  }
}

/**
 * Export all guards
 */
export default {
  RolesGuard,
  HIPAAGuard,
  SchoolIsolationGuard,
  ClinicSecurityGuard,
  RateLimitGuard,
};
