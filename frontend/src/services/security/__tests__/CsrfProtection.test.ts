/**
 * CsrfProtection Tests
 * Comprehensive test suite for CSRF token protection
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { CsrfProtection, csrfProtection, setupCsrfProtection } from '../CsrfProtection';
import {
  createMockAxiosConfig,
  createMockCsrfMetaTag,
  createMockCsrfCookie,
  silenceConsole,
} from '@/__tests__/utils/testHelpers';

describe('CsrfProtection', () => {
  let protection: CsrfProtection;
  let consoleSpies: ReturnType<typeof silenceConsole>;

  beforeEach(() => {
    vi.useFakeTimers();
    protection = CsrfProtection.getInstance();
    consoleSpies = silenceConsole(['info', 'warn', 'debug']);
  });

  afterEach(() => {
    vi.useRealTimers();
    protection.clearToken();
    consoleSpies.restore();

    // Clean up any meta tags or cookies
    document.head.querySelectorAll('meta[name="csrf-token"]').forEach(el => el.remove());
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = CsrfProtection.getInstance();
      const instance2 = CsrfProtection.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should return the exported singleton', () => {
      const instance = CsrfProtection.getInstance();
      expect(instance).toBe(csrfProtection);
    });
  });

  describe('Token Retrieval from Meta Tag', () => {
    it('should retrieve token from meta tag', () => {
      const token = 'meta-csrf-token-123';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);

      cleanup();
    });

    it('should refresh token from meta tag', () => {
      const token = 'csrf-token-456';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      expect(protection.getToken()).toBe(token);

      cleanup();
    });

    it('should handle missing meta tag', () => {
      protection.refreshToken();

      const token = protection.getToken();
      expect(token).toBeNull();
    });

    it('should handle empty meta tag content', () => {
      const cleanup = createMockCsrfMetaTag('');

      protection.refreshToken();

      const token = protection.getToken();
      expect(token).toBeNull();

      cleanup();
    });
  });

  describe('Token Retrieval from Cookie', () => {
    it('should retrieve token from XSRF-TOKEN cookie', () => {
      const token = 'cookie-csrf-token-123';
      const cleanup = createMockCsrfCookie(token, 'XSRF-TOKEN');

      protection.refreshToken();

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);

      cleanup();
    });

    it('should retrieve token from CSRF-TOKEN cookie', () => {
      const token = 'csrf-cookie-456';
      const cleanup = createMockCsrfCookie(token, 'CSRF-TOKEN');

      protection.refreshToken();

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);

      cleanup();
    });

    it('should decode URL-encoded cookie values', () => {
      const token = 'token with spaces';
      const cleanup = createMockCsrfCookie(token);

      protection.refreshToken();

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);

      cleanup();
    });

    it('should prefer meta tag over cookie', () => {
      const metaToken = 'meta-token';
      const cookieToken = 'cookie-token';

      const cleanupMeta = createMockCsrfMetaTag(metaToken);
      const cleanupCookie = createMockCsrfCookie(cookieToken);

      protection.refreshToken();

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(metaToken);

      cleanupMeta();
      cleanupCookie();
    });
  });

  describe('Token Caching', () => {
    it('should cache token for 1 hour', () => {
      const token = 'cached-token-123';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      // Remove meta tag
      cleanup();

      // Token should still be available from cache
      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);
    });

    it('should refresh expired token', () => {
      const oldToken = 'old-token';
      const cleanup1 = createMockCsrfMetaTag(oldToken);

      protection.refreshToken();
      cleanup1();

      // Advance time past 1 hour TTL
      vi.advanceTimersByTime(61 * 60 * 1000);

      const newToken = 'new-token';
      const cleanup2 = createMockCsrfMetaTag(newToken);

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(newToken);

      cleanup2();
    });

    it('should return cached token before expiration', () => {
      const token = 'cached-token';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();
      cleanup();

      // Advance time but not past expiration
      vi.advanceTimersByTime(30 * 60 * 1000); // 30 minutes

      const retrievedToken = protection.getToken();
      expect(retrievedToken).toBe(token);
    });
  });

  describe('Token Injection', () => {
    it('should inject token for POST requests', () => {
      const token = 'csrf-token-post';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'POST' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should inject token for PUT requests', () => {
      const token = 'csrf-token-put';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'PUT' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should inject token for PATCH requests', () => {
      const token = 'csrf-token-patch';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'PATCH' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should inject token for DELETE requests', () => {
      const token = 'csrf-token-delete';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'DELETE' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should NOT inject token for GET requests', () => {
      const token = 'csrf-token-get';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'GET' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBeUndefined();

      cleanup();
    });

    it('should NOT inject token for HEAD requests', () => {
      const token = 'csrf-token-head';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'HEAD' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBeUndefined();

      cleanup();
    });

    it('should NOT inject token for OPTIONS requests', () => {
      const token = 'csrf-token-options';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'OPTIONS' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBeUndefined();

      cleanup();
    });

    it('should handle case-insensitive method names', () => {
      const token = 'csrf-token-lowercase';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'post' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should initialize headers if not present', () => {
      const token = 'csrf-token-init';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config = { method: 'POST', url: '/api/test' } as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers).toBeDefined();
      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should not inject token when none is available', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config = createMockAxiosConfig({ method: 'POST' }) as InternalAxiosRequestConfig;
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBeUndefined();
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });
  });

  describe('Axios Interceptor Setup', () => {
    it('should setup interceptor on axios instance', () => {
      const mockAxios = {
        interceptors: {
          request: {
            use: vi.fn().mockReturnValue(1),
          },
        },
      } as unknown as AxiosInstance;

      const interceptorId = protection.setupInterceptor(mockAxios);

      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
      expect(interceptorId).toBe(1);
    });

    it('should inject token via interceptor', () => {
      const token = 'interceptor-token';
      const cleanup = createMockCsrfMetaTag(token);

      let requestInterceptor: any;
      const mockAxios = {
        interceptors: {
          request: {
            use: vi.fn((success, error) => {
              requestInterceptor = success;
              return 1;
            }),
          },
        },
      } as unknown as AxiosInstance;

      protection.setupInterceptor(mockAxios);
      protection.refreshToken();

      const config = createMockAxiosConfig({ method: 'POST' }) as InternalAxiosRequestConfig;
      const modifiedConfig = requestInterceptor(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should use setupCsrfProtection helper', () => {
      const mockAxios = {
        interceptors: {
          request: {
            use: vi.fn().mockReturnValue(2),
          },
        },
      } as unknown as AxiosInstance;

      const interceptorId = setupCsrfProtection(mockAxios);

      expect(mockAxios.interceptors.request.use).toHaveBeenCalled();
      expect(interceptorId).toBe(2);
    });
  });

  describe('Token Clearing', () => {
    it('should clear cached token', () => {
      const token = 'clear-test-token';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();
      expect(protection.getToken()).toBe(token);

      protection.clearToken();
      cleanup();

      expect(protection.getToken()).toBeNull();
    });

    it('should require refresh after clearing', () => {
      const token = 'refresh-after-clear';
      const cleanup1 = createMockCsrfMetaTag(token);

      protection.refreshToken();
      protection.clearToken();

      cleanup1();

      const newToken = 'new-csrf-token';
      const cleanup2 = createMockCsrfMetaTag(newToken);

      protection.refreshToken();

      expect(protection.getToken()).toBe(newToken);

      cleanup2();
    });
  });

  describe('Token Info', () => {
    it('should return token info when token exists', () => {
      const token = 'info-token';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const info = protection.getTokenInfo();
      expect(info).toMatchObject({
        hasToken: true,
      });
      expect(info?.expiresAt).toBeDefined();
      expect(info?.age).toBeDefined();

      cleanup();
    });

    it('should return hasToken: false when no token', () => {
      protection.clearToken();

      const info = protection.getTokenInfo();
      expect(info).toEqual({ hasToken: false });
    });

    it('should track token age', () => {
      const token = 'age-token';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      vi.advanceTimersByTime(5000);

      const info = protection.getTokenInfo();
      expect(info?.age).toBeGreaterThanOrEqual(5000);

      cleanup();
    });

    it('should show correct expiration time', () => {
      const token = 'expiry-token';
      const cleanup = createMockCsrfMetaTag(token);

      const now = Date.now();
      protection.refreshToken();

      const info = protection.getTokenInfo();
      const expectedExpiration = now + (60 * 60 * 1000); // 1 hour

      expect(info?.expiresAt).toBeWithinTimeRange(expectedExpiration, 1000);

      cleanup();
    });
  });

  describe('Error Handling', () => {
    it('should handle document query errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock querySelector to throw error
      const originalQuerySelector = document.querySelector;
      document.querySelector = vi.fn(() => {
        throw new Error('DOM error');
      });

      protection.refreshToken();

      const token = protection.getToken();
      expect(token).toBeNull();

      document.querySelector = originalQuerySelector;
      consoleWarnSpy.mockRestore();
    });

    it('should handle cookie parsing errors gracefully', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Mock cookie to throw error
      Object.defineProperty(document, 'cookie', {
        get: () => {
          throw new Error('Cookie error');
        },
      });

      protection.refreshToken();

      const token = protection.getToken();
      expect(token).toBeNull();

      consoleWarnSpy.mockRestore();
    });

    it('should handle injection errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const config = {
        method: 'POST',
        get headers() {
          throw new Error('Headers error');
        },
      } as any;

      const result = protection.injectCsrfToken(config);

      expect(result).toBe(config);
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should handle getToken errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Force an error in token retrieval
      const token = 'error-token';
      const cleanup = createMockCsrfMetaTag(token);
      protection.refreshToken();

      // Corrupt the cache to force error
      (protection as any).tokenCache = { invalid: 'cache' };

      const result = protection.getToken();
      expect(result).toBeNull();

      cleanup();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle full request lifecycle', () => {
      const token = 'lifecycle-token';
      const cleanup = createMockCsrfMetaTag(token);

      // Setup
      protection.refreshToken();

      // Create request
      const config = createMockAxiosConfig({ method: 'POST' }) as InternalAxiosRequestConfig;

      // Inject token
      const modifiedConfig = protection.injectCsrfToken(config);

      expect(modifiedConfig.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });

    it('should handle authentication change (token rotation)', () => {
      const oldToken = 'old-csrf';
      const cleanup1 = createMockCsrfMetaTag(oldToken);

      protection.refreshToken();
      expect(protection.getToken()).toBe(oldToken);

      cleanup1();

      // Simulate token rotation
      protection.clearToken();

      const newToken = 'new-csrf';
      const cleanup2 = createMockCsrfMetaTag(newToken);

      protection.refreshToken();
      expect(protection.getToken()).toBe(newToken);

      cleanup2();
    });

    it('should handle concurrent requests with same token', () => {
      const token = 'concurrent-token';
      const cleanup = createMockCsrfMetaTag(token);

      protection.refreshToken();

      const config1 = createMockAxiosConfig({ method: 'POST', url: '/api/1' }) as InternalAxiosRequestConfig;
      const config2 = createMockAxiosConfig({ method: 'PUT', url: '/api/2' }) as InternalAxiosRequestConfig;

      const modified1 = protection.injectCsrfToken(config1);
      const modified2 = protection.injectCsrfToken(config2);

      expect(modified1.headers['X-CSRF-Token']).toBe(token);
      expect(modified2.headers['X-CSRF-Token']).toBe(token);

      cleanup();
    });
  });
});
