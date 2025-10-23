/**
 * @fileoverview Authorization Utilities for Service-Level Access Control
 * @module utils/authorizationUtils
 * @description Provides helper functions for implementing authorization checks
 * in service methods. Follows defense-in-depth principle by adding authorization
 * at the service layer in addition to route-level checks.
 *
 * SECURITY: Implements service-level authorization checks
 * SECURITY: Prevents horizontal and vertical privilege escalation
 * HIPAA: Ensures only authorized users access Protected Health Information (PHI)
 *
 * @security Authorization enforcement
 * @security Role-based access control (RBAC)
 * @security Resource ownership verification
 */

import { AuthorizationError } from '../errors/ServiceError';

/**
 * User roles in the system (from UserRole enum)
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  PARENT = 'PARENT',
  GUARDIAN = 'GUARDIAN',
  STUDENT = 'STUDENT',
  STAFF = 'STAFF'
}

/**
 * Context object passed to authorization functions
 */
export interface AuthorizationContext {
  userId: string;
  userRole: UserRole;
  organizationId?: string;
  schoolId?: string;
  email?: string;
}

/**
 * Resource ownership information
 */
export interface ResourceOwnership {
  ownerId: string;
  ownerType?: 'user' | 'student' | 'parent';
  organizationId?: string;
  schoolId?: string;
}

/**
 * Role hierarchy for privilege comparisons
 * Higher number = more privileges
 */
const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.ADMIN]: 100,
  [UserRole.DOCTOR]: 80,
  [UserRole.NURSE]: 60,
  [UserRole.STAFF]: 50,
  [UserRole.PARENT]: 30,
  [UserRole.GUARDIAN]: 30,
  [UserRole.STUDENT]: 10
};

/**
 * Check if user's role is at least as privileged as required role
 *
 * @param userRole - User's current role
 * @param requiredRole - Minimum required role
 * @returns True if user's role is sufficient
 *
 * @example
 * hasMinimumRole(UserRole.DOCTOR, UserRole.NURSE) // true - Doctor > Nurse
 * hasMinimumRole(UserRole.PARENT, UserRole.NURSE) // false - Parent < Nurse
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

/**
 * Check if user has one of the specified roles
 *
 * @param userRole - User's current role
 * @param allowedRoles - List of allowed roles
 * @returns True if user has one of the allowed roles
 *
 * @example
 * hasAnyRole(UserRole.NURSE, [UserRole.DOCTOR, UserRole.NURSE]) // true
 * hasAnyRole(UserRole.PARENT, [UserRole.DOCTOR, UserRole.NURSE]) // false
 */
export function hasAnyRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

/**
 * Require user to be an admin
 * Throws AuthorizationError if not admin
 *
 * @param context - Authorization context with user information
 * @throws {AuthorizationError} If user is not an admin
 *
 * @example
 * requireAdmin(context); // Throws if not admin
 */
export function requireAdmin(context: AuthorizationContext): void {
  if (context.userRole !== UserRole.ADMIN) {
    throw new AuthorizationError('Admin privileges required for this action');
  }
}

/**
 * Require user to have one of the specified roles
 * Throws AuthorizationError if user doesn't have required role
 *
 * @param context - Authorization context
 * @param allowedRoles - List of roles that can perform this action
 * @param actionDescription - Description of the action for error message
 * @throws {AuthorizationError} If user doesn't have required role
 *
 * @example
 * requireRole(context, [UserRole.DOCTOR, UserRole.NURSE], 'prescribe medication');
 */
export function requireRole(
  context: AuthorizationContext,
  allowedRoles: UserRole[],
  actionDescription?: string
): void {
  if (!hasAnyRole(context.userRole, allowedRoles)) {
    const roleNames = allowedRoles.join(' or ');
    const action = actionDescription ? ` to ${actionDescription}` : '';
    throw new AuthorizationError(`${roleNames} role required${action}`);
  }
}

/**
 * Require user to have minimum role level
 * Throws AuthorizationError if user's role is insufficient
 *
 * @param context - Authorization context
 * @param minimumRole - Minimum required role
 * @param actionDescription - Description of action for error message
 * @throws {AuthorizationError} If user's role is insufficient
 *
 * @example
 * requireMinimumRole(context, UserRole.NURSE, 'access health records');
 */
export function requireMinimumRole(
  context: AuthorizationContext,
  minimumRole: UserRole,
  actionDescription?: string
): void {
  if (!hasMinimumRole(context.userRole, minimumRole)) {
    const action = actionDescription ? ` to ${actionDescription}` : '';
    throw new AuthorizationError(`${minimumRole} role or higher required${action}`);
  }
}

