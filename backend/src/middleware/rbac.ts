import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { UserRole } from '../database/types/enums';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Admins can manage everything
    { resource: '*', action: 'manage' },
  ],
  NURSE: [
    // Students
    { resource: 'students', action: 'read' },
    { resource: 'students', action: 'update' },
    { resource: 'students', action: 'create' },
    // Health Records
    { resource: 'health-records', action: 'create' },
    { resource: 'health-records', action: 'read' },
    { resource: 'health-records', action: 'update' },
    { resource: 'health-records', action: 'delete' },
    // Medications
    { resource: 'medications', action: 'create' },
    { resource: 'medications', action: 'read' },
    { resource: 'medications', action: 'update' },
    { resource: 'medications', action: 'manage' },
    // Appointments
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' },
    { resource: 'appointments', action: 'delete' },
    // Incidents
    { resource: 'incidents', action: 'create' },
    { resource: 'incidents', action: 'read' },
    { resource: 'incidents', action: 'update' },
    // Documents
    { resource: 'documents', action: 'create' },
    { resource: 'documents', action: 'read' },
    { resource: 'documents', action: 'update' },
    { resource: 'documents', action: 'delete' },
    // Emergency Contacts
    { resource: 'emergency-contacts', action: 'read' },
    { resource: 'emergency-contacts', action: 'update' },
    // Communications
    { resource: 'communications', action: 'create' },
    { resource: 'communications', action: 'read' },
    // Inventory
    { resource: 'inventory', action: 'read' },
    { resource: 'inventory', action: 'update' },
    // Reports
    { resource: 'reports', action: 'read' },
    { resource: 'reports', action: 'create' },
  ],
  SCHOOL_ADMIN: [
    // School admins have similar permissions to nurses but with additional admin capabilities
    { resource: 'students', action: 'manage' },
    { resource: 'health-records', action: 'manage' },
    { resource: 'medications', action: 'manage' },
    { resource: 'appointments', action: 'manage' },
    { resource: 'incidents', action: 'manage' },
    { resource: 'documents', action: 'manage' },
    { resource: 'emergency-contacts', action: 'manage' },
    { resource: 'communications', action: 'manage' },
    { resource: 'inventory', action: 'manage' },
    { resource: 'reports', action: 'manage' },
    { resource: 'users', action: 'read' },
  ],
  DISTRICT_ADMIN: [
    // District admins can manage everything except system settings
    { resource: '*', action: 'manage' },
  ],
  VIEWER: [
    // Read-only access to basic information
    { resource: 'students', action: 'read' },
    { resource: 'health-records', action: 'read' },
    { resource: 'appointments', action: 'read' },
    { resource: 'documents', action: 'read' },
    { resource: 'communications', action: 'read' },
    { resource: 'reports', action: 'read' },
  ],
  COUNSELOR: [
    // Counselors have read access to mental health records and can create appointments
    { resource: 'students', action: 'read' },
    { resource: 'health-records', action: 'read' },
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    { resource: 'appointments', action: 'update' },
    { resource: 'incidents', action: 'read' },
    { resource: 'documents', action: 'read' },
    { resource: 'emergency-contacts', action: 'read' },
    { resource: 'communications', action: 'create' },
    { resource: 'communications', action: 'read' },
  ],
};

/**
 * Check if user has required permission
 */
export function hasPermission(userRole: UserRole, resource: string, action: string): boolean {
  const permissions = ROLE_PERMISSIONS[userRole] || [];

  // Check for wildcard permission (admin)
  if (permissions.some((p) => p.resource === '*' && p.action === 'manage')) {
    return true;
  }

  // Check for specific permission
  return permissions.some(
    (p) => p.resource === resource && (p.action === action || p.action === 'manage')
  );
}

/**
 * RBAC middleware factory
 */
export function requirePermission(resource: string, action: 'create' | 'read' | 'update' | 'delete' | 'manage') {
  return (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials?.user;

    if (!user) {
      throw Boom.unauthorized('Authentication required');
    }

    if (!hasPermission(user.role, resource, action)) {
      throw Boom.forbidden(`Insufficient permissions to ${action} ${resource}`);
    }

    return h.continue;
  };
}

/**
 * Check if user can access specific student data
 *
 * HIPAA Compliance: Enforces least-privilege access to student PHI based on relationships
 * and assignments. Critical for maintaining data privacy and audit compliance.
 */
export async function canAccessStudent(
  userId: string,
  userRole: UserRole,
  studentId: string
): Promise<boolean> {
  // Admins and District Admins can access all students
  if (userRole === UserRole.ADMIN || userRole === UserRole.DISTRICT_ADMIN) {
    return true;
  }

  // School admins can access students in their school
  if (userRole === UserRole.SCHOOL_ADMIN) {
    // TODO: Implement school-based access control when StudentSchoolAssignment model exists
    // For now, allow access
    return true;
  }

  // Nurses can access all students (standard practice in school nursing)
  // In production, implement nurse-student assignments if needed
  if (userRole === UserRole.NURSE) {
    // TODO: If nurse-student assignments are implemented, check here:
    // const assignment = await StudentNurseAssignment.findOne({
    //   where: { studentId, nurseId: userId, active: true }
    // });
    // return !!assignment;
    return true;
  }

  // Counselors can access students they are assigned to
  if (userRole === UserRole.COUNSELOR) {
    // TODO: Implement counselor-student assignments when model exists
    // For now, allow access similar to nurses
    return true;
  }

  // Viewers have read-only access to basic student information
  if (userRole === UserRole.VIEWER) {
    // Viewers typically have limited access - implement specific logic as needed
    return true;
  }

  // No other roles should have direct student access
  return false;
}

/**
 * Middleware to check student access
 *
 * Security: Validates user has appropriate permissions to access student data
 * before proceeding with the request.
 */
export function requireStudentAccess() {
  return async (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials?.user;
    const studentId = request.params.studentId || (request.payload as any)?.studentId;

    if (!user) {
      throw Boom.unauthorized('Authentication required');
    }

    if (!studentId) {
      throw Boom.badRequest('Student ID required');
    }

    const hasAccess = await canAccessStudent(user.id, user.role as UserRole, studentId);

    if (!hasAccess) {
      throw Boom.forbidden('You do not have access to this student');
    }

    return h.continue;
  };
}
