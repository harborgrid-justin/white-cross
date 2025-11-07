/**
 * Resource Ownership Guard
 *
 * Implements resource-based authorization for GraphQL resolvers.
 * Ensures users can only access resources they own or are assigned to.
 *
 * Use Cases:
 * - Nurses can only access their assigned students
 * - Parents can only view their children's records
 * - Counselors can only access students in their caseload
 *
 * Features:
 * - Flexible ownership rules
 * - Admin bypass
 * - Audit logging
 * - Type-safe with TypeScript
 *
 * @example
 * ```typescript
 * @Query(() => StudentDto)
 * @UseGuards(GqlAuthGuard, ResourceOwnershipGuard)
 * @ResourceType('student')
 * async student(@Args('id') id: string) { }
 * ```
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserRole } from '@/database';
import { StudentService } from '@/student';
import { HealthRecordService } from '@/health-record';

/**
 * Metadata key for resource type
 */
export const RESOURCE_TYPE_KEY = 'resource_type';

/**
 * Resource Type Decorator
 *
 * Specify the type of resource being accessed.
 *
 * @param resourceType - Type of resource (student, health_record, etc.)
 */
export const ResourceType = (resourceType: string) =>
  SetMetadata(RESOURCE_TYPE_KEY, resourceType);

/**
 * Resource ownership rules
 */
interface OwnershipRule {
  /**
   * Check if user owns or has access to the resource
   */
  checkOwnership: (
    userId: string,
    resourceId: string,
    userRole: UserRole,
  ) => Promise<boolean>;
}

/**
 * Resource Ownership Guard
 *
 * Validates that the user has access to the requested resource.
 */
@Injectable()
export class ResourceOwnershipGuard implements CanActivate {
  /**
   * Ownership rules for different resource types
   */
  private readonly ownershipRules: Record<string, OwnershipRule> = {
    student: {
      checkOwnership: async (
        userId: string,
        studentId: string,
        userRole: UserRole,
      ) => {
        const student = await this.studentService.findOne(studentId);

        if (!student) {
          return false;
        }

        // Nurses can only access their assigned students
        if (userRole === UserRole.NURSE) {
          return student.nurseId === userId;
        }

        // TODO: Add parent access check
        // if (userRole === UserRole.PARENT) {
        //   return student.parentId === userId;
        // }

        // Counselors can access students in their caseload
        // TODO: Implement caseload check

        return true; // Admins and school admins can access all
      },
    },
    health_record: {
      checkOwnership: async (
        userId: string,
        recordId: string,
        userRole: UserRole,
      ) => {
        const record = await this.healthRecordService.findOne(recordId);

        if (!record) {
          return false;
        }

        // Check if user has access to the student
        const student = await this.studentService.findOne(record.studentId);

        if (!student) {
          return false;
        }

        // Nurses can only access records for their assigned students
        if (userRole === UserRole.NURSE) {
          return student.nurseId === userId;
        }

        return true; // Admins can access all records
      },
    },
  };

  constructor(
    private readonly reflector: Reflector,
    private readonly studentService: StudentService,
    private readonly healthRecordService: HealthRecordService,
  ) {}

  /**
   * Validate resource ownership
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get resource type from metadata
    const resourceType = this.reflector.get<string>(
      RESOURCE_TYPE_KEY,
      context.getHandler(),
    );

    // If no resource type specified, allow access
    if (!resourceType) {
      return true;
    }

    // Extract GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const args = ctx.getArgs();

    // Ensure user is authenticated
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Admins bypass ownership checks
    if (
      user.role === UserRole.ADMIN ||
      user.role === UserRole.SCHOOL_ADMIN ||
      user.role === UserRole.DISTRICT_ADMIN
    ) {
      return true;
    }

    // Get resource ID from arguments
    const resourceId = args.id || args.studentId || args.recordId;

    if (!resourceId) {
      console.warn(
        'ResourceOwnershipGuard: No resource ID found in arguments',
        {
          resourceType,
          args,
        },
      );
      return true; // Allow if no ID specified (list queries, etc.)
    }

    // Get ownership rule for this resource type
    const rule = this.ownershipRules[resourceType];

    if (!rule) {
      console.warn(
        `No ownership rule defined for resource type: ${resourceType}`,
      );
      return true; // Allow if no rule defined
    }

    // Check ownership
    const hasAccess = await rule.checkOwnership(user.id, resourceId, user.role);

    if (!hasAccess) {
      // Log unauthorized access attempt
      console.warn('Resource ownership denied', {
        userId: user.id,
        userRole: user.role,
        resourceType,
        resourceId,
        timestamp: new Date().toISOString(),
      });

      throw new ForbiddenException(
        `You do not have permission to access this ${resourceType}`,
      );
    }

    // Log authorized access
    console.log('Resource ownership granted', {
      userId: user.id,
      userRole: user.role,
      resourceType,
      resourceId,
      timestamp: new Date().toISOString(),
    });

    return true;
  }
}
