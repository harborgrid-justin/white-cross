/**
 * Authentication API Tests
 * Tests login, logout, token refresh, and token expiration handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse, delay } from 'msw';
import { server } from '@/test/mocks/server';
import { AuthApi } from '../authApi';
import { ApiClient } from '@/services/core/ApiClient';
import { tokenUtils } from '@/services/config/apiConfig';

describe('AuthApi', () => {
  let authApi: AuthApi;
  let apiClient: ApiClient;

  beforeEach(() => {
    // Server is already started in global setup
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 5000,
      enableLogging: false,
      enableRetry: false,
    });
    authApi = new AuthApi(apiClient);

    // Clear tokens before each test
    tokenUtils.clearAll();
  });

  afterEach(() => {
    // Handlers are reset in global teardown
    tokenUtils.clearAll();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'nurse@school.edu',
        password: 'SecurePass123!@',
        rememberMe: true,
      };

      const mockResponse = {
        success: true,
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9.test',
          user: {
            id: '123',
            email: 'nurse@school.edu',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'NURSE',
          },
        },
      };

      server.use(
        http.post('http://localhost:3000/api/auth/login', async () => {
          return HttpResponse.json(mockResponse);
        })
      );

      // Act
      const result = await authApi.login(credentials);

      // Assert
      expect(result).toBeDefined();
      expect(result.user).toEqual(mockResponse.data.user);
      expect(result.token).toBe(mockResponse.data.token);
      expect(tokenUtils.getToken()).toBe(mockResponse.data.token);
      expect(tokenUtils.getRefreshToken()).toBe(mockResponse.data.token);
    });

    it('should fail login with invalid password (less than 12 chars)', async () => {
      // Arrange
      const credentials = {
        email: 'nurse@school.edu',
        password: 'short', // Too short
        rememberMe: false,
      };

      // Act & Assert
      await expect(authApi.login(credentials)).rejects.toThrow(/at least 12 characters/i);
    });

    it('should fail login with invalid email format', async () => {
      // Arrange
      const credentials = {
        email: 'invalid-email',
        password: 'SecurePass123!@',
        rememberMe: false,
      };

      // Act & Assert
      await expect(authApi.login(credentials)).rejects.toThrow(/invalid email/i);
    });

    it('should handle server error on login', async () => {
      // Arrange
      const credentials = {
        email: 'nurse@school.edu',
        password: 'SecurePass123!@',
        rememberMe: false,
      };

      server.use(
        http.post('http://localhost:3000/api/auth/login', async () => {
          return HttpResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
          );
        })
      );

      // Act & Assert
      await expect(authApi.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should successfully logout and clear tokens', async () => {
      // Arrange
      tokenUtils.setToken('test-token');
      tokenUtils.setRefreshToken('test-refresh-token');

      server.use(
        http.post('http://localhost:3000/api/auth/logout', async () => {
          return HttpResponse.json({ success: true });
        })
      );

      // Act
      await authApi.logout();

      // Assert
      expect(tokenUtils.getToken()).toBeNull();
      expect(tokenUtils.getRefreshToken()).toBeNull();
    });

    it('should clear tokens even if server request fails', async () => {
      // Arrange
      tokenUtils.setToken('test-token');
      tokenUtils.setRefreshToken('test-refresh-token');

      server.use(
        http.post('http://localhost:3000/api/auth/logout', async () => {
          return HttpResponse.json({ error: 'Server error' }, { status: 500 });
        })
      );

      // Act
      await authApi.logout();

      // Assert - tokens should still be cleared locally
      expect(tokenUtils.getToken()).toBeNull();
      expect(tokenUtils.getRefreshToken()).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh access token', async () => {
      // Arrange
      const oldToken = 'old-token';
      const newToken = 'new-token';
      const newRefreshToken = 'new-refresh-token';

      tokenUtils.setToken(oldToken);
      tokenUtils.setRefreshToken('old-refresh-token');

      server.use(
        http.post('http://localhost:3000/api/auth/refresh', async () => {
          return HttpResponse.json({
            token: newToken,
            refreshToken: newRefreshToken,
            expiresIn: 3600,
          });
        })
      );

      // Act
      const result = await authApi.refreshToken();

      // Assert
      expect(result.token).toBe(newToken);
      expect(result.refreshToken).toBe(newRefreshToken);
      expect(tokenUtils.getToken()).toBe(newToken);
      expect(tokenUtils.getRefreshToken()).toBe(newRefreshToken);
    });

    it('should throw error when no refresh token available', async () => {
      // Arrange - no refresh token
      tokenUtils.clearAll();

      // Act & Assert
      await expect(authApi.refreshToken()).rejects.toThrow(/no refresh token/i);
    });

    it('should clear all tokens on refresh failure', async () => {
      // Arrange
      tokenUtils.setToken('test-token');
      tokenUtils.setRefreshToken('test-refresh-token');

      server.use(
        http.post('http://localhost:3000/api/auth/refresh', async () => {
          return HttpResponse.json({ error: 'Invalid token' }, { status: 401 });
        })
      );

      // Act & Assert
      await expect(authApi.refreshToken()).rejects.toThrow();
      expect(tokenUtils.getToken()).toBeNull();
      expect(tokenUtils.getRefreshToken()).toBeNull();
    });
  });

  describe('token expiration', () => {
    it('should detect expired token', () => {
      // Arrange - create expired token (exp in the past)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjEwMDAwMDB9.test';
      tokenUtils.setToken(expiredToken);

      // Act
      const isExpired = authApi.isTokenExpired();

      // Assert
      expect(isExpired).toBe(true);
    });

    it('should detect valid token', () => {
      // Arrange - create token that expires in far future
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJleHAiOjk5OTk5OTk5OTl9.test';
      tokenUtils.setToken(validToken);

      // Act
      const isExpired = authApi.isTokenExpired();

      // Assert
      expect(isExpired).toBe(false);
    });

    it('should return true for missing token', () => {
      // Arrange - no token
      tokenUtils.clearAll();

      // Act
      const isExpired = authApi.isTokenExpired();

      // Assert
      expect(isExpired).toBe(true);
    });
  });

  describe('authentication state', () => {
    it('should detect authenticated user', () => {
      // Arrange
      tokenUtils.setToken('valid-token');

      // Act
      const isAuthenticated = authApi.isAuthenticated();

      // Assert
      expect(isAuthenticated).toBe(true);
    });

    it('should detect unauthenticated user', () => {
      // Arrange
      tokenUtils.clearAll();

      // Act
      const isAuthenticated = authApi.isAuthenticated();

      // Assert
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user profile', async () => {
      // Arrange
      const mockUser = {
        id: '123',
        email: 'nurse@school.edu',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'NURSE',
      };

      server.use(
        http.get('http://localhost:3000/api/auth/profile', async () => {
          return HttpResponse.json({
            success: true,
            data: mockUser,
          });
        })
      );

      // Act
      const user = await authApi.getCurrentUser();

      // Assert
      expect(user).toEqual(mockUser);
    });
  });
});
