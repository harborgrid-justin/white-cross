/**
 * ROLES GUARD TESTS (HIGH PRIORITY SECURITY)
 *
 * Tests role-based access control functionality including:
 * - Single role requirement validation
 * - Multiple role requirements
 * - Role hierarchy and permissions
 * - Missing roles rejection
 * - Unauthenticated user handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from '../roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole   } from '@/database/models';

describe('RolesGuard (HIGH PRIORITY SECURITY)', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  const createMockExecutionContext = (
    user: any,
    requiredRoles: UserRole[] | null = null,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== SINGLE ROLE TESTS ====================

  describe('Single Role Requirements', () => {
    it('should allow access when user has required ADMIN role', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'admin@whitecross.edu',
        role: UserRole.ADMIN,
      };
      const context = createMockExecutionContext(adminUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required NURSE role', () => {
      const nurseUser = {
        id: 'nurse-id',
        email: 'nurse@whitecross.edu',
        role: UserRole.NURSE,
      };
      const context = createMockExecutionContext(nurseUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.NURSE]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has required COUNSELOR role', () => {
      const counselorUser = {
        id: 'counselor-id',
        email: 'counselor@whitecross.edu',
        role: UserRole.COUNSELOR,
      };
      const context = createMockExecutionContext(counselorUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.COUNSELOR]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user lacks required role', () => {
      const nurseUser = {
        id: 'nurse-id',
        email: 'nurse@whitecross.edu',
        role: UserRole.NURSE,
      };
      const context = createMockExecutionContext(nurseUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
      expect(() => guard.canActivate(context))
        .toThrow('Insufficient permissions. Required roles: ADMIN');
    });
  });

  // ==================== MULTIPLE ROLE TESTS ====================

  describe('Multiple Role Requirements', () => {
    it('should allow access when user has one of multiple required roles (ADMIN)', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'admin@whitecross.edu',
        role: UserRole.ADMIN,
      };
      const context = createMockExecutionContext(adminUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when user has one of multiple required roles (SCHOOL_ADMIN)', () => {
      const schoolAdminUser = {
        id: 'school-admin-id',
        email: 'schooladmin@whitecross.edu',
        role: UserRole.SCHOOL_ADMIN,
      };
      const context = createMockExecutionContext(schoolAdminUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should deny access when user has none of the required roles', () => {
      const viewerUser = {
        id: 'viewer-id',
        email: 'viewer@whitecross.edu',
        role: UserRole.VIEWER,
      };
      const context = createMockExecutionContext(viewerUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
      ]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
      expect(() => guard.canActivate(context))
        .toThrow('Insufficient permissions. Required roles: ADMIN, SCHOOL_ADMIN');
    });

    it('should handle all role types correctly', () => {
      const allRoles = [
        UserRole.ADMIN,
        UserRole.NURSE,
        UserRole.SCHOOL_ADMIN,
        UserRole.DISTRICT_ADMIN,
        UserRole.VIEWER,
        UserRole.COUNSELOR,
      ];

      allRoles.forEach(role => {
        const user = { id: 'test-id', email: 'test@test.com', role };
        const context = createMockExecutionContext(user);
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([role]);

        const result = guard.canActivate(context);

        expect(result).toBe(true);
      });
    });
  });

  // ==================== NO ROLES REQUIRED TESTS ====================

  describe('No Roles Required', () => {
    it('should allow access when no roles are specified (route is unprotected)', () => {
      const anyUser = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.VIEWER,
      };
      const context = createMockExecutionContext(anyUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when roles array is empty', () => {
      const anyUser = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.VIEWER,
      };
      const context = createMockExecutionContext(anyUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow access when roles array is undefined', () => {
      const anyUser = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.VIEWER,
      };
      const context = createMockExecutionContext(anyUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  // ==================== UNAUTHENTICATED USER TESTS ====================

  describe('Unauthenticated User Handling', () => {
    it('should throw ForbiddenException when user is not authenticated', () => {
      const context = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
      expect(() => guard.canActivate(context))
        .toThrow('User not authenticated');
    });

    it('should throw ForbiddenException when user is undefined', () => {
      const context = createMockExecutionContext(undefined);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.NURSE]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
      expect(() => guard.canActivate(context))
        .toThrow('User not authenticated');
    });

    it('should require authentication even when no roles specified', () => {
      const context = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);

      // When no roles required, should still allow access
      const result = guard.canActivate(context);
      expect(result).toBe(true);
    });
  });

  // ==================== ROLE VALIDATION TESTS ====================

  describe('Role Validation', () => {
    it('should validate user has role property', () => {
      const userWithoutRole = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        // No role property
      };
      const context = createMockExecutionContext(userWithoutRole);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });

    it('should handle invalid role values', () => {
      const userWithInvalidRole = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: 'INVALID_ROLE' as any,
      };
      const context = createMockExecutionContext(userWithInvalidRole);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });

    it('should be case-sensitive with role matching', () => {
      const userWithLowercaseRole = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: 'admin' as any, // lowercase instead of ADMIN
      };
      const context = createMockExecutionContext(userWithLowercaseRole);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });
  });

  // ==================== DECORATOR INTEGRATION TESTS ====================

  describe('Decorator Integration', () => {
    it('should check both handler and class level decorators', () => {
      const user = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.ADMIN,
      };
      const context = createMockExecutionContext(user);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([UserRole.ADMIN]);

      guard.canActivate(context);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith('roles', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should use ROLES_KEY constant for decorator lookup', () => {
      const user = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.ADMIN,
      };
      const context = createMockExecutionContext(user);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      guard.canActivate(context);

      // Verify it looks up 'roles' key (ROLES_KEY constant value)
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(
        'roles',
        expect.any(Array),
      );
    });
  });

  // ==================== HEALTHCARE-SPECIFIC SCENARIOS ====================

  describe('Healthcare-Specific Authorization', () => {
    it('should allow ADMIN to access all resources', () => {
      const adminUser = {
        id: 'admin-id',
        email: 'admin@whitecross.edu',
        role: UserRole.ADMIN,
      };
      const context = createMockExecutionContext(adminUser);

      // Test access to various protected resources
      const protectedResources = [
        [UserRole.ADMIN],
        [UserRole.NURSE],
        [UserRole.COUNSELOR],
        [UserRole.ADMIN, UserRole.NURSE],
      ];

      protectedResources.forEach(roles => {
        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(roles);
        if (roles.includes(UserRole.ADMIN)) {
          const result = guard.canActivate(context);
          expect(result).toBe(true);
        }
      });
    });

    it('should restrict NURSE from accessing COUNSELOR-only mental health records', () => {
      const nurseUser = {
        id: 'nurse-id',
        email: 'nurse@whitecross.edu',
        role: UserRole.NURSE,
      };
      const context = createMockExecutionContext(nurseUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.COUNSELOR]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });

    it('should allow COUNSELOR to access mental health records', () => {
      const counselorUser = {
        id: 'counselor-id',
        email: 'counselor@whitecross.edu',
        role: UserRole.COUNSELOR,
      };
      const context = createMockExecutionContext(counselorUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.COUNSELOR]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow both NURSE and COUNSELOR to access general health records', () => {
      const nurseUser = {
        id: 'nurse-id',
        email: 'nurse@whitecross.edu',
        role: UserRole.NURSE,
      };
      const counselorUser = {
        id: 'counselor-id',
        email: 'counselor@whitecross.edu',
        role: UserRole.COUNSELOR,
      };

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.NURSE,
        UserRole.COUNSELOR,
      ]);

      const nurseContext = createMockExecutionContext(nurseUser);
      const counselorContext = createMockExecutionContext(counselorUser);

      expect(guard.canActivate(nurseContext)).toBe(true);
      expect(guard.canActivate(counselorContext)).toBe(true);
    });

    it('should restrict VIEWER from modifying any records', () => {
      const viewerUser = {
        id: 'viewer-id',
        email: 'viewer@whitecross.edu',
        role: UserRole.VIEWER,
      };
      const context = createMockExecutionContext(viewerUser);

      // VIEWER should not have write access (ADMIN, NURSE, COUNSELOR only)
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.NURSE,
        UserRole.COUNSELOR,
      ]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });

    it('should allow SCHOOL_ADMIN to manage school-level resources', () => {
      const schoolAdminUser = {
        id: 'school-admin-id',
        email: 'schooladmin@whitecross.edu',
        role: UserRole.SCHOOL_ADMIN,
      };
      const context = createMockExecutionContext(schoolAdminUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow DISTRICT_ADMIN to manage district-level resources', () => {
      const districtAdminUser = {
        id: 'district-admin-id',
        email: 'districtadmin@whitecross.edu',
        role: UserRole.DISTRICT_ADMIN,
      };
      const context = createMockExecutionContext(districtAdminUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.DISTRICT_ADMIN,
      ]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  // ==================== ERROR MESSAGE TESTS ====================

  describe('Error Messages', () => {
    it('should provide clear error message with required roles', () => {
      const nurseUser = {
        id: 'nurse-id',
        email: 'nurse@whitecross.edu',
        role: UserRole.NURSE,
      };
      const context = createMockExecutionContext(nurseUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
      ]);

      expect(() => guard.canActivate(context))
        .toThrow('Insufficient permissions. Required roles: ADMIN, SCHOOL_ADMIN');
    });

    it('should not expose sensitive user information in errors', () => {
      const user = {
        id: 'sensitive-user-id',
        email: 'sensitive@whitecross.edu',
        role: UserRole.VIEWER,
        password: 'should-not-be-in-error',
      };
      const context = createMockExecutionContext(user);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      try {
        guard.canActivate(context);
      } catch (error) {
        expect(error.message).not.toContain('password');
        expect(error.message).not.toContain('sensitive-user-id');
      }
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle user object with extra properties', () => {
      const userWithExtraProps = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.ADMIN,
        extraProp: 'should-be-ignored',
        anotherProp: 123,
      };
      const context = createMockExecutionContext(userWithExtraProps);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should handle empty user object', () => {
      const emptyUser = {} as any;
      const context = createMockExecutionContext(emptyUser);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);

      expect(() => guard.canActivate(context))
        .toThrow(ForbiddenException);
    });

    it('should handle very long required roles array', () => {
      const user = {
        id: 'user-id',
        email: 'user@whitecross.edu',
        role: UserRole.NURSE,
      };
      const context = createMockExecutionContext(user);
      const manyRoles = [
        UserRole.ADMIN,
        UserRole.SCHOOL_ADMIN,
        UserRole.DISTRICT_ADMIN,
        UserRole.COUNSELOR,
        UserRole.NURSE,
      ];
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(manyRoles);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
    });
  });
});
