/**
 * @fileoverview CSRF Guard Unit Tests
 * @module middleware/security/__tests__/csrf
 * @description Comprehensive tests for CSRF protection guard including:
 * - Token generation and validation
 * - Safe vs unsafe method handling
 * - Session binding
 * - Attack prevention scenarios
 * - HIPAA audit logging
 *
 * @security Critical tests for CSRF attack prevention
 * @compliance OWASP A01:2021 - Broken Access Control
 */

import { ExecutionContext, HttpStatus, HttpException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { CsrfGuard } from '../csrf.guard';
import { AppConfigService } from '../../../config/app-config.service';

describe('CsrfGuard', () => {
  let guard: CsrfGuard;
  let reflector: Reflector;
  let configService: AppConfigService;

  // Mock config service
  const mockConfigService = {
    security: {
      csrf: {
        enabled: true,
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-CSRF-Token',
        tokenLifetimeMs: 24 * 60 * 60 * 1000,
      },
    },
    isProduction: false,
    environment: 'test',
    csrfSecret: 'test-csrf-secret-key-for-testing-only',
  };

  // Mock response object
  const mockResponse = {
    cookie: jest.fn(),
    setHeader: jest.fn(),
    locals: {},
  };

  // Mock request object factory
  const createMockRequest = (overrides: any = {}) => ({
    method: 'GET',
    path: '/api/data',
    ip: '192.168.1.1',
    headers: {},
    cookies: {},
    body: {},
    query: {},
    user: null,
    session: { id: 'session-123' },
    ...overrides,
  });

  // Mock ExecutionContext factory
  const createMockExecutionContext = (request: any = {}, skipCsrf = false): ExecutionContext => {
    const mockRequest = createMockRequest(request);
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    // Mock reflector for skipCsrf decorator
    jest.spyOn(reflector, 'get').mockReturnValue(skipCsrf);

    return mockContext;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponse.cookie.mockClear();
    mockResponse.setHeader.mockClear();
    mockResponse.locals = {};

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsrfGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AppConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<CsrfGuard>(CsrfGuard);
    reflector = module.get<Reflector>(Reflector);
    configService = module.get<AppConfigService>(AppConfigService);
  });

  describe('Safe Methods (GET, HEAD, OPTIONS)', () => {
    it('should generate CSRF token for authenticated GET request', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'XSRF-TOKEN',
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false, // test environment
          sameSite: 'strict',
        }),
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-CSRF-Token', expect.any(String));
    });

    it('should not generate token for unauthenticated GET request', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'GET',
        user: null,
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should allow HEAD requests', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'HEAD',
        user: { id: 'user-123' },
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should allow OPTIONS requests', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'OPTIONS',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should set secure cookie in production', async () => {
      // Arrange
      mockConfigService.isProduction = true;
      const context = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
      });

      // Act
      await guard.canActivate(context);

      // Assert
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'XSRF-TOKEN',
        expect.any(String),
        expect.objectContaining({
          secure: true,
        }),
      );

      // Cleanup
      mockConfigService.isProduction = false;
    });
  });

  describe('Unsafe Methods (POST, PUT, DELETE, PATCH)', () => {
    it('should validate CSRF token on POST request', async () => {
      // Arrange - First generate token
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);

      // Get generated token from cookie call
      const tokenCall = mockResponse.cookie.mock.calls[0];
      const csrfToken = tokenCall[1];

      // Now make POST request with token
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act
      const result = await guard.canActivate(postContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should reject POST request without CSRF token', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should have thrown HttpException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(error.response.message).toContain('CSRF token required');
      }
    });

    it('should reject POST request with invalid CSRF token', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        headers: { 'x-csrf-token': 'invalid-token' },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should have thrown HttpException');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(error.response.message).toContain('Invalid or expired');
      }
    });

    it('should validate CSRF token from request body', async () => {
      // Arrange - Generate token
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // POST with token in body
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        body: { _csrf: csrfToken },
      });

      // Act
      const result = await guard.canActivate(postContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should validate CSRF token from query parameter', async () => {
      // Arrange - Generate token
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // POST with token in query
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        query: { _csrf: csrfToken },
      });

      // Act
      const result = await guard.canActivate(postContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should validate CSRF token from cookie', async () => {
      // Arrange - Generate token
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // POST with token in cookie
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        cookies: { 'XSRF-TOKEN': csrfToken },
      });

      // Act
      const result = await guard.canActivate(postContext);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Token Validation', () => {
    it('should reject token with wrong user ID', async () => {
      // Arrange - Generate token for user-123
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // Try to use token as different user
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-999' }, // Different user
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(postContext);
        fail('Should reject token from different user');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should reject token with wrong session ID', async () => {
      // Arrange - Generate token for session-456
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // Try to use token in different session
      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-999' }, // Different session
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(postContext);
        fail('Should reject token from different session');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should reject expired token', async () => {
      // Arrange - Mock Date to make token expired
      jest.useFakeTimers();
      const now = Date.now();
      jest.setSystemTime(now);

      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // Advance time beyond token lifetime (24 hours + 1 ms)
      jest.advanceTimersByTime(24 * 60 * 60 * 1000 + 1000);

      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(postContext);
        fail('Should reject expired token');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(error.response.message).toContain('Invalid or expired');
      }

      jest.useRealTimers();
    });

    it('should reject token with invalid signature', async () => {
      // Arrange - Create malformed token
      const invalidToken = Buffer.from('user-123:session-456:' + Date.now() + ':random:wrong-signature')
        .toString('base64');

      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': invalidToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should reject token with invalid signature');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should reject malformed token', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        headers: { 'x-csrf-token': 'malformed-token' },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should reject malformed token');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Skip Paths and Decorators', () => {
    it('should skip CSRF for @SkipCsrf decorated routes', async () => {
      // Arrange
      const context = createMockExecutionContext(
        {
          method: 'POST',
          path: '/webhooks/stripe',
        },
        true, // skipCsrf = true
      );

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should skip CSRF for /api/auth/login', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        path: '/api/auth/login',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should skip CSRF for /api/auth/logout', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        path: '/api/auth/logout',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should skip CSRF for webhook paths', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        path: '/api/webhook/github',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });

    it('should skip CSRF for public API paths', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        path: '/api/public/status',
      });

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Authentication Requirements', () => {
    it('should require authentication for CSRF-protected operations', async () => {
      // Arrange - Unauthenticated POST request
      const context = createMockExecutionContext({
        method: 'POST',
        user: null, // Not authenticated
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should require authentication');
      } catch (error: any) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.response.message).toContain('Authentication required');
      }
    });

    it('should reject user without ID', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        user: { email: 'test@test.com' }, // User without ID
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should reject user without ID');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('Token Caching', () => {
    it('should cache valid tokens for performance', async () => {
      // Arrange - Generate token
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // Act - Use token multiple times
      for (let i = 0; i < 10; i++) {
        const postContext = createMockExecutionContext({
          method: 'POST',
          user: { id: 'user-123' },
          session: { id: 'session-456' },
          headers: { 'x-csrf-token': csrfToken },
        });
        const result = await guard.canActivate(postContext);
        expect(result).toBe(true);
      }

      // Assert - Should work consistently
      expect(true).toBe(true);
    });

    it('should invalidate cached token after expiration', async () => {
      // Arrange
      jest.useFakeTimers();
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      // Fast-forward time
      jest.advanceTimersByTime(25 * 60 * 60 * 1000); // 25 hours

      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(postContext);
        fail('Should reject expired cached token');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }

      jest.useRealTimers();
    });
  });

  describe('Security Attack Scenarios', () => {
    it('should prevent CSRF attack with stolen token from different session', async () => {
      // Arrange - Victim generates token
      const victimContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'victim-user' },
        session: { id: 'victim-session' },
      });
      await guard.canActivate(victimContext);
      const stolenToken = mockResponse.cookie.mock.calls[0][1];

      // Attacker tries to use stolen token in their session
      const attackerContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'victim-user' }, // Same user
        session: { id: 'attacker-session' }, // Different session
        headers: { 'x-csrf-token': stolenToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(attackerContext);
        fail('Should prevent CSRF with stolen token');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should prevent replay attack with old token', async () => {
      // Arrange - Generate and use token
      jest.useFakeTimers();
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const oldToken = mockResponse.cookie.mock.calls[0][1];

      // Use token successfully
      const postContext1 = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': oldToken },
      });
      await guard.canActivate(postContext1);

      // Fast forward time
      jest.advanceTimersByTime(25 * 60 * 60 * 1000);

      // Try replay attack
      const postContext2 = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': oldToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(postContext2);
        fail('Should prevent replay attack');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }

      jest.useRealTimers();
    });

    it('should prevent CSRF with manipulated token payload', async () => {
      // Arrange - Create token with manipulated data
      const manipulatedPayload = `user-999:session-456:${Date.now()}:random`;
      const manipulatedToken = Buffer.from(manipulatedPayload + ':fake-signature').toString('base64');

      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-999' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': manipulatedToken },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should prevent attack with manipulated token');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('HIPAA Compliance', () => {
    it('should log CSRF validation failures for audit trail', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');
      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        path: '/health-records/update',
        ip: '203.0.113.1',
      });

      // Act
      try {
        await guard.canActivate(context);
      } catch (error) {
        // Expected
      }

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('CSRF: Token missing'),
        expect.objectContaining({
          userId: 'user-123',
          path: '/health-records/update',
          ip: '203.0.113.1',
        }),
      );
    });

    it('should log successful CSRF validations', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'debug');
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act
      await guard.canActivate(postContext);

      // Assert
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Token validated successfully'),
        expect.objectContaining({
          userId: 'user-123',
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle missing CSRF secret gracefully', async () => {
      // Arrange
      const originalSecret = mockConfigService.csrfSecret;
      mockConfigService.csrfSecret = undefined;

      const context = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should throw error for missing secret');
      } catch (error: any) {
        expect(error.message).toContain('CSRF_SECRET not configured');
      }

      // Cleanup
      mockConfigService.csrfSecret = originalSecret;
    });

    it('should handle token validation errors gracefully', async () => {
      // Arrange
      const context = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        headers: { 'x-csrf-token': 'corrupt-base64-!@#$' },
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should handle corrupt token gracefully');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Performance', () => {
    it('should validate CSRF token within 5ms', async () => {
      // Arrange
      const getContext = createMockExecutionContext({
        method: 'GET',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
      });
      await guard.canActivate(getContext);
      const csrfToken = mockResponse.cookie.mock.calls[0][1];

      const postContext = createMockExecutionContext({
        method: 'POST',
        user: { id: 'user-123' },
        session: { id: 'session-456' },
        headers: { 'x-csrf-token': csrfToken },
      });

      // Act
      const startTime = Date.now();
      await guard.canActivate(postContext);
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(5);
    });
  });
});
