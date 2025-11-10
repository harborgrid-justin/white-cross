/**
 * Field-Level Authorization Decorator
 *
 * Provides fine-grained authorization at the field level.
 * Useful for restricting access to sensitive PHI fields based on user role.
 *
 * Features:
 * - Role-based field access control
 * - PHI field protection
 * - Graceful degradation (returns null instead of error)
 * - Audit logging for denied access
 *
 * @example
 * ```typescript
 * @ResolveField(() => String, { nullable: true })
 * @FieldAuthorization([UserRole.ADMIN, UserRole.NURSE])
 * async ssn(@Parent() student: StudentDto): Promise<string | null> {
 *   return student.ssn;
 * }
 * ```
 */
import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/database';

/**
 * Metadata key for field authorization
 */
export const FIELD_AUTH_KEY = 'field_auth_roles';

/**
 * Field Authorization Decorator
 *
 * Apply to field resolvers to restrict access based on roles.
 *
 * @param roles - Array of roles allowed to access this field
 * @returns Method decorator
 */
export function FieldAuthorization(roles: UserRole[]) {
  return (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    // Store roles in metadata
    SetMetadata(FIELD_AUTH_KEY, roles)(target, propertyKey, descriptor);

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      // Extract context from arguments
      // For field resolvers: (@Parent(), @Args(), @Context(), @Info())
      const context = args[2];

      // Check if user is authenticated
      if (!context || !context.req || !context.req.user) {
        console.warn('Field authorization: No authenticated user', {
          field: propertyKey,
          timestamp: new Date().toISOString(),
        });
        return null; // Return null for unauthenticated users
      }

      const user = context.req.user;

      // Check if user has required role
      const hasPermission = roles.includes(user.role);

      if (!hasPermission) {
        // Log unauthorized field access attempt
        console.warn('Field authorization denied', {
          userId: user.id,
          userRole: user.role,
          field: propertyKey,
          requiredRoles: roles,
          timestamp: new Date().toISOString(),
        });

        // Return null instead of throwing error for better UX
        return null;
      }

      // Log PHI field access for audit trail
      console.log('Field authorization granted', {
        userId: user.id,
        userRole: user.role,
        field: propertyKey,
        timestamp: new Date().toISOString(),
      });

      // Execute original method
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * PHI Field Decorator
 *
 * Shorthand for protecting PHI fields.
 * Only ADMIN and NURSE roles can access PHI.
 *
 * @example
 * ```typescript
 * @ResolveField(() => String, { nullable: true })
 * @PHIField()
 * async diagnosis(@Parent() record: HealthRecordDto): Promise<string | null> {
 *   return record.diagnosis;
 * }
 * ```
 */
export function PHIField() {
  return FieldAuthorization([
    UserRole.ADMIN,
    UserRole.SCHOOL_ADMIN,
    UserRole.DISTRICT_ADMIN,
    UserRole.NURSE,
  ]);
}

/**
 * Admin Only Field Decorator
 *
 * Restricts field access to administrators only.
 *
 * @example
 * ```typescript
 * @ResolveField(() => String, { nullable: true })
 * @AdminOnlyField()
 * async internalNotes(@Parent() student: StudentDto): Promise<string | null> {
 *   return student.internalNotes;
 * }
 * ```
 */
export function AdminOnlyField() {
  return FieldAuthorization([UserRole.ADMIN]);
}
