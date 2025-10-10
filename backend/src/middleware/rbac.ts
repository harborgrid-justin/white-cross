import { Request, ResponseToolkit } from '@hapi/hapi';
import * as Boom from '@hapi/boom';
import { Role } from '@prisma/client';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

// Role-based permissions matrix
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
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
  TEACHER: [
    // Students - read only
    { resource: 'students', action: 'read' },
    // Health Records - read only for assigned students
    { resource: 'health-records', action: 'read' },
    // Appointments - create and read
    { resource: 'appointments', action: 'create' },
    { resource: 'appointments', action: 'read' },
    // Incidents - create and read
    { resource: 'incidents', action: 'create' },
    { resource: 'incidents', action: 'read' },
    // Emergency Contacts - read only
    { resource: 'emergency-contacts', action: 'read' },
    // Communications - read only
    { resource: 'communications', action: 'read' },
  ],
  PARENT: [
    // Can only access their own children's data
    { resource: 'students', action: 'read' },
    { resource: 'health-records', action: 'read' },
    { resource: 'appointments', action: 'read' },
    { resource: 'documents', action: 'read' },
    { resource: 'communications', action: 'read' },
  ],
};

/**
 * Check if user has required permission
 */
export function hasPermission(userRole: Role, resource: string, action: string): boolean {
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
 */
export async function canAccessStudent(
  userId: string,
  userRole: Role,
  studentId: string,
  prisma: any
): Promise<boolean> {
  // Admins can access all
  if (userRole === 'ADMIN') {
    return true;
  }

  // Nurses can access students they're assigned to
  if (userRole === 'NURSE') {
    const assignment = await prisma.studentNurseAssignment.findFirst({
      where: {
        studentId,
        nurseId: userId,
        active: true,
      },
    });
    return !!assignment;
  }

  // Teachers can access students in their classes
  if (userRole === 'TEACHER') {
    const enrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        class: {
          teacherId: userId,
        },
        active: true,
      },
    });
    return !!enrollment;
  }

  // Parents can only access their own children
  if (userRole === 'PARENT') {
    const relationship = await prisma.studentParentRelationship.findFirst({
      where: {
        studentId,
        parentId: userId,
        active: true,
      },
    });
    return !!relationship;
  }

  return false;
}

/**
 * Middleware to check student access
 */
export function requireStudentAccess(prisma: any) {
  return async (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials?.user;
    const studentId = request.params.studentId || request.payload?.studentId;

    if (!user) {
      throw Boom.unauthorized('Authentication required');
    }

    if (!studentId) {
      throw Boom.badRequest('Student ID required');
    }

    const hasAccess = await canAccessStudent(user.id, user.role, studentId, prisma);

    if (!hasAccess) {
      throw Boom.forbidden('You do not have access to this student');
    }

    return h.continue;
  };
}
