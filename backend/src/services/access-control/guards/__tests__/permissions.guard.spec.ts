/**
 * @fileoverview Permissions Guard Unit Tests
 * @module access-control/guards/__tests__/permissions
 * @description Comprehensive tests for fine-grained permission guard including:
 * - Permission checking
 * - Public route handling
 * - Authorization failures
 * - Performance monitoring
 * - HIPAA audit logging
 *
 * @security Critical tests for fine-grained access control
 * @compliance HIPAA 164.308(a)(4)(i) - Information Access Management
 */

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsGuard } from '../permissions.guard';
import { AccessControlService } from '../../access-control.service';

describe('PermissionsGuard', () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;
  let accessControlService: AccessControlService;

  // Mock AccessControlService
  const mockAccessControlService = {
    checkPermission: jest.fn(),
  };

  // Mock request factory
  const createMockRequest = (user: any = null) => ({
    user,
    path: '/api/test',
    method: 'GET',
  });

  // Mock ExecutionContext factory
  const createMockExecutionContext = (
    user: any = null,
    permission?: { resource: string; action: string },
    isPublic = false,
  ): ExecutionContext => {
    const mockRequest = createMockRequest(user);
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
      getHandler: jest.fn().mockReturnValue({ name: 'testHandler' }),
      getClass: jest.fn().mockReturnValue({ name: 'TestController' }),
    } as unknown as ExecutionContext;

    // Mock reflector responses
    jest.spyOn(reflector, 'getAllAndOverride')
      .mockImplementation((key: string) => {
        if (key === 'isPublic') return isPublic;
        if (key === 'permissions') return permission;
        return undefined;
      });

    return mockContext;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: AccessControlService,
          useValue: mockAccessControlService,
        },
      ],
    }).compile();

    guard = module.get<PermissionsGuard>(PermissionsGuard);
    reflector = module.get<Reflector>(Reflector);
    accessControlService = module.get<AccessControlService>(AccessControlService);
  });

  describe('Public Routes', () => {
    it('should allow access to public routes without authentication', async () => {
      // Arrange
      const context = createMockExecutionContext(null, undefined, true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(accessControlService.checkPermission).not.toHaveBeenCalled();
    });

    it('should allow access to public routes with authentication', async () => {
      // Arrange
      const user = { id: 'user-123', email: 'test@test.com' };
      const context = createMockExecutionContext(user, undefined, true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Routes Without Permission Requirements', () => {
    it('should allow access when no permissions are required', async () => {
      // Arrange
      const user = { id: 'user-123', email: 'test@test.com' };
      const context = createMockExecutionContext(user, undefined, false);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(accessControlService.checkPermission).not.toHaveBeenCalled();
    });
  });

  describe('Permission Validation', () => {
    it('should allow access when user has required permission', async () => {
      // Arrange
      const user = { id: 'user-123', email: 'test@test.com' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(accessControlService.checkPermission).toHaveBeenCalledWith(
        'user-123',
        'health-records',
        'read',
      );
    });

    it('should deny access when user lacks required permission', async () => {
      // Arrange
      const user = { id: 'user-123', email: 'test@test.com' };
      const permission = { resource: 'health-records', action: 'delete' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(false);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response).toMatchObject({
          message: 'Access denied: Insufficient permissions',
          reason: 'insufficient_permissions',
          required: 'health-records:delete',
        });
      }
    });

    it('should check multiple resource types', async () => {
      // Arrange
      const user = { id: 'user-123' };
      const resources = [
        { resource: 'students', action: 'read' },
        { resource: 'medications', action: 'write' },
        { resource: 'appointments', action: 'create' },
      ];

      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act & Assert
      for (const permission of resources) {
        const context = createMockExecutionContext(user, permission, false);
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      expect(accessControlService.checkPermission).toHaveBeenCalledTimes(3);
    });

    it('should check multiple action types', async () => {
      // Arrange
      const user = { id: 'user-123' };
      const actions = ['read', 'write', 'create', 'update', 'delete'];

      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act & Assert
      for (const action of actions) {
        const permission = { resource: 'health-records', action };
        const context = createMockExecutionContext(user, permission, false);
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      expect(accessControlService.checkPermission).toHaveBeenCalledTimes(actions.length);
    });
  });

  describe('Authentication Requirements', () => {
    it('should deny access when user is not authenticated', async () => {
      // Arrange
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(null, permission, false);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response).toMatchObject({
          message: 'Access denied',
          reason: 'no_authenticated_user',
        });
      }
    });

    it('should deny access when user has no ID', async () => {
      // Arrange
      const user = { email: 'test@test.com' }; // No ID
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should have thrown ForbiddenException');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response.reason).toBe('no_authenticated_user');
      }
    });
  });

  describe('PHI Access Control', () => {
    it('should enforce strict permissions for health record access', async () => {
      // Arrange
      const user = { id: 'nurse-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(accessControlService.checkPermission).toHaveBeenCalledWith(
        'nurse-123',
        'health-records',
        'read',
      );
    });

    it('should deny unauthorized PHI access', async () => {
      // Arrange
      const user = { id: 'viewer-123' };
      const permission = { resource: 'health-records', action: 'update' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(false);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should deny unauthorized PHI access');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should enforce permissions for medication management', async () => {
      // Arrange
      const user = { id: 'nurse-123' };
      const permission = { resource: 'medications', action: 'administer' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should enforce permissions for student data export', async () => {
      // Arrange
      const user = { id: 'admin-123' };
      const permission = { resource: 'students', action: 'export' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(accessControlService.checkPermission).toHaveBeenCalledWith(
        'admin-123',
        'students',
        'export',
      );
    });
  });

  describe('Logging and Audit', () => {
    it('should log authorization success', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'debug');
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      await guard.canActivate(context);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Authorization successful',
        expect.objectContaining({
          userId: 'user-123',
          permission: 'health-records:read',
        }),
      );
    });

    it('should log authorization failures', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'delete' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(false);

      // Act
      try {
        await guard.canActivate(context);
      } catch (error) {
        // Expected
      }

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Authorization failed: Insufficient permissions',
        expect.objectContaining({
          userId: 'user-123',
          requiredPermission: { resource: 'health-records', action: 'delete' },
        }),
      );
    });

    it('should log unauthenticated access attempts', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(null, permission, false);

      // Act
      try {
        await guard.canActivate(context);
      } catch (error) {
        // Expected
      }

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Authorization failed: No authenticated user',
        expect.objectContaining({
          requiredPermission: { resource: 'health-records', action: 'read' },
        }),
      );
    });

    it('should log slow permission checks', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);

      // Simulate slow permission check (> 100ms)
      mockAccessControlService.checkPermission.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 150)),
      );

      // Act
      await guard.canActivate(context);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Slow permissions guard execution',
        expect.objectContaining({
          duration: expect.any(Number),
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should fail closed when AccessControlService throws error', async () => {
      // Arrange
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockRejectedValue(
        new Error('Database connection failed'),
      );

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should fail closed on service error');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.message).toBe('Authorization service unavailable');
      }
    });

    it('should log unexpected errors', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'error');
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      const serviceError = new Error('Unexpected service failure');
      mockAccessControlService.checkPermission.mockRejectedValue(serviceError);

      // Act
      try {
        await guard.canActivate(context);
      } catch (error) {
        // Expected
      }

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        'Permissions guard execution failed',
        expect.objectContaining({
          error: 'Unexpected service failure',
        }),
      );
    });

    it('should re-throw ForbiddenException without modification', async () => {
      // Arrange
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      const forbiddenError = new ForbiddenException('Custom forbidden message');
      mockAccessControlService.checkPermission.mockRejectedValue(forbiddenError);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should re-throw ForbiddenException');
      } catch (error) {
        expect(error).toBe(forbiddenError);
        expect(error.message).toBe('Custom forbidden message');
      }
    });
  });

  describe('Performance', () => {
    it('should complete permission check within 100ms', async () => {
      // Arrange
      const user = { id: 'user-123' };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const startTime = Date.now();
      await guard.canActivate(context);
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(100);
    });

    it('should handle concurrent permission checks', async () => {
      // Arrange
      const contexts = Array.from({ length: 100 }, (_, i) => {
        const user = { id: `user-${i}` };
        const permission = { resource: 'health-records', action: 'read' };
        return createMockExecutionContext(user, permission, false);
      });
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const startTime = Date.now();
      await Promise.all(contexts.map((ctx) => guard.canActivate(ctx)));
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(500); // Should complete in < 500ms
      expect(accessControlService.checkPermission).toHaveBeenCalledTimes(100);
    });
  });

  describe('HIPAA Compliance Scenarios', () => {
    it('should enforce read-only access for viewers', async () => {
      // Arrange
      const user = { id: 'viewer-123' };
      const permission = { resource: 'health-records', action: 'update' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(false);

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should deny write access for viewers');
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should allow emergency access override (if implemented)', async () => {
      // Note: This test demonstrates how emergency access would work
      // Implementation would require additional logic in the guard

      // Arrange
      const user = { id: 'doctor-123', emergencyAccess: true };
      const permission = { resource: 'health-records', action: 'read' };
      const context = createMockExecutionContext(user, permission, false);
      mockAccessControlService.checkPermission.mockResolvedValue(true);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });
});
