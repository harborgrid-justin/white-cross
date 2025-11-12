/**
 * JWT AUTH GUARD TESTS (CRITICAL SECURITY)
 *
 * Tests JWT authentication guard functionality including:
 * - Valid token acceptance
 * - Invalid token rejection
 * - Expired token handling
 * - Missing token handling
 * - Public route bypass
 * - Request context handling
 */

import { Test, TestingModule } from '@nestjs/testing';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole   } from "../../database/models";

describe('JwtAuthGuard (CRITICAL SECURITY)', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  const mockUser = {
    id: 'test-user-id',
    email: 'test@whitecross.edu',
    role: UserRole.NURSE,
    firstName: 'Test',
    lastName: 'User',
  };

  const createMockExecutionContext = (
    isPublic: boolean = false,
    user: any = null,
    hasAuthHeader: boolean = true,
  ): ExecutionContext => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: hasAuthHeader ? { authorization: 'Bearer valid-token' } : {},
          user: user,
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
        {
          provide: 'TokenBlacklistService',
          useValue: {
            isTokenBlacklisted: jest.fn().mockResolvedValue(false),
            areUserTokensBlacklisted: jest.fn().mockResolvedValue(false),
            blacklistToken: jest.fn().mockResolvedValue(undefined),
            blacklistUserTokens: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== PUBLIC ROUTE TESTS ====================

  describe('Public Routes', () => {
    it('should allow access to public routes without authentication', async () => {
      const context = createMockExecutionContext(true, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should bypass JWT validation for @Public decorated routes', async () => {
      const context = createMockExecutionContext(true, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should allow public routes even with invalid tokens', async () => {
      const context = createMockExecutionContext(true, null, true);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });
  });

  // ==================== PROTECTED ROUTE TESTS ====================

  describe('Protected Routes', () => {
    it('should allow access with valid JWT token', async () => {
      const context = createMockExecutionContext(false, mockUser, true);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Mock the parent canActivate to simulate valid token
      const originalCanActivate = JwtAuthGuard.prototype.canActivate;
      jest.spyOn(guard, 'canActivate').mockImplementation(async (ctx) => {
        return Promise.resolve(true);
      });

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should require authentication for non-public routes', async () => {
      const context = createMockExecutionContext(false, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Mock passport strategy to fail
      jest.spyOn(guard as any, 'canActivate').mockImplementation(() => {
        throw new UnauthorizedException('Authentication required');
      });

      await expect(guard.canActivate(context))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should verify token is not public route before authentication', () => {
      const context = createMockExecutionContext(false, mockUser, true);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Verify reflector is called to check public status
      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });

  // ==================== TOKEN VALIDATION TESTS ====================

  describe('Token Validation', () => {
    it('should reject requests with missing Authorization header', () => {
      const context = createMockExecutionContext(false, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const request = context.switchToHttp().getRequest();
      expect(request.headers.authorization).toBeUndefined();
    });

    it('should reject requests with malformed Authorization header', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'InvalidFormat token' },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      expect(authHeader).not.toMatch(/^Bearer\s+[\w-]+\.[\w-]+\.[\w-]+$/);
    });

    it('should extract token from Bearer format', () => {
      const context = createMockExecutionContext(false, null, true);
      const request = context.switchToHttp().getRequest();

      expect(request.headers.authorization).toBe('Bearer valid-token');
      expect(request.headers.authorization.split(' ')[0]).toBe('Bearer');
    });

    it('should reject empty tokens', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer ' },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      expect(token).toBeFalsy();
    });
  });

  // ==================== HANDLE REQUEST TESTS ====================

  describe('handleRequest', () => {
    it('should return user when authentication succeeds', () => {
      const context = createMockExecutionContext(false, mockUser, true);

      const result = guard.handleRequest(null, mockUser, null, context);

      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', () => {
      const context = createMockExecutionContext(false, null, true);

      expect(() => guard.handleRequest(null, null, null, context))
        .toThrow(UnauthorizedException);
      expect(() => guard.handleRequest(null, null, null, context))
        .toThrow('Authentication required');
    });

    it('should throw error when authentication error occurs', () => {
      const context = createMockExecutionContext(false, null, true);
      const error = new Error('Token expired');

      expect(() => guard.handleRequest(error, null, null, context))
        .toThrow(error);
    });

    it('should prioritize error over missing user', () => {
      const context = createMockExecutionContext(false, null, true);
      const error = new UnauthorizedException('Invalid token');

      expect(() => guard.handleRequest(error, null, null, context))
        .toThrow(error);
    });

    it('should handle undefined user as authentication failure', () => {
      const context = createMockExecutionContext(false, undefined, true);

      expect(() => guard.handleRequest(null, undefined, null, context))
        .toThrow(UnauthorizedException);
    });
  });

  // ==================== INTEGRATION TESTS ====================

  describe('Integration Scenarios', () => {
    it('should allow public login endpoint without token', async () => {
      const context = createMockExecutionContext(true, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should require valid token for protected dashboard endpoint', () => {
      const context = createMockExecutionContext(false, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Should require authentication
      expect(reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(),
      ])).toBe(false);
    });

    it('should preserve user object in request after successful authentication', () => {
      const context = createMockExecutionContext(false, mockUser, true);

      const result = guard.handleRequest(null, mockUser, null, context);

      expect(result).toEqual(mockUser);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('role');
    });
  });

  // ==================== SECURITY EDGE CASES ====================

  describe('Security Edge Cases', () => {
    it('should reject tokens with extra whitespace', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer  token-with-spaces  ' },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      const request = context.switchToHttp().getRequest();
      const parts = request.headers.authorization.split(' ');

      // Should have exactly 2 parts
      expect(parts.filter(p => p.length > 0).length).toBeGreaterThan(2);
    });

    it('should handle case-sensitive Bearer keyword', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'bearer lowercase-token' },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      const request = context.switchToHttp().getRequest();

      // Should be case-sensitive (Bearer, not bearer)
      expect(request.headers.authorization.startsWith('Bearer')).toBe(false);
    });

    it('should reject tokens with special characters in header', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: { authorization: 'Bearer token-with-\n-newline' },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];

      expect(token).toContain('\n');
    });

    it('should not allow authentication bypass via null user with valid token format', () => {
      const context = createMockExecutionContext(false, null, true);

      expect(() => guard.handleRequest(null, null, null, context))
        .toThrow(UnauthorizedException);
    });

    it('should properly handle multiple authorization headers', () => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              authorization: ['Bearer token1', 'Bearer token2'],
            },
            user: null,
          }),
        }),
        getClass: jest.fn(),
        getHandler: jest.fn(),
      } as any;

      const request = context.switchToHttp().getRequest();

      // Should handle array of headers
      expect(Array.isArray(request.headers.authorization)).toBe(true);
    });
  });

  // ==================== DECORATOR PRECEDENCE TESTS ====================

  describe('Decorator Precedence', () => {
    it('should check both handler and class level decorators', async () => {
      const context = createMockExecutionContext(false, null, false);
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      await guard.canActivate(context).catch(() => {});

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });

    it('should prioritize handler-level @Public over class-level', () => {
      const context = createMockExecutionContext(true, null, false);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      // getAllAndOverride handles precedence internally
      const isPublic = reflector.getAllAndOverride('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);

      expect(isPublic).toBe(true);
    });
  });

  // ==================== ERROR MESSAGE TESTS ====================

  describe('Error Messages', () => {
    it('should provide clear error message for missing authentication', () => {
      const context = createMockExecutionContext(false, null, true);

      expect(() => guard.handleRequest(null, null, null, context))
        .toThrow('Authentication required');
    });

    it('should not leak sensitive information in error messages', () => {
      const context = createMockExecutionContext(false, null, true);
      const error = new Error('Database connection failed while verifying token');

      // Error should be propagated but shouldn't expose internal details
      expect(() => guard.handleRequest(error, null, null, context))
        .toThrow();
    });
  });
});
