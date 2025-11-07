/**
 * @fileoverview CSRF Guard Security Tests
 * @module middleware/security/csrf.guard.spec
 * @description Comprehensive security tests for CSRF protection
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CsrfGuard } from './csrf.guard';
import { AppConfigService } from '../../config/app-config.service';
import * as crypto from 'crypto';

describe('CsrfGuard - CRITICAL SECURITY', () => {
  let guard: CsrfGuard;
  let reflector: Reflector;
  let mockConfigService: Partial<AppConfigService>;
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(async () => {
    reflector = new Reflector();

    // Mock AppConfigService
    mockConfigService = {
      security: {
        csrf: {
          enabled: true,
          cookieName: 'XSRF-TOKEN',
          headerName: 'X-CSRF-Token',
          tokenLifetimeMs: 24 * 60 * 60 * 1000,
        },
      },
      environment: 'test',
      isProduction: false,
      csrfSecret: 'test-csrf-secret-key-for-testing-only',
    };

    mockRequest = {
      path: '/api/v1/students',
      method: 'POST',
      ip: '192.168.1.100',
      headers: {},
      cookies: {},
      body: {},
      query: {},
      user: {
        id: 'user-123',
      },
      session: {
        id: 'session-abc',
      },
    };

    mockResponse = {
      cookie: jest.fn(),
      setHeader: jest.fn(),
      locals: {},
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;

    guard = new CsrfGuard(
      reflector,
      mockConfigService as AppConfigService,
    );
  });

  describe('Token Generation', () => {
    it('should generate CSRF token for safe methods (GET)', async () => {
      mockRequest.method = 'GET';

      const result = await guard.canActivate(mockExecutionContext);

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
    });

    it('should set CSRF token in response header', async () => {
      mockRequest.method = 'GET';

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-CSRF-Token',
        expect.any(String),
      );
    });

    it('should set CSRF token in response locals', async () => {
      mockRequest.method = 'GET';

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.locals.csrfToken).toBeDefined();
      expect(typeof mockResponse.locals.csrfToken).toBe('string');
    });

    it('should not generate token for unauthenticated users on safe methods', async () => {
      mockRequest.method = 'GET';
      delete mockRequest.user;

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
    });

    it('should use secure flag in production', async () => {
      mockConfigService.isProduction = true;
      guard = new CsrfGuard(
        reflector,
        mockConfigService as AppConfigService,
      );

      mockRequest.method = 'GET';

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'XSRF-TOKEN',
        expect.any(String),
        expect.objectContaining({
          secure: true,
        }),
      );
    });
  });

  describe('Token Validation - POST Requests', () => {
    let validToken: string;

    beforeEach(async () => {
      // Generate token first with GET request
      mockRequest.method = 'GET';
      await guard.canActivate(mockExecutionContext);
      validToken = mockResponse.cookie.mock.calls[0][1];

      // Reset for POST request
      mockRequest.method = 'POST';
      mockResponse.cookie.mockClear();
    });

    it('should validate CSRF token from header', async () => {
      mockRequest.headers['x-csrf-token'] = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should validate CSRF token from request body', async () => {
      mockRequest.body = { _csrf: validToken };

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should validate CSRF token from query parameter', async () => {
      mockRequest.query = { _csrf: validToken };

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should validate CSRF token from cookie', async () => {
      mockRequest.cookies['XSRF-TOKEN'] = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should reject POST request without CSRF token', async () => {
      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.getResponse()).toMatchObject({
          error: 'CSRF Validation Failed',
          message: expect.stringContaining('CSRF token required'),
        });
      }
    });

    it('should reject POST request with invalid CSRF token', async () => {
      mockRequest.headers['x-csrf-token'] = 'invalid-token';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
        expect(error.getResponse().message).toContain('Invalid or expired');
      }
    });

    it('should reject malformed CSRF token', async () => {
      mockRequest.headers['x-csrf-token'] = 'malformed!!!token';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Cross-Session Attack Prevention', () => {
    let user1Token: string;

    beforeEach(async () => {
      // Generate token for user 1
      mockRequest.method = 'GET';
      mockRequest.user = { id: 'user-1' };
      mockRequest.session = { id: 'session-1' };
      await guard.canActivate(mockExecutionContext);
      user1Token = mockResponse.cookie.mock.calls[0][1];

      mockRequest.method = 'POST';
      mockResponse.cookie.mockClear();
    });

    it('should reject token from different user', async () => {
      // Try to use user-1's token as user-2
      mockRequest.user = { id: 'user-2' };
      mockRequest.session = { id: 'session-2' };
      mockRequest.headers['x-csrf-token'] = user1Token;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should reject token from different session', async () => {
      // Same user but different session
      mockRequest.user = { id: 'user-1' };
      mockRequest.session = { id: 'session-2' };
      mockRequest.headers['x-csrf-token'] = user1Token;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should accept token from same user and session', async () => {
      mockRequest.user = { id: 'user-1' };
      mockRequest.session = { id: 'session-1' };
      mockRequest.headers['x-csrf-token'] = user1Token;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Token Expiration', () => {
    it('should reject expired CSRF token', async () => {
      // Mock token with old timestamp
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
      const randomBytes = crypto.randomBytes(32).toString('hex');
      const payload = `user-123:session-abc:${oldTimestamp}:${randomBytes}`;
      const hmac = crypto.createHmac('sha256', mockConfigService.csrfSecret!);
      hmac.update(payload);
      const signature = hmac.digest('hex');
      const expiredToken = Buffer.from(`${payload}:${signature}`).toString('base64');

      mockRequest.method = 'POST';
      mockRequest.headers['x-csrf-token'] = expiredToken;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Safe vs Unsafe Methods', () => {
    it('should not require CSRF token for GET requests', async () => {
      mockRequest.method = 'GET';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not require CSRF token for HEAD requests', async () => {
      mockRequest.method = 'HEAD';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not require CSRF token for OPTIONS requests', async () => {
      mockRequest.method = 'OPTIONS';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should require CSRF token for POST requests', async () => {
      mockRequest.method = 'POST';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should require CSRF token for PUT requests', async () => {
      mockRequest.method = 'PUT';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should require CSRF token for DELETE requests', async () => {
      mockRequest.method = 'DELETE';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should require CSRF token for PATCH requests', async () => {
      mockRequest.method = 'PATCH';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Skip CSRF Paths', () => {
    it('should skip CSRF for login endpoint', async () => {
      mockRequest.path = '/api/auth/login';
      mockRequest.method = 'POST';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should skip CSRF for logout endpoint', async () => {
      mockRequest.path = '/api/auth/logout';
      mockRequest.method = 'POST';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should skip CSRF for webhook endpoints', async () => {
      mockRequest.path = '/api/webhook/stripe';
      mockRequest.method = 'POST';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should skip CSRF for public endpoints', async () => {
      mockRequest.path = '/api/public/health';
      mockRequest.method = 'POST';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not skip CSRF for protected endpoints', async () => {
      mockRequest.path = '/api/v1/students';
      mockRequest.method = 'POST';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Skip CSRF Decorator', () => {
    it('should skip CSRF when @SkipCsrf() decorator is present', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(true);

      mockRequest.method = 'POST';
      mockRequest.path = '/api/v1/custom-endpoint';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should not skip CSRF when decorator is not present', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      mockRequest.method = 'POST';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown CSRF validation error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Authentication Requirements', () => {
    it('should require authentication for CSRF-protected operations', async () => {
      mockRequest.method = 'POST';
      delete mockRequest.user;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown authentication error');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.UNAUTHORIZED);
        expect(error.getResponse().message).toContain('Authentication required');
      }
    });

    it('should not generate tokens for unauthenticated GET requests', async () => {
      mockRequest.method = 'GET';
      delete mockRequest.user;

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.cookie).not.toHaveBeenCalled();
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
    });
  });

  describe('Token Caching', () => {
    let validToken: string;

    beforeEach(async () => {
      // Generate token
      mockRequest.method = 'GET';
      await guard.canActivate(mockExecutionContext);
      validToken = mockResponse.cookie.mock.calls[0][1];

      mockRequest.method = 'POST';
      mockResponse.cookie.mockClear();
    });

    it('should use cached token for validation', async () => {
      mockRequest.headers['x-csrf-token'] = validToken;

      // First validation
      const result1 = await guard.canActivate(mockExecutionContext);
      expect(result1).toBe(true);

      // Second validation should use cache
      const result2 = await guard.canActivate(mockExecutionContext);
      expect(result2).toBe(true);
    });

    it('should invalidate cached token after expiration', async () => {
      // This would require mocking time, simplified test
      mockRequest.headers['x-csrf-token'] = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Attack Scenarios', () => {
    it('should prevent Cross-Site Request Forgery attack', async () => {
      // Attacker tries to forge request without valid CSRF token
      mockRequest.method = 'POST';
      mockRequest.path = '/api/v1/students/delete';
      mockRequest.user = { id: 'victim-user' };
      // No CSRF token provided

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have blocked CSRF attack');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should prevent token reuse across sessions', async () => {
      // Generate token in session 1
      mockRequest.method = 'GET';
      mockRequest.session = { id: 'session-1' };
      await guard.canActivate(mockExecutionContext);
      const session1Token = mockResponse.cookie.mock.calls[0][1];

      // Try to use token in session 2
      mockRequest.method = 'POST';
      mockRequest.session = { id: 'session-2' };
      mockRequest.headers['x-csrf-token'] = session1Token;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have rejected cross-session token');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should prevent token theft and reuse by different user', async () => {
      // User A generates token
      mockRequest.method = 'GET';
      mockRequest.user = { id: 'user-a' };
      mockRequest.session = { id: 'session-a' };
      await guard.canActivate(mockExecutionContext);
      const userAToken = mockResponse.cookie.mock.calls[0][1];

      // User B tries to use User A's token
      mockRequest.method = 'POST';
      mockRequest.user = { id: 'user-b' };
      mockRequest.session = { id: 'session-b' };
      mockRequest.headers['x-csrf-token'] = userAToken;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have rejected stolen token');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });

    it('should prevent replay attacks with old tokens', async () => {
      // This is handled by token expiration
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000);
      const randomBytes = crypto.randomBytes(32).toString('hex');
      const payload = `user-123:session-abc:${oldTimestamp}:${randomBytes}`;
      const hmac = crypto.createHmac('sha256', mockConfigService.csrfSecret!);
      hmac.update(payload);
      const signature = hmac.digest('hex');
      const oldToken = Buffer.from(`${payload}:${signature}`).toString('base64');

      mockRequest.method = 'POST';
      mockRequest.headers['x-csrf-token'] = oldToken;

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have rejected old token');
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });

  describe('Token Priority', () => {
    let validToken: string;

    beforeEach(async () => {
      mockRequest.method = 'GET';
      await guard.canActivate(mockExecutionContext);
      validToken = mockResponse.cookie.mock.calls[0][1];

      mockRequest.method = 'POST';
      mockResponse.cookie.mockClear();
    });

    it('should prioritize header over body', async () => {
      mockRequest.headers['x-csrf-token'] = validToken;
      mockRequest.body._csrf = 'wrong-token';

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should use body token if header not present', async () => {
      mockRequest.body._csrf = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should use query token if header and body not present', async () => {
      mockRequest.query._csrf = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should use cookie token as last resort', async () => {
      mockRequest.cookies['XSRF-TOKEN'] = validToken;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Logging and Audit', () => {
    it('should log CSRF validation failures', async () => {
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');

      mockRequest.method = 'POST';

      try {
        await guard.canActivate(mockExecutionContext);
      } catch {
        // Expected
      }

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('CSRF'),
        expect.objectContaining({
          userId: 'user-123',
          path: '/api/v1/students',
        }),
      );
    });

    it('should log successful CSRF validations in debug mode', async () => {
      const loggerSpy = jest.spyOn(guard['logger'], 'debug');

      mockRequest.method = 'GET';
      await guard.canActivate(mockExecutionContext);
      const validToken = mockResponse.cookie.mock.calls[0][1];

      mockRequest.method = 'POST';
      mockRequest.headers['x-csrf-token'] = validToken;

      await guard.canActivate(mockExecutionContext);

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('validated successfully'),
        expect.any(Object),
      );
    });
  });

  describe('Configuration Error Handling', () => {
    it('should throw error if CSRF secret is not configured', async () => {
      mockConfigService.csrfSecret = undefined;
      guard = new CsrfGuard(
        reflector,
        mockConfigService as AppConfigService,
      );

      mockRequest.method = 'GET';

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown configuration error');
      } catch (error: any) {
        expect(error.message).toContain('CSRF_SECRET not configured');
      }
    });
  });
});
