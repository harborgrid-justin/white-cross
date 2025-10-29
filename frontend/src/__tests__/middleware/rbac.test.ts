/**
 * RBAC Middleware Tests
 *
 * Tests for role-based access control functionality
 *
 * @module __tests__/middleware/rbac
 */

import { describe, it, expect } from '@jest/globals';
import {
  checkPermission,
  canPerformAction,
  getRolePermissions,
  UserRole,
  Resource,
  Action,
} from '@/middleware/rbac';

describe('RBAC Middleware - Permission Checking', () => {
  describe('SUPER_ADMIN Role', () => {
    it('should have all permissions', () => {
      expect(checkPermission(UserRole.SUPER_ADMIN, 'students:delete')).toBe(true);
      expect(checkPermission(UserRole.SUPER_ADMIN, 'medications:administer')).toBe(true);
      expect(checkPermission(UserRole.SUPER_ADMIN, 'admin:update')).toBe(true);
      expect(checkPermission(UserRole.SUPER_ADMIN, 'audit:delete')).toBe(true);
    });

    it('should have wildcard permission', () => {
      const permissions = getRolePermissions(UserRole.SUPER_ADMIN);
      expect(permissions).toContain('*');
    });
  });

  describe('ADMIN Role', () => {
    it('should have full access to students', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.STUDENTS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, Resource.STUDENTS, Action.UPDATE)).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, Resource.STUDENTS, Action.DELETE)).toBe(true);
    });

    it('should have full access to medications', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.MEDICATIONS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(true);
    });

    it('should have read-only access to compliance', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.COMPLIANCE, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.ADMIN, Resource.COMPLIANCE, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.ADMIN, Resource.COMPLIANCE, Action.UPDATE)).toBe(false);
    });
  });

  describe('SCHOOL_NURSE Role', () => {
    it('should have full medication management access', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.UPDATE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.DELETE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(true);
    });

    it('should have full health records access', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.HEALTH_RECORDS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.HEALTH_RECORDS, Action.UPDATE)).toBe(true);
    });

    it('should have read/update access to students', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.STUDENTS, Action.UPDATE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.STUDENTS, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.STUDENTS, Action.DELETE)).toBe(false);
    });

    it('should NOT have admin access', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.ADMIN, Action.READ)).toBe(false);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.USERS, Action.CREATE)).toBe(false);
    });
  });

  describe('DISTRICT_ADMIN Role', () => {
    it('should have read access to most resources', () => {
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.MEDICATIONS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.COMPLIANCE, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.ANALYTICS, Action.READ)).toBe(true);
    });

    it('should have update access to students', () => {
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.STUDENTS, Action.UPDATE)).toBe(true);
    });

    it('should NOT have medication write access', () => {
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.MEDICATIONS, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.MEDICATIONS, Action.UPDATE)).toBe(false);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(false);
    });

    it('should have admin read access', () => {
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.ADMIN, Action.READ)).toBe(true);
    });
  });

  describe('OFFICE_STAFF Role', () => {
    it('should have full appointment access', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.APPOINTMENTS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.APPOINTMENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.APPOINTMENTS, Action.UPDATE)).toBe(true);
    });

    it('should have read-only student access', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.STUDENTS, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.STUDENTS, Action.UPDATE)).toBe(false);
    });

    it('should NOT have medication access', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.MEDICATIONS, Action.READ)).toBe(false);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.MEDICATIONS, Action.CREATE)).toBe(false);
    });

    it('should NOT have health records access', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.HEALTH_RECORDS, Action.READ)).toBe(false);
    });
  });

  describe('COUNSELOR Role', () => {
    it('should have read access to student information', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.INCIDENTS, Action.READ)).toBe(true);
    });

    it('should NOT have write access', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.STUDENTS, Action.UPDATE)).toBe(false);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.HEALTH_RECORDS, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.INCIDENTS, Action.UPDATE)).toBe(false);
    });

    it('should NOT have medication access', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.MEDICATIONS, Action.READ)).toBe(false);
    });
  });

  describe('VIEWER Role', () => {
    it('should have read-only access to basic resources', () => {
      expect(canPerformAction(UserRole.VIEWER, Resource.STUDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.VIEWER, Resource.APPOINTMENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.VIEWER, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
    });

    it('should NOT have any write access', () => {
      expect(canPerformAction(UserRole.VIEWER, Resource.STUDENTS, Action.CREATE)).toBe(false);
      expect(canPerformAction(UserRole.VIEWER, Resource.STUDENTS, Action.UPDATE)).toBe(false);
      expect(canPerformAction(UserRole.VIEWER, Resource.STUDENTS, Action.DELETE)).toBe(false);
      expect(canPerformAction(UserRole.VIEWER, Resource.APPOINTMENTS, Action.CREATE)).toBe(false);
    });

    it('should NOT have medication access', () => {
      expect(canPerformAction(UserRole.VIEWER, Resource.MEDICATIONS, Action.READ)).toBe(false);
    });

    it('should NOT have admin access', () => {
      expect(canPerformAction(UserRole.VIEWER, Resource.ADMIN, Action.READ)).toBe(false);
      expect(canPerformAction(UserRole.VIEWER, Resource.AUDIT, Action.READ)).toBe(false);
    });
  });

  describe('Wildcard Permissions', () => {
    it('should match resource:* permissions', () => {
      // ADMIN has students:*
      expect(checkPermission(UserRole.ADMIN, 'students:read')).toBe(true);
      expect(checkPermission(UserRole.ADMIN, 'students:create')).toBe(true);
      expect(checkPermission(UserRole.ADMIN, 'students:update')).toBe(true);
      expect(checkPermission(UserRole.ADMIN, 'students:delete')).toBe(true);
    });

    it('should not match unrelated resources', () => {
      // OFFICE_STAFF does NOT have medications:*
      expect(checkPermission(UserRole.OFFICE_STAFF, 'medications:read')).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle invalid roles gracefully', () => {
      const invalidRole = 'INVALID_ROLE' as UserRole;
      expect(checkPermission(invalidRole, 'students:read')).toBe(false);
    });

    it('should handle malformed permissions', () => {
      expect(checkPermission(UserRole.ADMIN, 'invalid-permission')).toBe(false);
      expect(checkPermission(UserRole.ADMIN, '')).toBe(false);
    });
  });
});

