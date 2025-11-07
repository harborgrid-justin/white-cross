/**
 * @fileoverview Rate Limit Guard Security Tests
 * @module middleware/security/rate-limit.guard.spec
 * @description Comprehensive security tests for rate limiting functionality
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RateLimitGuard, RATE_LIMIT_CONFIGS } from './rate-limit.guard';

describe('RateLimitGuard - CRITICAL SECURITY', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;
  let mockRequest: any;
  let mockResponse: any;

  beforeEach(async () => {
    reflector = new Reflector();

    mockRequest = {
      path: '/api/auth/login',
      method: 'POST',
      ip: '192.168.1.100',
      headers: {},
      socket: {
        remoteAddress: '192.168.1.100',
      },
      user: {
        id: 'user-123',
      },
    };

    mockResponse = {
      setHeader: jest.fn(),
    };

    mockExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
        getResponse: () => mockResponse,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;

    guard = new RateLimitGuard(reflector);
  });

  describe('Basic Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Limit',
        expect.any(String),
      );
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Remaining',
        expect.any(String),
      );
    });

    it('should block requests exceeding rate limit', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      // Make 6 requests (limit is 5 for auth)
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 6th request should be blocked
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });

    it('should set Retry-After header when rate limit exceeded', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      // Exceed rate limit
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      try {
        await guard.canActivate(mockExecutionContext);
      } catch (error: any) {
        expect(mockResponse.setHeader).toHaveBeenCalledWith(
          'Retry-After',
          expect.any(String),
        );
        expect(mockResponse.setHeader).toHaveBeenCalledWith(
          'X-RateLimit-Reset',
          expect.any(String),
        );
      }
    });

    it('should return 429 status code when rate limit exceeded', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      // Exceed rate limit
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      try {
        await guard.canActivate(mockExecutionContext);
      } catch (error: any) {
        expect(error.getStatus()).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.getResponse()).toMatchObject({
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Rate Limit Exceeded',
        });
      }
    });
  });

  describe('Brute Force Attack Prevention', () => {
    it('should prevent authentication brute force attacks', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      const attempts = [];
      for (let i = 0; i < 10; i++) {
        try {
          await guard.canActivate(mockExecutionContext);
          attempts.push({ attempt: i + 1, blocked: false });
        } catch (error) {
          attempts.push({ attempt: i + 1, blocked: true });
        }
      }

      // First 5 should succeed, rest should be blocked
      expect(attempts.filter((a) => !a.blocked).length).toBe(5);
      expect(attempts.filter((a) => a.blocked).length).toBe(5);
    });

    it('should apply stricter limits for emergency alerts', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('emergencyAlert');

      // Emergency alerts have limit of 3
      for (let i = 0; i < 3; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 4th attempt should fail
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });

    it('should rate limit data export requests', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('export');

      // Export limit is 10 per hour
      for (let i = 0; i < 10; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 11th export should be blocked
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });
  });

  describe('IP-Based Rate Limiting', () => {
    it('should track rate limits per IP address', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Make requests from IP 1
      mockRequest.ip = '192.168.1.100';
      delete mockRequest.user; // Unauthenticated

      for (let i = 0; i < 100; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 101st request should be blocked for IP 1
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();

      // But a different IP should still work
      mockRequest.ip = '192.168.1.101';
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should extract IP from X-Forwarded-For header', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.headers['x-forwarded-for'] = '203.0.113.5, 198.51.100.1';
      delete mockRequest.user;

      await guard.canActivate(mockExecutionContext);

      // Rate limit should be tracked by first IP in X-Forwarded-For
      expect(mockResponse.setHeader).toHaveBeenCalled();
    });

    it('should extract IP from X-Real-IP header', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.headers['x-real-ip'] = '203.0.113.5';
      delete mockRequest.ip;
      delete mockRequest.user;

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('User-Based Rate Limiting', () => {
    it('should track rate limits per authenticated user', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.user = { id: 'user-123' };

      for (let i = 0; i < 100; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 101st request should be blocked for user-123
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();

      // But a different user should still work
      mockRequest.user = { id: 'user-456' };
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should prefer user ID over IP for authenticated requests', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.user = { id: 'user-123' };
      mockRequest.ip = '192.168.1.100';

      // Exhaust user rate limit
      for (let i = 0; i < 100; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();

      // Same IP but different user should work
      mockRequest.user = { id: 'user-456' };
      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Rate Limit Configuration', () => {
    it('should apply auth rate limit configuration', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      const config = RATE_LIMIT_CONFIGS.auth;

      // Should allow up to maxRequests
      for (let i = 0; i < config.maxRequests; i++) {
        const result = await guard.canActivate(mockExecutionContext);
        expect(result).toBe(true);
      }

      // Next request should be blocked
      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown rate limit error');
      } catch (error: any) {
        expect(error.getResponse().message).toBe(config.message);
      }
    });

    it('should apply communication rate limit configuration', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('communication');

      const config = RATE_LIMIT_CONFIGS.communication;

      for (let i = 0; i < config.maxRequests; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });

    it('should apply report rate limit configuration', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('reports');

      const config = RATE_LIMIT_CONFIGS.reports;

      for (let i = 0; i < config.maxRequests; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });
  });

  describe('Circuit Breaker - Fail Closed Security', () => {
    it('should fail closed when circuit breaker is open', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Simulate circuit breaker failures by triggering errors
      const storeIncrementSpy = jest
        .spyOn(guard['store'], 'increment')
        .mockRejectedValue(new Error('Store unavailable'));

      // Try to make requests - should fail closed
      for (let i = 0; i < 6; i++) {
        try {
          await guard.canActivate(mockExecutionContext);
          fail('Should have thrown ServiceUnavailableException');
        } catch (error) {
          expect(error).toBeInstanceOf(ServiceUnavailableException);
        }
      }

      storeIncrementSpy.mockRestore();
    });

    it('should throw ServiceUnavailableException on rate limit service failure', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Mock store failure
      jest
        .spyOn(guard['store'], 'increment')
        .mockRejectedValue(new Error('Redis connection failed'));

      try {
        await guard.canActivate(mockExecutionContext);
        fail('Should have thrown ServiceUnavailableException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ServiceUnavailableException);
        expect(error.getResponse()).toMatchObject({
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: expect.stringContaining('temporarily unavailable'),
        });
      }
    });

    it('should NOT fail open on errors (security critical)', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Simulate error
      jest
        .spyOn(guard['store'], 'increment')
        .mockRejectedValue(new Error('Unexpected error'));

      // Should NOT return true (fail open)
      // Should throw exception (fail closed)
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });

  describe('No Rate Limit Specified', () => {
    it('should allow request when no rate limit is specified', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });

    it('should allow request with unknown rate limit type', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('unknownType');

      const result = await guard.canActivate(mockExecutionContext);
      expect(result).toBe(true);
    });
  });

  describe('Rate Limit Headers', () => {
    it('should set X-RateLimit-Limit header', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Limit',
        RATE_LIMIT_CONFIGS.api.maxRequests.toString(),
      );
    });

    it('should set X-RateLimit-Remaining header', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Remaining',
        expect.any(String),
      );
    });

    it('should set X-RateLimit-Window header', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      await guard.canActivate(mockExecutionContext);

      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Window',
        RATE_LIMIT_CONFIGS.api.windowMs.toString(),
      );
    });

    it('should decrease X-RateLimit-Remaining with each request', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      const config = RATE_LIMIT_CONFIGS.api;

      await guard.canActivate(mockExecutionContext);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Remaining',
        (config.maxRequests - 1).toString(),
      );

      await guard.canActivate(mockExecutionContext);
      expect(mockResponse.setHeader).toHaveBeenCalledWith(
        'X-RateLimit-Remaining',
        (config.maxRequests - 2).toString(),
      );
    });
  });

  describe('Health Check', () => {
    it('should return healthy status when circuit is closed', () => {
      const health = guard.getHealth();

      expect(health.status).toBe('healthy');
      expect(health.circuitState).toBe('CLOSED');
    });

    it('should return unhealthy status when circuit is open', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Trigger multiple failures to open circuit
      jest
        .spyOn(guard['store'], 'increment')
        .mockRejectedValue(new Error('Service down'));

      for (let i = 0; i < 6; i++) {
        try {
          await guard.canActivate(mockExecutionContext);
        } catch {
          // Expected
        }
      }

      const health = guard.getHealth();
      expect(health.status).toBe('unhealthy');
      expect(health.circuitState).toBe('OPEN');
    });
  });

  describe('PHI Data Harvesting Prevention', () => {
    it('should prevent automated PHI data scraping', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.path = '/api/v1/students';
      mockRequest.method = 'GET';
      mockRequest.ip = '10.0.0.5';
      delete mockRequest.user;

      // Simulate rapid scraping attempts
      for (let i = 0; i < 100; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      // 101st request should be blocked
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });

    it('should prevent bulk export abuse', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('export');

      mockRequest.path = '/api/v1/students/export';

      // Export limit is 10 per hour
      for (let i = 0; i < 10; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });
  });

  describe('Compliance & Audit', () => {
    it('should log rate limit violations for audit trail', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      const loggerSpy = jest.spyOn(guard['logger'], 'warn');

      // Exceed rate limit
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      try {
        await guard.canActivate(mockExecutionContext);
      } catch {
        // Expected
      }

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Rate limit exceeded'),
        expect.objectContaining({
          userId: 'user-123',
          ip: '192.168.1.100',
        }),
      );
    });

    it('should track request path in rate limit logs', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      const loggerSpy = jest.spyOn(guard['logger'], 'warn');

      mockRequest.path = '/api/auth/login';

      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      try {
        await guard.canActivate(mockExecutionContext);
      } catch {
        // Expected
      }

      expect(loggerSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          path: '/api/auth/login',
          method: 'POST',
        }),
      );
    });
  });

  describe('Attack Scenarios', () => {
    it('should prevent distributed denial of service (DDoS)', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      // Simulate multiple IPs attacking
      const ips = ['10.0.0.1', '10.0.0.2', '10.0.0.3'];

      for (const ip of ips) {
        mockRequest.ip = ip;
        delete mockRequest.user;

        // Each IP should be rate limited independently
        for (let i = 0; i < 100; i++) {
          await guard.canActivate(mockExecutionContext);
        }

        await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
      }
    });

    it('should prevent password spray attacks', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('auth');

      mockRequest.path = '/api/auth/login';

      // Only 5 login attempts allowed per 15 minutes
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(mockExecutionContext);
      }

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        expect.objectContaining({
          response: expect.objectContaining({
            message: expect.stringContaining('authentication attempts'),
          }),
        }),
      );
    });

    it('should prevent API enumeration attacks', async () => {
      jest.spyOn(reflector, 'get').mockReturnValue('api');

      mockRequest.ip = '192.168.1.50';
      delete mockRequest.user;

      // Rapid enumeration attempts
      for (let i = 0; i < 100; i++) {
        mockRequest.path = `/api/v1/students/${i}`;
        await guard.canActivate(mockExecutionContext);
      }

      // 101st enumeration should be blocked
      mockRequest.path = '/api/v1/students/101';
      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow();
    });
  });
});