/**
 * Check if user is staff (Doctor, Nurse, or Staff role)
 *
 * @param userRole - User's role
 * @returns True if user is staff
 */
export function isStaff(userRole: UserRole): boolean {
  return hasAnyRole(userRole, [UserRole.DOCTOR, UserRole.NURSE, UserRole.STAFF]);
}

/**
 * Require user to be staff
 * Throws AuthorizationError if not staff
 *
 * @param context - Authorization context
 * @throws {AuthorizationError} If user is not staff
 *
 * @example
 * requireStaff(context); // Throws if not doctor/nurse/staff
 */
export function requireStaff(context: AuthorizationContext): void {
  if (!isStaff(context.userRole)) {
    throw new AuthorizationError('Staff privileges required for this action');
  }
}

/**
 * Check if user is authorized healthcare provider (Doctor or Nurse)
 *
 * @param userRole - User's role
 * @returns True if user is healthcare provider
 */
export function isHealthcareProvider(userRole: UserRole): boolean {
  return hasAnyRole(userRole, [UserRole.DOCTOR, UserRole.NURSE]);
}

/**
 * Require user to be healthcare provider
 * Throws AuthorizationError if not doctor or nurse
 *
 * @param context - Authorization context
 * @throws {AuthorizationError} If user is not healthcare provider
 *
 * @example
 * requireHealthcareProvider(context); // Throws if not doctor/nurse
 */
export function requireHealthcareProvider(context: AuthorizationContext): void {
  if (!isHealthcareProvider(context.userRole)) {
    throw new AuthorizationError('Healthcare provider (Doctor or Nurse) required for this action');
  }
}

/**
 * Check if user owns the resource
 *
 * @param context - Authorization context
 * @param resource - Resource ownership information
 * @returns True if user owns the resource
 *
 * @example
 * const isOwner = isResourceOwner(context, { ownerId: studentId });
 */
export function isResourceOwner(
  context: AuthorizationContext,
  resource: ResourceOwnership
): boolean {
  return context.userId === resource.ownerId;
}

/**
 * Require user to own the resource
 * Throws AuthorizationError if user doesn't own resource
 *
 * @param context - Authorization context
 * @param resource - Resource ownership information
 * @param resourceType - Type of resource for error message
 * @throws {AuthorizationError} If user doesn't own resource
 *
 * @example
 * requireOwnership(context, { ownerId: userId }, 'profile');
 */
export function requireOwnership(
  context: AuthorizationContext,
  resource: ResourceOwnership,
  resourceType?: string
): void {
  if (!isResourceOwner(context, resource)) {
    const type = resourceType ? ` ${resourceType}` : ' this resource';
    throw new AuthorizationError(`You can only access your own${type}`);
  }
}

/**
 * Require user to own resource OR be admin
 * Throws AuthorizationError if neither condition is met
 *
 * @param context - Authorization context
 * @param resource - Resource ownership information
 * @param resourceType - Type of resource for error message
 * @throws {AuthorizationError} If user doesn't own resource and isn't admin
 *
 * @example
 * requireOwnershipOrAdmin(context, { ownerId: userId }, 'profile');
 */
export function requireOwnershipOrAdmin(
  context: AuthorizationContext,
  resource: ResourceOwnership,
  resourceType?: string
): void {
  if (!isResourceOwner(context, resource) && context.userRole !== UserRole.ADMIN) {
    const type = resourceType ? ` ${resourceType}` : ' this resource';
    throw new AuthorizationError(`You can only modify your own${type}`);
  }
}

/**
 * Require user to own resource OR be staff
 * Throws AuthorizationError if neither condition is met
 *
 * @param context - Authorization context
 * @param resource - Resource ownership information
 * @param resourceType - Type of resource for error message
 * @throws {AuthorizationError} If user doesn't own resource and isn't staff
 *
 * @example
 * requireOwnershipOrStaff(context, { ownerId: studentId }, 'health record');
 */
export function requireOwnershipOrStaff(
  context: AuthorizationContext,
  resource: ResourceOwnership,
  resourceType?: string
): void {
  if (!isResourceOwner(context, resource) && !isStaff(context.userRole)) {
    const type = resourceType ? ` ${resourceType}` : ' this resource';
    throw new AuthorizationError(`Only the owner or staff can access${type}`);
  }
}

/**
 * Check if user belongs to same organization
 *
 * @param context - Authorization context
 * @param resource - Resource with organization information
 * @returns True if user belongs to same organization
 */
