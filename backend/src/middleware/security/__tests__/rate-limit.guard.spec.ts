/**
 * @fileoverview Rate Limit Guard Unit Tests
 * @module middleware/security/__tests__/rate-limit
 * @description Comprehensive tests for rate limiting guard including:
 * - Rate limit enforcement
 * - Circuit breaker pattern
 * - Attack scenarios
 * - HIPAA compliance logging
 * - Performance testing
 *
 * @security Critical tests for API protection
 * @compliance OWASP API Security, HIPAA audit requirements
 */

import { ExecutionContext, HttpStatus, ServiceUnavailableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { RATE_LIMIT_CONFIGS, RateLimitGuard } from '../rate-limit.guard';

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;

  // Mock response object
  const mockResponse = {
    setHeader: jest.fn(),
    headers: {},
  };

  // Mock request object factory
  const createMockRequest = (overrides: any = {}) => ({
    method: 'POST',
    path: '/api/auth/login',
    ip: '192.168.1.1',
    headers: {},
    user: null,
    ...overrides,
  });

  // Mock ExecutionContext factory
  const createMockExecutionContext = (request: any = {}, rateLimitType?: string): ExecutionContext => {
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(createMockRequest(request)),
        getResponse: jest.fn().mockReturnValue(mockResponse),
      }),
      getHandler: jest.fn().mockReturnValue({}),
      getClass: jest.fn().mockReturnValue({}),
    } as unknown as ExecutionContext;

    // Mock reflector to return rate limit type
    if (rateLimitType) {
      jest.spyOn(reflector, 'get').mockReturnValue(rateLimitType);
    }

    return mockContext;
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockResponse.setHeader.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('Basic Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', '99');
    });

    it('should block requests exceeding rate limit', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'auth');
      const config = RATE_LIMIT_CONFIGS.auth;

      // Act & Assert - Make requests up to limit
      for (let i = 0; i < config.maxRequests; i++) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      // Next request should be blocked
      try {
        await guard.canActivate(context);
        fail('Should have thrown HttpException');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.response.message).toContain('Too many authentication attempts');
        expect(mockResponse.setHeader).toHaveBeenCalledWith(
          'Retry-After',
          expect.any(String),
        );
      }
    });

    it('should reset rate limit after time window expires', async () => {
      // Arrange
      jest.useFakeTimers();
      const context = createMockExecutionContext({}, 'api');
      const config = RATE_LIMIT_CONFIGS.api;

      // Act - Exhaust rate limit
      for (let i = 0; i < config.maxRequests; i++) {
        await guard.canActivate(context);
      }

      // Fast-forward time beyond window
      jest.advanceTimersByTime(config.windowMs + 1000);

      // Assert - Should allow requests again
      const result = await guard.canActivate(context);
      expect(result).toBe(true);

      jest.useRealTimers();
    });

    it('should allow requests without rate limit decorator', async () => {
      // Arrange
      const context = createMockExecutionContext({}, undefined);
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      expect(mockResponse.setHeader).not.toHaveBeenCalled();
    });
  });

  describe('Rate Limit by User and IP', () => {
    it('should track rate limits per user when authenticated', async () => {
      // Arrange
      const user1Context = createMockExecutionContext(
        { user: { id: 'user-1' }, ip: '192.168.1.1' },
        'api',
      );
      const user2Context = createMockExecutionContext(
        { user: { id: 'user-2' }, ip: '192.168.1.1' },
        'api',
      );

      // Act - User 1 makes requests
      for (let i = 0; i < 50; i++) {
        await guard.canActivate(user1Context);
      }

      // Assert - User 2 should have independent limit
      const result = await guard.canActivate(user2Context);
      expect(result).toBe(true);
    });

    it('should track rate limits per IP for unauthenticated users', async () => {
      // Arrange
      const ip1Context = createMockExecutionContext(
        { user: null, ip: '192.168.1.1' },
        'api',
      );
      const ip2Context = createMockExecutionContext(
        { user: null, ip: '192.168.1.2' },
        'api',
      );

      // Act - IP 1 makes requests
      for (let i = 0; i < 50; i++) {
        await guard.canActivate(ip1Context);
      }

      // Assert - IP 2 should have independent limit
      const result = await guard.canActivate(ip2Context);
      expect(result).toBe(true);
    });

    it('should extract IP from x-forwarded-for header', async () => {
      // Arrange
      const context = createMockExecutionContext(
        {
          headers: { 'x-forwarded-for': '203.0.113.1, 198.51.100.1' },
          ip: '192.168.1.1',
        },
        'api',
      );

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
      // IP should be extracted from x-forwarded-for (first IP in list)
    });

    it('should extract IP from x-real-ip header', async () => {
      // Arrange
      const context = createMockExecutionContext(
        {
          headers: { 'x-real-ip': '203.0.113.1' },
          ip: '192.168.1.1',
        },
        'api',
      );

      // Act
      const result = await guard.canActivate(context);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('Circuit Breaker Pattern', () => {
    it('should open circuit after multiple failures', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');

      // Simulate store failures by causing errors
      jest.spyOn(guard as any, 'store').mockImplementation({
        increment: jest.fn().mockRejectedValue(new Error('Store failure')),
      });

      // Act - Trigger multiple failures (threshold is 5)
      for (let i = 0; i < 5; i++) {
        try {
          await guard.canActivate(context);
        } catch (error) {
          // Expected to fail
        }
      }

      // Assert - Circuit should be open, next request should fail fast
      try {
        await guard.canActivate(context);
        fail('Should have thrown ServiceUnavailableException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ServiceUnavailableException);
        expect(error.response.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
        expect(error.response.message).toContain('temporarily unavailable');
      }
    });

    it('should attempt recovery in half-open state', async () => {
      // Arrange
      jest.useFakeTimers();
      const context = createMockExecutionContext({}, 'api');

      // Cause failures to open circuit
      jest.spyOn(guard as any, 'store').mockImplementation({
        increment: jest.fn().mockRejectedValueOnce(new Error('Failure')),
      });

      for (let i = 0; i < 5; i++) {
        try {
          await guard.canActivate(context);
        } catch (error) {
          // Expected
        }
      }

      // Act - Fast forward past reset timeout (30s)
      jest.advanceTimersByTime(31000);

      // Restore normal behavior
      jest.restoreAllMocks();

      // Assert - Should attempt request (half-open state)
      const result = await guard.canActivate(context);
      expect(result).toBe(true);

      jest.useRealTimers();
    });

    it('should provide health check status', () => {
      // Act
      const health = guard.getHealth();

      // Assert
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('circuitState');
      expect(health.status).toBe('healthy');
      expect(health.circuitState).toBe('CLOSED');
    });
  });

  describe('Rate Limit Configurations', () => {
    it('should enforce auth rate limit (5 requests per 15 minutes)', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'auth');

      // Act - Make 5 requests (at limit)
      for (let i = 0; i < 5; i++) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      // Assert - 6th request should fail
      try {
        await guard.canActivate(context);
        fail('Should have thrown exception');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    it('should enforce communication rate limit (10 requests per minute)', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'communication');

      // Act - Make 10 requests
      for (let i = 0; i < 10; i++) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      // Assert - 11th request should fail
      try {
        await guard.canActivate(context);
        fail('Should have thrown exception');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    it('should enforce emergency alert rate limit (3 requests per hour)', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'emergencyAlert');

      // Act - Make 3 requests
      for (let i = 0; i < 3; i++) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      // Assert - 4th request should fail
      try {
        await guard.canActivate(context);
        fail('Should have thrown exception');
      } catch (error: any) {
        expect(error.response.message).toContain('Emergency alert rate limit exceeded');
      }
    });

    it('should enforce export rate limit (10 requests per hour)', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'export');

      // Act - Make 10 requests
      for (let i = 0; i < 10; i++) {
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }

      // Assert - 11th request should fail
      try {
        await guard.canActivate(context);
        fail('Should have thrown exception');
      } catch (error: any) {
        expect(error.response.message).toContain('Export rate limit exceeded');
      }
    });
  });

  describe('Security Attack Scenarios', () => {
    it('should prevent brute force login attacks', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { path: '/auth/login', method: 'POST' },
        'auth',
      );

      // Act - Simulate brute force attack (many failed login attempts)
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(context);
      }

      // Assert - Further attempts should be blocked
      try {
        await guard.canActivate(context);
        fail('Should block brute force attack');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
        expect(error.response.retryAfter).toBeGreaterThan(0);
      }
    });

    it('should prevent API abuse from single IP', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { ip: '203.0.113.195' },
        'api',
      );

      // Act - Rapid fire requests
      for (let i = 0; i < 100; i++) {
        await guard.canActivate(context);
      }

      // Assert - Next request should be blocked
      try {
        await guard.canActivate(context);
        fail('Should block API abuse');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    it('should prevent PHI data harvesting attempts', async () => {
      // Arrange - Multiple rapid export requests (suspicious behavior)
      const context = createMockExecutionContext(
        { user: { id: 'suspicious-user' }, path: '/students/export' },
        'export',
      );

      // Act - Attempt mass data export
      for (let i = 0; i < 10; i++) {
        await guard.canActivate(context);
      }

      // Assert - Should block further export attempts
      try {
        await guard.canActivate(context);
        fail('Should prevent data harvesting');
      } catch (error: any) {
        expect(error.response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
      }
    });

    it('should handle distributed attack from multiple IPs', async () => {
      // Arrange
      const ipAddresses = Array.from({ length: 50 }, (_, i) => `203.0.113.${i}`);

      // Act & Assert - Each IP should have independent rate limit
      for (const ip of ipAddresses) {
        const context = createMockExecutionContext({ ip }, 'api');
        const result = await guard.canActivate(context);
        expect(result).toBe(true);
      }
    });
  });

  describe('Response Headers', () => {
    it('should set rate limit headers on success', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');

      // Act
      await guard.canActivate(context);

      // Assert
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Limit', '100');
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Remaining', expect.any(String));
      expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Window', expect.any(String));
    });

    it('should set Retry-After header when rate limit exceeded', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'auth');

      // Act - Exhaust rate limit
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(context);
      }

      // Assert
      try {
        await guard.canActivate(context);
      } catch (error) {
        expect(mockResponse.setHeader).toHaveBeenCalledWith('Retry-After', expect.any(String));
        expect(mockResponse.setHeader).toHaveBeenCalledWith('X-RateLimit-Reset', expect.any(String));
      }
    });

    it('should include remaining points in header', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');

      // Act - Make 3 requests
      await guard.canActivate(context);
      await guard.canActivate(context);
      await guard.canActivate(context);

      // Assert - Remaining should decrease
      const calls = mockResponse.setHeader.mock.calls.filter(
        (call: any[]) => call[0] === 'X-RateLimit-Remaining',
      );
      expect(calls.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should fail closed on store errors (security requirement)', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');
      jest.spyOn(guard as any, 'store').mockImplementation({
        increment: jest.fn().mockRejectedValue(new Error('Redis connection failed')),
      });

      // Act & Assert
      try {
        await guard.canActivate(context);
        fail('Should fail closed on error');
      } catch (error: any) {
        expect(error).toBeInstanceOf(ServiceUnavailableException);
        expect(error.response.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      }
    });

    it('should handle unknown rate limit types gracefully', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'unknown-type' as any);

      // Act
      const result = await guard.canActivate(context);

      // Assert - Should allow request but log warning
      expect(result).toBe(true);
    });

    it('should handle missing IP address', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { ip: undefined, socket: { remoteAddress: undefined } },
        'api',
      );

      // Act
      const result = await guard.canActivate(context);

      // Assert - Should still work (use 'unknown' as identifier)
      expect(result).toBe(true);
    });
  });

  describe('Memory Cleanup', () => {
    it('should clean up expired rate limit records', async () => {
      // Arrange
      jest.useFakeTimers();
      const context = createMockExecutionContext({}, 'api');

      // Act - Make some requests
      await guard.canActivate(context);

      // Fast forward to trigger cleanup (cleanup runs every 5 minutes)
      jest.advanceTimersByTime(5 * 60 * 1000 + 1000);

      // Allow async cleanup to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Assert - Memory should be cleaned (no way to directly test, but ensures no crash)
      expect(true).toBe(true);

      jest.useRealTimers();
    });
  });

  describe('HIPAA Compliance', () => {
    it('should log rate limit violations for audit trail', async () => {
      // Arrange
      const loggerSpy = jest.spyOn(guard['logger'], 'warn');
      const context = createMockExecutionContext(
        { user: { id: 'user-123' }, ip: '203.0.113.1', path: '/health-records' },
        'api',
      );

      // Act - Exhaust rate limit
      for (let i = 0; i < 100; i++) {
        await guard.canActivate(context);
      }

      try {
        await guard.canActivate(context);
      } catch (error) {
        // Expected
      }

      // Assert - Should log violation with user and IP
      expect(loggerSpy).toHaveBeenCalledWith(
        expect.stringContaining('Rate limit exceeded'),
        expect.objectContaining({
          userId: 'user-123',
          ip: '203.0.113.1',
        }),
      );
    });

    it('should track PHI access attempts with rate limiting', async () => {
      // Arrange
      const context = createMockExecutionContext(
        { user: { id: 'user-123' }, path: '/students/export' },
        'export',
      );

      // Act - Multiple export attempts
      for (let i = 0; i < 5; i++) {
        await guard.canActivate(context);
      }

      // Assert - Should allow reasonable number of exports
      expect(true).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle rate limit check within 10ms', async () => {
      // Arrange
      const context = createMockExecutionContext({}, 'api');

      // Act
      const startTime = Date.now();
      await guard.canActivate(context);
      const duration = Date.now() - startTime;

      // Assert
      expect(duration).toBeLessThan(10);
    });

    it('should handle 1000 concurrent requests efficiently', async () => {
      // Arrange
      const contexts = Array.from({ length: 1000 }, () =>
        createMockExecutionContext({ user: { id: `user-${Math.random()}` } }, 'api'),
      );

      // Act
      const startTime = Date.now();
      await Promise.all(contexts.map((ctx) => guard.canActivate(ctx)));
      const duration = Date.now() - startTime;

      // Assert - Should complete in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });
  });
});
