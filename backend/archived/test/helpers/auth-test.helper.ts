/**
 * Authentication Test Helper
 *
 * Utilities for testing authentication and authorization in NestJS.
 * Provides helpers for JWT tokens, authenticated requests, and user context.
 */

import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserRole } from '../../src/database/models/user.model';

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  districtId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequestOptions {
  token?: string;
  user?: any;
  headers?: Record<string, string>;
}

export class AuthTestHelper {
  /**
   * Generate a mock JWT token for testing
   *
   * @param payload - Token payload (user info)
   * @returns Mock JWT token string
   */
  static generateMockToken(payload: Partial<AuthTokenPayload> = {}): string {
    const defaultPayload: AuthTokenPayload = {
      sub: payload.sub || 'user-test-1',
      email: payload.email || 'test@whitecross.edu',
      role: payload.role || UserRole.NURSE,
      schoolId: payload.schoolId || 'school-test-1',
      districtId: payload.districtId || 'district-test-1',
      iat: payload.iat || Math.floor(Date.now() / 1000),
      exp: payload.exp || Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };

    // Create a mock JWT (not cryptographically valid, but sufficient for testing)
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64');
    const body = Buffer.from(JSON.stringify(defaultPayload)).toString('base64');
    const signature = 'mock-signature';

    return `${header}.${body}.${signature}`;
  }