export function isSameOrganization(
  context: AuthorizationContext,
  resource: ResourceOwnership
): boolean {
  if (!context.organizationId || !resource.organizationId) {
    return false;
  }
  return context.organizationId === resource.organizationId;
}

/**
 * Require user to belong to same organization as resource
 * Throws AuthorizationError if different organization
 *
 * @param context - Authorization context
 * @param resource - Resource with organization information
 * @throws {AuthorizationError} If user is from different organization
 *
 * @example
 * requireSameOrganization(context, { organizationId: '123', ownerId: 'user1' });
 */
export function requireSameOrganization(
  context: AuthorizationContext,
  resource: ResourceOwnership
): void {
  if (!isSameOrganization(context, resource)) {
    throw new AuthorizationError('You can only access resources from your organization');
  }
}

/**
 * Check if user belongs to same school
 *
 * @param context - Authorization context
 * @param resource - Resource with school information
 * @returns True if user belongs to same school
 */
export function isSameSchool(
  context: AuthorizationContext,
  resource: ResourceOwnership
): boolean {
  if (!context.schoolId || !resource.schoolId) {
    return false;
  }
  return context.schoolId === resource.schoolId;
}

/**
 * Require user to belong to same school as resource
 * Throws AuthorizationError if different school
 *
 * @param context - Authorization context
 * @param resource - Resource with school information
 * @throws {AuthorizationError} If user is from different school
 *
 * @example
 * requireSameSchool(context, { schoolId: '456', ownerId: 'student1' });
 */
export function requireSameSchool(
  context: AuthorizationContext,
  resource: ResourceOwnership
): void {
  if (!isSameSchool(context, resource)) {
    throw new AuthorizationError('You can only access resources from your school');
  }
}

/**
 * Verify user can access student's PHI (Protected Health Information)
 * Healthcare providers and admins can access any student in their school
 * Parents can only access their own children
 *
 * @param context - Authorization context
 * @param studentId - ID of student whose PHI is being accessed
 * @param parentStudentRelationships - Optional: Parent-student relationships
 * @returns True if user can access student's PHI
 *
 * @example
 * const canAccess = canAccessStudentPHI(context, studentId, parentRelationships);
 */
export function canAccessStudentPHI(
  context: AuthorizationContext,
  studentId: string,
  parentStudentRelationships?: Array<{ parentId: string; studentId: string }>
): boolean {
  // Admins and healthcare providers can access all PHI in their school
  if (context.userRole === UserRole.ADMIN || isHealthcareProvider(context.userRole)) {
    return true;
  }

  // Parents can only access their own children's PHI
  if (context.userRole === UserRole.PARENT || context.userRole === UserRole.GUARDIAN) {
    if (!parentStudentRelationships) {
      return false;
    }
    return parentStudentRelationships.some(
      rel => rel.parentId === context.userId && rel.studentId === studentId
    );
  }

  // Students can only access their own PHI
  if (context.userRole === UserRole.STUDENT) {
    return context.userId === studentId;
  }

  return false;
}

/**
 * Require user to have access to student's PHI
 * Throws AuthorizationError if user cannot access
 *
 * @param context - Authorization context
 * @param studentId - ID of student whose PHI is being accessed
 * @param parentStudentRelationships - Optional: Parent-student relationships
 * @throws {AuthorizationError} If user cannot access student's PHI
 *
 * @example
 * requireStudentPHIAccess(context, studentId, parentRelationships);
 */
export function requireStudentPHIAccess(
  context: AuthorizationContext,
  studentId: string,
  parentStudentRelationships?: Array<{ parentId: string; studentId: string }>
): void {
  if (!canAccessStudentPHI(context, studentId, parentStudentRelationships)) {
    throw new AuthorizationError('You are not authorized to access this student\'s health information');
  }
}

/**
 * Verify user can modify student's health records
 * Only healthcare providers and admins can modify
 * Parents and students cannot modify, only view
 *
 * @param context - Authorization context
 * @returns True if user can modify student health records
 *
 * @example
 * const canModify = canModifyStudentHealthRecords(context);
 */
export function canModifyStudentHealthRecords(context: AuthorizationContext): boolean {
  return context.userRole === UserRole.ADMIN || isHealthcareProvider(context.userRole);
}

/**
 * Require user to have permission to modify student health records
 * Throws AuthorizationError if user cannot modify
 *
 * @param context - Authorization context
 * @throws {AuthorizationError} If user cannot modify health records
 *
 * @example
 * requireHealthRecordModifyPermission(context);
 */
export function requireHealthRecordModifyPermission(context: AuthorizationContext): void {
  if (!canModifyStudentHealthRecords(context)) {
    throw new AuthorizationError('Only healthcare providers can modify health records');
  }
}

