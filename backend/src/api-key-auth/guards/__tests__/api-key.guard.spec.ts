/**
 * API KEY GUARD TESTS (HIGH PRIORITY SECURITY)
 *
 * Tests API key authentication guard functionality including:
 * - Valid API key acceptance
 * - Invalid API key rejection
 * - Missing API key handling
 * - IP restriction validation
 * - Public route bypass
 * - Request context handling
 * - Scope validation
 */

import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyGuard } from '../api-key.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyAuthService } from '../../api-key-auth.service';

describe('ApiKeyGuard (HIGH PRIORITY SECURITY)', () => {
  let guard: ApiKeyGuard;
  let apiKeyAuthService: ApiKeyAuthService;
  let reflector: Reflector;

  const mockApiKeyRecord = {
    id: 'api-key-1',
    name: 'Test API Key',
    keyPrefix: 'test_',
    scopes: ['read', 'write'],
    rateLimit: 1000,
    ipRestriction: null,
  };

  const mockApiKeyAuthService = {
    validateApiKey: jest.fn(),
  };

  const createMockExecutionContext = (
    apiKey: string | null = 'valid-api-key',
    isPublic: boolean = false,
    headers: Record<string, string> = {},
  ): ExecutionContext => {
    const requestHeaders = { ...headers };

    if (apiKey) {
      requestHeaders['x-api-key'] = apiKey;
    }

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: requestHeaders,
          ip: '192.168.1.1',
          path: '/api/test',
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as any;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyGuard,
        {
          provide: ApiKeyAuthService,
          useValue: mockApiKeyAuthService,
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<ApiKeyGuard>(ApiKeyGuard);
    apiKeyAuthService = module.get<ApiKeyAuthService>(ApiKeyAuthService);
    reflector = module.get<Reflector>(Reflector);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==================== PUBLIC ROUTE TESTS ====================

  describe('Public Routes', () => {
    it('should allow access to public routes without API key', async () => {
      const context = createMockExecutionContext(null, true);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyAuthService.validateApiKey).not.toHaveBeenCalled();
    });

    it('should bypass API key validation for @Public decorated routes', async () => {
      const context = createMockExecutionContext(null, true);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [
        context.getHandler(),
        context.getClass(),
      ]);
    });
  });

  // ==================== VALID API KEY TESTS ====================

  describe('Valid API Key', () => {
    it('should allow access with valid API key in X-API-Key header', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('valid-api-key');
    });

    it('should attach API key info to request object', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      const request = context.switchToHttp().getRequest();
      expect(request.apiKey).toBeDefined();
      expect(request.apiKey.id).toBe('api-key-1');
      expect(request.apiKey.scopes).toEqual(['read', 'write']);
    });

    it('should accept API key in Authorization header with ApiKey prefix', async () => {
      const context = createMockExecutionContext(null, false, {
        authorization: 'ApiKey valid-api-key',
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('valid-api-key');
    });
  });

  // ==================== INVALID API KEY TESTS ====================

  describe('Invalid API Key', () => {
    it('should reject invalid API key', async () => {
      const context = createMockExecutionContext('invalid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(
        new UnauthorizedException('Invalid API key'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('Invalid API key');
    });

    it('should reject expired API key', async () => {
      const context = createMockExecutionContext('expired-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(
        new UnauthorizedException('API key has expired'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow('API key has expired');
    });

    it('should reject revoked API key', async () => {
      const context = createMockExecutionContext('revoked-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(
        new UnauthorizedException('API key has been revoked'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow('API key has been revoked');
    });
  });

  // ==================== MISSING API KEY TESTS ====================

  describe('Missing API Key', () => {
    it('should reject requests without API key', async () => {
      const context = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow(
        'API key required. Provide X-API-Key header.',
      );
    });

    it('should not call validateApiKey when API key is missing', async () => {
      const context = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      expect(apiKeyAuthService.validateApiKey).not.toHaveBeenCalled();
    });

    it('should log warning when API key is missing', async () => {
      const context = createMockExecutionContext(null);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      // Mock logger to verify warning
      const loggerWarnSpy = jest.spyOn(guard['logger'], 'warn');

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);

      expect(loggerWarnSpy).toHaveBeenCalledWith('API key missing from request', {
        path: '/api/test',
        ip: '192.168.1.1',
      });
    });
  });

  // ==================== IP RESTRICTION TESTS ====================

  describe('IP Restriction', () => {
    it('should allow access when client IP matches restriction', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const apiKeyWithIP = {
        ...mockApiKeyRecord,
        ipRestriction: '192.168.1.1',
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(apiKeyWithIP);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should reject when client IP does not match restriction', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const apiKeyWithIP = {
        ...mockApiKeyRecord,
        ipRestriction: '10.0.0.1', // Different IP
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(apiKeyWithIP);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow(
        'API key not allowed from this IP address',
      );
    });

    it('should extract IP from X-Forwarded-For header', async () => {
      const context = createMockExecutionContext('valid-api-key', false, {
        'x-forwarded-for': '203.0.113.1, 198.51.100.1',
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const apiKeyWithIP = {
        ...mockApiKeyRecord,
        ipRestriction: '203.0.113.1',
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(apiKeyWithIP);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should extract IP from X-Real-IP header', async () => {
      const context = createMockExecutionContext('valid-api-key', false, {
        'x-real-ip': '203.0.113.2',
      });

      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const apiKeyWithIP = {
        ...mockApiKeyRecord,
        ipRestriction: '203.0.113.2',
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(apiKeyWithIP);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should log warning when IP restriction is violated', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const loggerWarnSpy = jest.spyOn(guard['logger'], 'warn');

      const apiKeyWithIP = {
        ...mockApiKeyRecord,
        ipRestriction: '10.0.0.1',
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(apiKeyWithIP);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);

      expect(loggerWarnSpy).toHaveBeenCalledWith('API key IP restriction violated', {
        keyPrefix: 'test_',
        clientIP: '192.168.1.1',
        allowedPattern: '10.0.0.1',
      });
    });
  });

  // ==================== HEADER EXTRACTION TESTS ====================

  describe('Header Extraction', () => {
    it('should extract API key from X-API-Key header', async () => {
      const context = createMockExecutionContext('test-key-123');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('test-key-123');
    });

    it('should extract API key from Authorization header with ApiKey prefix', async () => {
      const context = createMockExecutionContext(null, false, {
        authorization: 'ApiKey test-key-456',
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('test-key-456');
    });

    it('should prioritize X-API-Key header over Authorization header', async () => {
      const context = createMockExecutionContext('x-api-key-value', false, {
        authorization: 'ApiKey auth-header-value',
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('x-api-key-value');
    });

    it('should reject when Authorization header has incorrect format', async () => {
      const context = createMockExecutionContext(null, false, {
        authorization: 'Bearer invalid-format',
      });
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ==================== ERROR HANDLING TESTS ====================

  describe('Error Handling', () => {
    it('should handle service errors gracefully', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
      await expect(guard.canActivate(context)).rejects.toThrow('Invalid API key');
    });

    it('should log errors when validation fails', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const loggerErrorSpy = jest.spyOn(guard['logger'], 'error');
      const error = new Error('Unexpected error');

      mockApiKeyAuthService.validateApiKey.mockRejectedValue(error);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);

      expect(loggerErrorSpy).toHaveBeenCalledWith('Error validating API key', { error });
    });

    it('should preserve UnauthorizedException from service', async () => {
      const context = createMockExecutionContext('invalid-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const customError = new UnauthorizedException('Custom error message');
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(customError);

      await expect(guard.canActivate(context)).rejects.toThrow('Custom error message');
    });
  });

  // ==================== REQUEST CONTEXT TESTS ====================

  describe('Request Context', () => {
    it('should attach API key metadata to request', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      const request = context.switchToHttp().getRequest();

      expect(request.apiKey).toEqual({
        id: 'api-key-1',
        name: 'Test API Key',
        keyPrefix: 'test_',
        scopes: ['read', 'write'],
        rateLimit: 1000,
      });
    });

    it('should not expose sensitive key data in request context', async () => {
      const context = createMockExecutionContext('valid-api-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const sensitiveApiKey = {
        ...mockApiKeyRecord,
        hashedKey: 'should-not-be-exposed',
        secretKey: 'should-not-be-exposed',
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(sensitiveApiKey);

      await guard.canActivate(context);

      const request = context.switchToHttp().getRequest();

      expect(request.apiKey.hashedKey).toBeUndefined();
      expect(request.apiKey.secretKey).toBeUndefined();
    });
  });

  // ==================== EDGE CASES ====================

  describe('Edge Cases', () => {
    it('should handle empty API key gracefully', async () => {
      const context = createMockExecutionContext('');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle whitespace-only API key', async () => {
      const context = createMockExecutionContext('   ');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockRejectedValue(
        new UnauthorizedException('Invalid API key'),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle very long API keys', async () => {
      const longKey = 'a'.repeat(1000);
      const context = createMockExecutionContext(longKey);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith(longKey);
    });

    it('should handle API keys with special characters', async () => {
      const specialKey = 'key-with-!@#$%^&*()_+=';
      const context = createMockExecutionContext(specialKey);
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith(specialKey);
    });

    it('should handle case-sensitive API keys correctly', async () => {
      const context = createMockExecutionContext('Case-Sensitive-Key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      mockApiKeyAuthService.validateApiKey.mockResolvedValue(mockApiKeyRecord);

      await guard.canActivate(context);

      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('Case-Sensitive-Key');
    });
  });

  // ==================== HEALTHCARE-SPECIFIC SCENARIOS ====================

  describe('Healthcare API Integration', () => {
    it('should allow third-party health records integration with valid API key', async () => {
      const context = createMockExecutionContext('ehr-integration-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const ehrApiKey = {
        ...mockApiKeyRecord,
        name: 'EHR Integration',
        scopes: ['health_records:read', 'health_records:write'],
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(ehrApiKey);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(apiKeyAuthService.validateApiKey).toHaveBeenCalledWith('ehr-integration-key');
    });

    it('should allow SIS (Student Information System) integration', async () => {
      const context = createMockExecutionContext('sis-integration-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const sisApiKey = {
        ...mockApiKeyRecord,
        name: 'SIS Integration',
        scopes: ['students:read', 'students:sync'],
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(sisApiKey);

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should enforce IP restrictions for external integrations', async () => {
      const context = createMockExecutionContext('external-integration-key');
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const restrictedApiKey = {
        ...mockApiKeyRecord,
        ipRestriction: '203.0.113.0', // External system IP
      };

      mockApiKeyAuthService.validateApiKey.mockResolvedValue(restrictedApiKey);

      await expect(guard.canActivate(context)).rejects.toThrow(
        'API key not allowed from this IP address',
      );
    });
  });
});