  /**
   * Generate an admin user token
   */
  static generateAdminToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.ADMIN,
    });
  }

  /**
   * Generate a nurse user token
   */
  static generateNurseToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.NURSE,
    });
  }

  /**
   * Generate a counselor user token
   */
  static generateCounselorToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.COUNSELOR,
    });
  }

  /**
   * Generate a school admin user token
   */
  static generateSchoolAdminToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.SCHOOL_ADMIN,
    });
  }

  /**
   * Generate a district admin user token
   */
  static generateDistrictAdminToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.DISTRICT_ADMIN,
    });
  }

  /**
   * Generate a viewer user token
   */
  static generateViewerToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      role: UserRole.VIEWER,
    });
  }

  /**
   * Generate an expired token
   */
  static generateExpiredToken(overrides: Partial<AuthTokenPayload> = {}): string {
    return this.generateMockToken({
      ...overrides,
      iat: Math.floor(Date.now() / 1000) - 7200, // 2 hours ago
      exp: Math.floor(Date.now() / 1000) - 3600, // Expired 1 hour ago
    });
  }

  /**
   * Get authentication token from login endpoint (E2E tests)
   *
   * @param app - NestJS application instance
   * @param credentials - Login credentials
   * @returns Access token
   */
  static async getAuthToken(
    app: INestApplication,
    credentials: { email: string; password: string },
  ): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    return response.body.accessToken || response.body.access_token;
  }

  /**
   * Register a new user and get authentication token (E2E tests)
   *
   * @param app - NestJS application instance
   * @param userData - User registration data
   * @returns Access token and user data
   */
  static async registerAndLogin(
    app: INestApplication,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: UserRole;
    },
  ): Promise<{ token: string; user: any }> {
    // Register user
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData);

    if (registerResponse.status === 201) {
      // If registration returns token directly
      return {
        token: registerResponse.body.accessToken || registerResponse.body.access_token,
        user: registerResponse.body.user,
      };
    }

    // Otherwise login to get token
    const token = await this.getAuthToken(app, {
      email: userData.email,
      password: userData.password,
    });

    return { token, user: registerResponse.body };
  }

  /**
   * Create an authenticated request with Bearer token
   *
   * @param app - NestJS application instance
   * @param method - HTTP method
   * @param path - Request path
   * @param token - JWT token
   * @returns Supertest request
   */
  static createAuthenticatedRequest(
    app: INestApplication,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    path: string,
    token: string,
  ): request.Test {
    return request(app.getHttpServer())
      [method](path)
      .set('Authorization', `Bearer ${token}`);
  }

  /**
   * Create a GET request with authentication
   */
  static authenticatedGet(app: INestApplication, path: string, token: string): request.Test {
    return this.createAuthenticatedRequest(app, 'get', path, token);
  }

  /**
   * Create a POST request with authentication
   */
  static authenticatedPost(
    app: INestApplication,
    path: string,
    token: string,
    body?: any,
  ): request.Test {
    const req = this.createAuthenticatedRequest(app, 'post', path, token);
    return body ? req.send(body) : req;
  }

  /**
   * Create a PUT request with authentication
   */
  static authenticatedPut(
    app: INestApplication,
    path: string,
    token: string,
    body?: any,
  ): request.Test {
    const req = this.createAuthenticatedRequest(app, 'put', path, token);
    return body ? req.send(body) : req;
  }

  /**
   * Create a PATCH request with authentication
   */
  static authenticatedPatch(
    app: INestApplication,
    path: string,
    token: string,
    body?: any,
  ): request.Test {
    const req = this.createAuthenticatedRequest(app, 'patch', path, token);
    return body ? req.send(body) : req;
  }

  /**
   * Create a DELETE request with authentication
   */
  static authenticatedDelete(app: INestApplication, path: string, token: string): request.Test {
    return this.createAuthenticatedRequest(app, 'delete', path, token);
  }

  /**
   * Create a mock user object for testing
   */
  static createMockUser(overrides: any = {}): any {
    return {
      id: overrides.id || 'user-test-1',
      email: overrides.email || 'test@whitecross.edu',
      firstName: overrides.firstName || 'Test',
      lastName: overrides.lastName || 'User',
      role: overrides.role || UserRole.NURSE,
      isActive: overrides.isActive ?? true,
      schoolId: overrides.schoolId || 'school-test-1',
      districtId: overrides.districtId || 'district-test-1',
      createdAt: overrides.createdAt || new Date(),
      updatedAt: overrides.updatedAt || new Date(),
    };
  }

  /**
   * Create a mock execution context for guard testing
   */
  static createMockExecutionContext(
    user: any = null,
    headers: Record<string, string> = {},
  ): any {
    const token = this.generateMockToken();

    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
          headers: {
            authorization: `Bearer ${token}`,
            ...headers,
          },
        }),
        getResponse: () => ({}),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
  }

  /**
   * Create API key header for API key authentication
   */
  static createApiKeyHeader(apiKey: string): Record<string, string> {
    return {
      'x-api-key': apiKey,
    };
  }

  /**
   * Create basic auth header
   */
  static createBasicAuthHeader(username: string, password: string): Record<string, string> {
    const credentials = Buffer.from(`${username}:${password}`).toString('base64');
    return {
      authorization: `Basic ${credentials}`,
    };
  }

  /**
   * Decode a mock JWT token (for testing purposes)
   */
  static decodeMockToken(token: string): AuthTokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = Buffer.from(parts[1], 'base64').toString();
      return JSON.parse(payload);
    } catch {
      return null;
    }
  }

  /**
   * Check if a token is expired
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeMockToken(token);
    if (!payload || !payload.exp) return true;

    return payload.exp < Math.floor(Date.now() / 1000);
  }

  /**
   * Create headers for authenticated request with custom headers
   */
  static createAuthHeaders(
    token: string,
    additionalHeaders: Record<string, string> = {},
  ): Record<string, string> {
    return {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...additionalHeaders,
    };
  }

  /**
   * Mock JwtService for unit tests
   */
  static createMockJwtService() {
    return {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
      verify: jest.fn().mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        role: UserRole.NURSE,
      }),
      decode: jest.fn().mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        role: UserRole.NURSE,
      }),
    };
  }

  /**
   * Mock AuthService for unit tests
   */
  static createMockAuthService() {
    return {
      validateUser: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        role: UserRole.NURSE,
      }),
      login: jest.fn().mockResolvedValue({
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
      }),
      register: jest.fn().mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
      }),
      refreshToken: jest.fn().mockResolvedValue({
        accessToken: 'new-mock-token',
      }),
      logout: jest.fn().mockResolvedValue(undefined),
    };
  }

  /**
   * Mock TokenBlacklistService for unit tests
   */
  static createMockTokenBlacklistService() {
    return {
      isTokenBlacklisted: jest.fn().mockResolvedValue(false),
      areUserTokensBlacklisted: jest.fn().mockResolvedValue(false),
      blacklistToken: jest.fn().mockResolvedValue(undefined),
      blacklistUserTokens: jest.fn().mockResolvedValue(undefined),
    };
  }
}