/**
 * Create authorization context from request user
 * Helper to convert request user to authorization context
 *
 * @param user - User object from request (req.user)
 * @returns Authorization context
 *
 * @example
 * const context = createAuthContext(req.user);
 * requireAdmin(context);
 */
export function createAuthContext(user: any): AuthorizationContext {
  if (!user || !user.id || !user.role) {
    throw new AuthorizationError('Authentication required');
  }

  return {
    userId: user.id,
    userRole: user.role as UserRole,
    organizationId: user.organizationId,
    schoolId: user.schoolId,
    email: user.email
  };
}

/**
 * Verify nurse ID matches authenticated user
 * Prevents nurses from logging actions as other nurses
 *
 * @param context - Authorization context
 * @param nurseId - Nurse ID in the action data
 * @throws {AuthorizationError} If nurse ID doesn't match authenticated user
 *
 * @example
 * requireNurseMatch(context, medicationLog.nurseId);
 */
export function requireNurseMatch(context: AuthorizationContext, nurseId: string): void {
  if (context.userRole !== UserRole.NURSE && context.userRole !== UserRole.ADMIN) {
    throw new AuthorizationError('Only nurses can perform this action');
  }

  // Admins can log as any nurse (for corrections/supervision)
  if (context.userRole === UserRole.ADMIN) {
    return;
  }

  // Nurses must match the nurseId in the data
  if (context.userId !== nurseId) {
    throw new AuthorizationError('You can only log actions under your own nurse ID');
  }
}

/**
 * Verify doctor ID matches authenticated user
 * Prevents doctors from prescribing under other doctors' names
 *
 * @param context - Authorization context
 * @param doctorId - Doctor ID in the prescription data
 * @throws {AuthorizationError} If doctor ID doesn't match authenticated user
 *
 * @example
 * requireDoctorMatch(context, prescription.doctorId);
 */
export function requireDoctorMatch(context: AuthorizationContext, doctorId: string): void {
  if (context.userRole !== UserRole.DOCTOR && context.userRole !== UserRole.ADMIN) {
    throw new AuthorizationError('Only doctors can perform this action');
  }

  // Admins can act as any doctor (for corrections/supervision)
  if (context.userRole === UserRole.ADMIN) {
    return;
  }

  // Doctors must match the doctorId in the data
  if (context.userId !== doctorId) {
    throw new AuthorizationError('You can only create prescriptions under your own doctor ID');
  }
}

/**
 * Check if user can access message/conversation
 * Users can access messages where they are sender or recipient
 *
 * @param context - Authorization context
 * @param senderId - Message sender ID
 * @param recipientId - Message recipient ID
 * @returns True if user can access message
 *
 * @example
 * const canAccess = canAccessMessage(context, message.senderId, message.recipientId);
 */
export function canAccessMessage(
  context: AuthorizationContext,
  senderId: string,
  recipientId: string
): boolean {
  // Admins can access all messages
  if (context.userRole === UserRole.ADMIN) {
    return true;
  }

  // Users can access messages where they are involved
  return context.userId === senderId || context.userId === recipientId;
}

/**
 * Require user to have access to message
 * Throws AuthorizationError if user is not sender or recipient
 *
 * @param context - Authorization context
 * @param senderId - Message sender ID
 * @param recipientId - Message recipient ID
 * @throws {AuthorizationError} If user cannot access message
 *
 * @example
 * requireMessageAccess(context, message.senderId, message.recipientId);
 */
export function requireMessageAccess(
  context: AuthorizationContext,
  senderId: string,
  recipientId: string
): void {
  if (!canAccessMessage(context, senderId, recipientId)) {
    throw new AuthorizationError('You can only access your own messages');
  }
}

/**
 * Export all authorization utilities
 */
export default {
  UserRole,
  hasMinimumRole,
  hasAnyRole,
  requireAdmin,
  requireRole,
  requireMinimumRole,
  isStaff,
  requireStaff,
  isHealthcareProvider,
  requireHealthcareProvider,
  isResourceOwner,
  requireOwnership,
  requireOwnershipOrAdmin,
  requireOwnershipOrStaff,
  isSameOrganization,
  requireSameOrganization,
  isSameSchool,
  requireSameSchool,
  canAccessStudentPHI,
  requireStudentPHIAccess,
  canModifyStudentHealthRecords,
  requireHealthRecordModifyPermission,
  createAuthContext,
  requireNurseMatch,
  requireDoctorMatch,
  canAccessMessage,
  requireMessageAccess
};
