/**
 * SecureTokenManager Tests
 * Comprehensive test suite for secure token management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SecureTokenManager, secureTokenManager } from '../SecureTokenManager';
import {
  createMockJWT,
  createExpiredJWT,
  wait,
  advanceTimersAndFlush,
  silenceConsole,
} from '@/__tests__/utils/testHelpers';

describe('SecureTokenManager', () => {
  let tokenManager: SecureTokenManager;
  let consoleSpies: ReturnType<typeof silenceConsole>;

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    localStorage.clear();
    tokenManager = SecureTokenManager.getInstance();
    consoleSpies = silenceConsole(['info', 'warn']);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    tokenManager.cleanup();
    consoleSpies.restore();
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = SecureTokenManager.getInstance();
      const instance2 = SecureTokenManager.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should return the exported singleton', () => {
      const instance = SecureTokenManager.getInstance();
      expect(instance).toBe(secureTokenManager);
    });
  });

  describe('Token Storage', () => {
    it('should store token in sessionStorage', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      expect(sessionStorage.getItem('secure_auth_token')).toBe(token);
    });

    it('should store refresh token when provided', () => {
      const token = createMockJWT();
      const refreshToken = 'refresh-token-123';

      tokenManager.setToken(token, refreshToken);

      expect(sessionStorage.getItem('secure_refresh_token')).toBe(refreshToken);
    });

    it('should store token metadata', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      expect(metadataStr).toBeTruthy();

      const metadata = JSON.parse(metadataStr!);
      expect(metadata).toHaveProperty('token', token);
      expect(metadata).toHaveProperty('issuedAt');
      expect(metadata).toHaveProperty('expiresAt');
      expect(metadata).toHaveProperty('lastActivity');
    });

    it('should throw error for invalid token', () => {
      expect(() => tokenManager.setToken('')).toThrow('Invalid token provided');
      expect(() => tokenManager.setToken(null as any)).toThrow('Invalid token provided');
      expect(() => tokenManager.setToken(123 as any)).toThrow('Invalid token provided');
    });

    it('should throw error for expired token', () => {
      const expiredToken = createExpiredJWT();

      expect(() => tokenManager.setToken(expiredToken)).toThrow('Cannot store expired token');
    });

    it('should use JWT expiration for token expiry', () => {
      const expiresIn = 7200; // 2 hours
      const token = createMockJWT({}, expiresIn);

      tokenManager.setToken(token);

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      const metadata = JSON.parse(metadataStr!);

      const expectedExpiration = Date.now() + (expiresIn * 1000);
      expect(metadata.expiresAt).toBeWithinTimeRange(expectedExpiration, 1000);
    });

    it('should use custom expiresIn when provided', () => {
      const token = createMockJWT();
      const customExpiry = 1800; // 30 minutes

      tokenManager.setToken(token, undefined, customExpiry);

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      const metadata = JSON.parse(metadataStr!);

      const expectedExpiration = Date.now() + (customExpiry * 1000);
      expect(metadata.expiresAt).toBeWithinTimeRange(expectedExpiration, 1000);
    });

    it('should update Zustand storage for backward compatibility', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      const zustandStr = localStorage.getItem('auth-storage');
      expect(zustandStr).toBeTruthy();

      const zustand = JSON.parse(zustandStr!);
      expect(zustand.state.token).toBe(token);
    });
  });

  describe('Token Retrieval', () => {
    it('should retrieve valid token', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      const retrieved = tokenManager.getToken();
      expect(retrieved).toBe(token);
    });

    it('should return null for non-existent token', () => {
      const retrieved = tokenManager.getToken();
      expect(retrieved).toBeNull();
    });

    it('should return null for expired token', () => {
      const token = createMockJWT({}, 1); // Expires in 1 second
      tokenManager.setToken(token);

      // Advance time past expiration
      vi.advanceTimersByTime(2000);

      const retrieved = tokenManager.getToken();
      expect(retrieved).toBeNull();
    });

    it('should update last activity on retrieval', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      const beforeActivity = Date.now();
      vi.advanceTimersByTime(5000);

      tokenManager.getToken();

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      const metadata = JSON.parse(metadataStr!);

      expect(metadata.lastActivity).toBeGreaterThan(beforeActivity);
    });

    it('should retrieve refresh token', () => {
      const token = createMockJWT();
      const refreshToken = 'refresh-token-123';

      tokenManager.setToken(token, refreshToken);

      const retrieved = tokenManager.getRefreshToken();
      expect(retrieved).toBe(refreshToken);
    });

    it('should return null when no refresh token exists', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      const retrieved = tokenManager.getRefreshToken();
      expect(retrieved).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should validate active token', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      expect(tokenManager.isTokenValid()).toBe(true);
    });

    it('should invalidate expired token', () => {
      const token = createMockJWT({}, 1); // Expires in 1 second
      tokenManager.setToken(token);

      vi.advanceTimersByTime(2000);

      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should invalidate token after inactivity timeout', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      // Advance time past 8-hour inactivity timeout
      vi.advanceTimersByTime(9 * 60 * 60 * 1000);

      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should return false for non-existent token', () => {
      expect(tokenManager.isTokenValid()).toBe(false);
    });

    it('should clear token when validation fails', () => {
      const token = createMockJWT({}, 1);
      tokenManager.setToken(token);

      vi.advanceTimersByTime(2000);

      tokenManager.getToken(); // This should clear the expired token

      expect(sessionStorage.getItem('secure_auth_token')).toBeNull();
      expect(sessionStorage.getItem('secure_token_metadata')).toBeNull();
    });
  });

  describe('Token Expiration', () => {
    it('should calculate time until expiration', () => {
      const expiresIn = 3600; // 1 hour
      const token = createMockJWT({}, expiresIn);
      tokenManager.setToken(token);

      const timeRemaining = tokenManager.getTimeUntilExpiration();
      expect(timeRemaining).toBeWithinTimeRange(expiresIn * 1000, 1000);
    });

    it('should return 0 for expired token', () => {
      const token = createMockJWT({}, 1);
      tokenManager.setToken(token);

      vi.advanceTimersByTime(2000);

      const timeRemaining = tokenManager.getTimeUntilExpiration();
      expect(timeRemaining).toBe(0);
    });

    it('should return 0 when no token exists', () => {
      const timeRemaining = tokenManager.getTimeUntilExpiration();
      expect(timeRemaining).toBe(0);
    });
  });

  describe('Activity Tracking', () => {
    it('should track time since last activity', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      vi.advanceTimersByTime(5000);

      const timeSinceActivity = tokenManager.getTimeSinceActivity();
      expect(timeSinceActivity).toBeGreaterThanOrEqual(5000);
    });

    it('should update activity timestamp', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      vi.advanceTimersByTime(5000);

      tokenManager.updateActivity();

      const timeSinceActivity = tokenManager.getTimeSinceActivity();
      expect(timeSinceActivity).toBeLessThan(100);
    });

    it('should return 0 when no token exists', () => {
      const timeSinceActivity = tokenManager.getTimeSinceActivity();
      expect(timeSinceActivity).toBe(0);
    });
  });

  describe('Token Clearing', () => {
    it('should clear all tokens and metadata', () => {
      const token = createMockJWT();
      const refreshToken = 'refresh-token-123';

      tokenManager.setToken(token, refreshToken);
      tokenManager.clearTokens();

      expect(sessionStorage.getItem('secure_auth_token')).toBeNull();
      expect(sessionStorage.getItem('secure_refresh_token')).toBeNull();
      expect(sessionStorage.getItem('secure_token_metadata')).toBeNull();
    });

    it('should clear Zustand storage', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      tokenManager.clearTokens();

      expect(localStorage.getItem('auth-storage')).toBeNull();
    });

    it('should clear legacy tokens', () => {
      localStorage.setItem('auth_token', 'legacy-token');
      localStorage.setItem('refresh_token', 'legacy-refresh');

      tokenManager.clearTokens();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('Migration from localStorage', () => {
    it('should migrate valid token from localStorage to sessionStorage', () => {
      const token = createMockJWT();
      localStorage.setItem('auth_token', token);

      // Create new instance to trigger migration
      const newManager = SecureTokenManager.getInstance();

      expect(sessionStorage.getItem('secure_auth_token')).toBe(token);
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should migrate refresh token', () => {
      const token = createMockJWT();
      const refreshToken = 'legacy-refresh-token';

      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      // Trigger migration
      SecureTokenManager.getInstance();

      expect(sessionStorage.getItem('secure_refresh_token')).toBe(refreshToken);
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });

    it('should remove expired legacy tokens without migrating', () => {
      const expiredToken = createExpiredJWT();
      localStorage.setItem('auth_token', expiredToken);

      SecureTokenManager.getInstance();

      expect(sessionStorage.getItem('secure_auth_token')).toBeNull();
      expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('should not migrate if sessionStorage already has token', () => {
      const sessionToken = createMockJWT({ name: 'session' });
      const localToken = createMockJWT({ name: 'local' });

      sessionStorage.setItem('secure_auth_token', sessionToken);
      localStorage.setItem('auth_token', localToken);

      SecureTokenManager.getInstance();

      // Session token should remain unchanged
      expect(sessionStorage.getItem('secure_auth_token')).toBe(sessionToken);
      // Local token should still be there (not migrated)
      expect(localStorage.getItem('auth_token')).toBe(localToken);
    });
  });

  describe('Automatic Cleanup', () => {
    it('should automatically clear expired tokens after interval', async () => {
      const token = createMockJWT({}, 30); // 30 seconds
      tokenManager.setToken(token);

      // Advance past expiration
      vi.advanceTimersByTime(35000);

      // Advance past cleanup interval (60 seconds)
      await advanceTimersAndFlush(30000);

      expect(sessionStorage.getItem('secure_auth_token')).toBeNull();
    });

    it('should stop cleanup interval on cleanup()', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      tokenManager.cleanup();

      // Verify interval is cleared
      expect(vi.getTimerCount()).toBe(0);
    });
  });

  describe('JWT Parsing', () => {
    it('should parse JWT expiration correctly', () => {
      const expiresIn = 3600;
      const token = createMockJWT({}, expiresIn);

      tokenManager.setToken(token);

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      const metadata = JSON.parse(metadataStr!);

      const expectedExpiration = Date.now() + (expiresIn * 1000);
      expect(metadata.expiresAt).toBeWithinTimeRange(expectedExpiration, 1000);
    });

    it('should handle malformed JWT gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Invalid JWT (not 3 parts)
      expect(() => tokenManager.setToken('invalid.jwt')).toThrow();

      consoleErrorSpy.mockRestore();
    });

    it('should default to 24 hours when JWT has no exp claim', () => {
      // Create JWT without exp claim
      const header = { alg: 'HS256', typ: 'JWT' };
      const payload = { sub: '123', name: 'Test' }; // No exp
      const signature = 'mock-sig';

      const token = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.${signature}`;

      tokenManager.setToken(token);

      const metadataStr = sessionStorage.getItem('secure_token_metadata');
      const metadata = JSON.parse(metadataStr!);

      const expectedExpiration = Date.now() + (24 * 60 * 60 * 1000);
      expect(metadata.expiresAt).toBeWithinTimeRange(expectedExpiration, 1000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle corrupted metadata gracefully', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      // Corrupt metadata
      sessionStorage.setItem('secure_token_metadata', 'invalid-json');

      const retrieved = tokenManager.getToken();
      expect(retrieved).toBeNull();
    });

    it('should handle missing metadata with token present', () => {
      const token = createMockJWT();
      sessionStorage.setItem('secure_auth_token', token);
      // No metadata

      const retrieved = tokenManager.getToken();
      expect(retrieved).toBeNull();
    });

    it('should handle storage errors gracefully', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Mock storage error
      const originalSetItem = sessionStorage.setItem;
      vi.spyOn(sessionStorage, 'setItem').mockImplementation(() => {
        throw new Error('Storage quota exceeded');
      });

      const token = createMockJWT();
      expect(() => tokenManager.setToken(token)).toThrow();

      sessionStorage.setItem = originalSetItem;
      consoleErrorSpy.mockRestore();
    });

    it('should handle concurrent setToken calls', () => {
      const token1 = createMockJWT({ name: 'user1' });
      const token2 = createMockJWT({ name: 'user2' });

      tokenManager.setToken(token1);
      tokenManager.setToken(token2);

      const retrieved = tokenManager.getToken();
      expect(retrieved).toBe(token2);
    });
  });

  describe('Security Considerations', () => {
    it('should use sessionStorage instead of localStorage', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      expect(sessionStorage.getItem('secure_auth_token')).toBeTruthy();
      expect(localStorage.getItem('secure_auth_token')).toBeNull();
    });

    it('should clear tokens on window unload', () => {
      const token = createMockJWT();
      tokenManager.setToken(token);

      // Simulate window unload
      window.dispatchEvent(new Event('beforeunload'));

      // Cleanup should have been called
      expect(vi.getTimerCount()).toBe(0);
    });

    it('should validate token on every retrieval', () => {
      const token = createMockJWT({}, 5); // 5 seconds
      tokenManager.setToken(token);

      // Token should be valid initially
      expect(tokenManager.getToken()).toBe(token);

      // Advance time past expiration
      vi.advanceTimersByTime(6000);

      // Token should be invalid now
      expect(tokenManager.getToken()).toBeNull();
    });
  });
});