describe('RBAC Middleware - Role Permissions', () => {
  it('should return correct permissions for each role', () => {
    const superAdminPerms = getRolePermissions(UserRole.SUPER_ADMIN);
    expect(superAdminPerms).toContain('*');

    const adminPerms = getRolePermissions(UserRole.ADMIN);
    expect(adminPerms.length).toBeGreaterThan(10);
    expect(adminPerms).toContain('students:*');

    const nursePerms = getRolePermissions(UserRole.SCHOOL_NURSE);
    expect(nursePerms).toContain('medications:*');
    expect(nursePerms).toContain('health-records:*');

    const viewerPerms = getRolePermissions(UserRole.VIEWER);
    expect(viewerPerms.length).toBeLessThan(10);
    expect(viewerPerms.every(p => p.endsWith(':read'))).toBe(true);
  });

  it('should have unique permissions for each role', () => {
    const roles = Object.values(UserRole);
    roles.forEach(role => {
      const perms = getRolePermissions(role);
      const uniquePerms = new Set(perms);
      expect(perms.length).toBe(uniquePerms.size);
    });
  });
});

describe('RBAC Middleware - Healthcare Scenarios', () => {
  describe('Medication Administration Workflow', () => {
    it('should allow SCHOOL_NURSE to administer medications', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(true);
    });

    it('should allow ADMIN to administer medications', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(true);
    });

    it('should NOT allow OFFICE_STAFF to administer medications', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(false);
    });

    it('should NOT allow COUNSELOR to administer medications', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.MEDICATIONS, Action.ADMINISTER)).toBe(false);
    });
  });

  describe('Health Records Access', () => {
    it('should allow clinical staff full access', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.HEALTH_RECORDS, Action.UPDATE)).toBe(true);
    });

    it('should allow counselors read-only access', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.HEALTH_RECORDS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.HEALTH_RECORDS, Action.UPDATE)).toBe(false);
    });

    it('should NOT allow office staff access', () => {
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.HEALTH_RECORDS, Action.READ)).toBe(false);
    });
  });

  describe('Incident Reporting', () => {
    it('should allow nurses to create and manage incidents', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.INCIDENTS, Action.CREATE)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.INCIDENTS, Action.UPDATE)).toBe(true);
    });

    it('should allow school admin to manage incidents', () => {
      expect(canPerformAction(UserRole.SCHOOL_ADMIN, Resource.INCIDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.SCHOOL_ADMIN, Resource.INCIDENTS, Action.UPDATE)).toBe(true);
    });

    it('should allow counselors read-only access', () => {
      expect(canPerformAction(UserRole.COUNSELOR, Resource.INCIDENTS, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.COUNSELOR, Resource.INCIDENTS, Action.CREATE)).toBe(false);
    });
  });

  describe('Compliance and Audit Access', () => {
    it('should allow admin roles to view compliance', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.COMPLIANCE, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.COMPLIANCE, Action.READ)).toBe(true);
    });

    it('should allow admin roles to view audit logs', () => {
      expect(canPerformAction(UserRole.ADMIN, Resource.AUDIT, Action.READ)).toBe(true);
      expect(canPerformAction(UserRole.DISTRICT_ADMIN, Resource.AUDIT, Action.READ)).toBe(true);
    });

    it('should NOT allow clinical staff to view audit logs', () => {
      expect(canPerformAction(UserRole.SCHOOL_NURSE, Resource.AUDIT, Action.READ)).toBe(false);
      expect(canPerformAction(UserRole.OFFICE_STAFF, Resource.AUDIT, Action.READ)).toBe(false);
    });
  });
});
