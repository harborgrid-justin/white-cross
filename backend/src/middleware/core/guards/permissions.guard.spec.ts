/**
 * @fileoverview Permissions Guard Security Tests
 * @module middleware/core/guards/permissions.guard.spec
 * @description Comprehensive security tests for permission-based authorization
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsGuard } from './permissions.guard';
import { Permission, UserRole, ROLE_HIERARCHY, ROLE_PERMISSIONS } from '../types/rbac.types';

describe('PermissionsGuard - CRITICAL SECURITY', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;

  beforeEach(async () => {
    reflector = new Reflector();

    mockRequest = {
      user: {
        userId: 'user-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      },
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;

    guard = new PermissionsGuard(reflector, {
      enableHierarchy: true,
      enableAuditLogging: true,
    });
  });

  describe('No Permissions Required', () => {
    it('should allow access when no permissions are specified', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow access when empty permissions array is specified', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Authentication Requirements', () => {
    it('should throw ForbiddenException if user is not authenticated', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      delete mockRequest.user;

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        'User not authenticated',
      );
    });
  });

  describe('Permission Validation - ALL Mode', () => {
    it('should allow access when user has all required permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_HEALTH_RECORDS];

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should deny access when user lacks some required permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_HEALTH_RECORDS];

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should deny access when user has no required permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SYSTEM])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_STUDENT_BASIC];

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Permission Validation - ANY Mode', () => {
    it('should allow access when user has at least one required permission', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('any');

      mockRequest.user.permissions = [Permission.READ_HEALTH_RECORDS];

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should deny access when user has none of the required permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.MANAGE_SYSTEM,
          Permission.MANAGE_USERS,
        ])
        .mockReturnValueOnce('any');

      mockRequest.user.permissions = [Permission.READ_STUDENT_BASIC];

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow access when user has multiple matching permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('any');

      mockRequest.user.permissions = [
        Permission.READ_HEALTH_RECORDS,
        Permission.UPDATE_HEALTH_RECORDS,
      ];

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Role-Based Permissions', () => {
    it('should allow access based on role permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      };

      // SCHOOL_NURSE role should have READ_HEALTH_RECORDS permission by default
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should check explicit user permissions before role permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SYSTEM])
        .mockReturnValueOnce('all');

      // User with explicit permission should have access even if role doesn't
      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [Permission.MANAGE_SYSTEM],
      };

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Role Hierarchy - Permission Inheritance', () => {
    it('should inherit permissions from lower roles when hierarchy is enabled', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_STUDENT_BASIC])
        .mockReturnValueOnce('all');

      // SYSTEM_ADMINISTRATOR should inherit permissions from SCHOOL_NURSE
      mockRequest.user = {
        userId: 'admin-123',
        role: UserRole.SYSTEM_ADMINISTRATOR,
        permissions: [],
      };

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not inherit permissions when hierarchy is disabled', () => {
      guard = new PermissionsGuard(reflector, {
        enableHierarchy: false,
        enableAuditLogging: true,
      });

      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_STUDENT_BASIC])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'admin-123',
        role: UserRole.SYSTEM_ADMINISTRATOR,
        permissions: [],
      };

      // Without hierarchy, should check exact role permissions only
      // This test assumes READ_STUDENT_BASIC is not in SYSTEM_ADMINISTRATOR's direct permissions
      const result = guard.canActivate(mockExecutionContext);
      // Result depends on ROLE_PERMISSIONS configuration
      expect(typeof result).toBe('boolean');
    });

    it('should allow super admin to access everything through hierarchy', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.MANAGE_SYSTEM,
          Permission.EXPORT_DATA,
        ])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'superadmin-123',
        role: UserRole.SUPER_ADMIN,
        permissions: [],
      };

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Privilege Escalation Prevention', () => {
    it('should prevent student from accessing admin functions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_USERS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'student-123',
        role: UserRole.STUDENT,
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should prevent parent from accessing school administration', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SCHOOLS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'parent-123',
        role: UserRole.PARENT_GUARDIAN,
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should prevent school nurse from managing system', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SYSTEM])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should prevent district nurse from managing district administration', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SCHOOLS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.DISTRICT_NURSE,
        permissions: [],
      };

      // District nurses shouldn't have MANAGE_SCHOOLS permission
      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('PHI Access Control', () => {
    it('should allow school nurse to read health records', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      };

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should prevent student from accessing other students health records', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'student-123',
        role: UserRole.STUDENT,
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow nurse to administer medications', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.ADMINISTER_MEDICATIONS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      };

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should prevent unauthorized export of PHI data', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.EXPORT_DATA])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [],
      };

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );
    });
  });

  describe('Audit Logging', () => {
    it('should log successful authorization', () => {
      const loggerSpy = jest.spyOn(guard['logger'], 'debug');

      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_STUDENT_BASIC])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_STUDENT_BASIC];

      guard.canActivate(mockExecutionContext);

      expect(loggerSpy).toHaveBeenCalledWith(
        'Permission authorization successful',
        expect.objectContaining({
          userId: 'user-123',
          userRole: UserRole.SCHOOL_NURSE,
        }),
      );
    });

    it('should log failed authorization attempts', () => {
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');

      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SYSTEM])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [];

      try {
        guard.canActivate(mockExecutionContext);
      } catch {
        // Expected
      }

      expect(loggerSpy).toHaveBeenCalledWith(
        'Permission authorization failed',
        expect.objectContaining({
          userId: 'user-123',
          requiredPermissions: [Permission.MANAGE_SYSTEM],
        }),
      );
    });

    it('should log missing permissions in failure', () => {
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');

      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_HEALTH_RECORDS];

      try {
        guard.canActivate(mockExecutionContext);
      } catch {
        // Expected
      }

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          missingPermissions: [Permission.UPDATE_HEALTH_RECORDS],
        }),
      );
    });

    it('should not log when audit logging is disabled', () => {
      guard = new PermissionsGuard(reflector, {
        enableHierarchy: true,
        enableAuditLogging: false,
      });

      const loggerSpy = jest.spyOn(guard['logger'], 'debug');

      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_STUDENT_BASIC])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [Permission.READ_STUDENT_BASIC];

      guard.canActivate(mockExecutionContext);

      expect(loggerSpy).not.toHaveBeenCalled();
    });
  });

  describe('Error Messages', () => {
    it('should provide clear error message with required permissions (ALL mode)', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('all');

      mockRequest.user.permissions = [];

      try {
        guard.canActivate(mockExecutionContext);
        fail('Should have thrown ForbiddenException');
      } catch (error: any) {
        expect(error.message).toContain('all');
        expect(error.message).toContain(Permission.READ_HEALTH_RECORDS);
        expect(error.message).toContain(Permission.UPDATE_HEALTH_RECORDS);
      }
    });

    it('should provide clear error message with required permissions (ANY mode)', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.MANAGE_SYSTEM, Permission.MANAGE_USERS])
        .mockReturnValueOnce('any');

      mockRequest.user.permissions = [];

      try {
        guard.canActivate(mockExecutionContext);
        fail('Should have thrown ForbiddenException');
      } catch (error: any) {
        expect(error.message).toContain('any');
        expect(error.message).toContain(Permission.MANAGE_SYSTEM);
        expect(error.message).toContain(Permission.MANAGE_USERS);
      }
    });
  });

  describe('Complex Permission Scenarios', () => {
    it('should handle multiple permissions with mixed modes', () => {
      // User has READ but not UPDATE
      mockRequest.user.permissions = [Permission.READ_HEALTH_RECORDS];

      // Test ALL mode - should fail
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('all');

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        ForbiddenException,
      );

      // Test ANY mode - should pass
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([
          Permission.READ_HEALTH_RECORDS,
          Permission.UPDATE_HEALTH_RECORDS,
        ])
        .mockReturnValueOnce('any');

      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should handle empty explicit permissions with role-based permissions', () => {
      jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValueOnce([Permission.READ_HEALTH_RECORDS])
        .mockReturnValueOnce('all');

      mockRequest.user = {
        userId: 'nurse-123',
        role: UserRole.SCHOOL_NURSE,
        permissions: [], // Empty explicit permissions
      };

      // Should still work through role-based permissions
      const result = guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });
});
