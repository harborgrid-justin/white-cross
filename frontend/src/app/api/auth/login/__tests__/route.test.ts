/**
 * Login API Route Tests
 * Tests for /api/auth/login endpoint
 * Priority: HIGH - Security risk, authentication vulnerabilities, brute force attacks
 */

import { POST } from '../route';
import { NextRequest } from 'next/server';
import { createTestUser } from '@tests/utils/test-factories';

// Mock dependencies
jest.mock('@/lib/apiProxy');
jest.mock('@/lib/audit');
jest.mock('@/lib/rateLimit', () => ({
  RATE_LIMITS: {
    AUTH: {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    },
  },
}));

import { proxyToBackend } from '@/lib/apiProxy';
import { auditLog, AUDIT_ACTIONS, createAuditContext } from '@/lib/audit';

const mockProxyToBackend = proxyToBackend as jest.MockedFunction<typeof proxyToBackend>;
const mockAuditLog = auditLog as jest.MockedFunction<typeof auditLog>;
const mockCreateAuditContext = createAuditContext as jest.MockedFunction<
  typeof createAuditContext
>;

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default audit context
    mockCreateAuditContext.mockReturnValue({
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    } as any);
  });

  describe('POST /api/auth/login', () => {
    const validCredentials = {
      email: 'nurse@school.edu',
      password: 'SecurePassword123!',
    };

    it('should authenticate user with valid credentials', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        },
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => mockResponse,
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.token).toBe('mock-jwt-token');
      expect(data.data.user.email).toBe(validCredentials.email);
    });

    it('should audit log successful login', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
          token: 'mock-jwt-token',
        },
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => mockResponse,
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      await POST(request);

      // Assert
      expect(mockAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          action: AUDIT_ACTIONS.LOGIN,
          resource: 'User',
          resourceId: user.id,
          success: true,
        })
      );
    });

    it('should reject invalid credentials', async () => {
      // Arrange
      const invalidCredentials = {
        email: 'nurse@school.edu',
        password: 'WrongPassword',
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Invalid credentials',
        }),
        status: 401,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Invalid credentials');
    });

    it('should audit log failed login attempt', async () => {
      // Arrange
      const invalidCredentials = {
        email: 'nurse@school.edu',
        password: 'WrongPassword',
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Invalid credentials',
        }),
        status: 401,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidCredentials),
      });

      // Act
      await POST(request);

      // Assert
      expect(mockAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AUDIT_ACTIONS.LOGIN_FAILED,
          resource: 'User',
          success: false,
          errorMessage: 'Invalid credentials',
        })
      );
    });

    it('should validate required fields', async () => {
      // Arrange
      const incompleteCredentials = {
        email: 'nurse@school.edu',
        // Missing password
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['password is required'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incompleteCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should validate email format', async () => {
      // Arrange
      const invalidEmailCredentials = {
        email: 'not-an-email',
        password: 'SecurePassword123!',
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['email must be a valid email address'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidEmailCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should handle backend connection errors', async () => {
      // Arrange
      mockProxyToBackend.mockRejectedValue(new Error('Backend unavailable'));

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Login failed');
      expect(data.message).toBe('An error occurred during login');
    });

    it('should audit log backend errors', async () => {
      // Arrange
      mockProxyToBackend.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      await POST(request);

      // Assert
      expect(mockAuditLog).toHaveBeenCalledWith(
        expect.objectContaining({
          action: AUDIT_ACTIONS.LOGIN_FAILED,
          resource: 'User',
          success: false,
          errorMessage: 'Database connection failed',
        })
      );
    });

    it('should not expose sensitive information in error messages', async () => {
      // Arrange
      mockProxyToBackend.mockRejectedValue(
        new Error('SQL Error: SELECT * FROM users WHERE email=nurse@school.edu AND password_hash=...')
      );

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      const data = await response.json();
      expect(data.message).toBe('An error occurred during login');
      expect(data.message).not.toContain('SQL');
      expect(data.message).not.toContain('password_hash');
    });

    it('should capture IP address in audit log', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: true,
          data: { user, token: 'mock-token' },
        }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': '192.168.1.100',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      await POST(request);

      // Assert
      const auditCall = mockAuditLog.mock.calls[0][0];
      expect(auditCall.ipAddress).toBeDefined();
      expect(auditCall.timestamp).toBeDefined();
    });

    it('should capture user agent in audit log', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: true,
          data: { user, token: 'mock-token' },
        }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Test Browser)',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      await POST(request);

      // Assert
      const auditCall = mockAuditLog.mock.calls[0][0];
      expect(auditCall.userAgent).toBeDefined();
    });

    it('should handle account locked scenarios', async () => {
      // Arrange
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Account locked',
          message: 'Too many failed login attempts. Account locked for 15 minutes.',
        }),
        status: 429,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(429);
      const data = await response.json();
      expect(data.error).toBe('Account locked');
    });

    it('should handle inactive user accounts', async () => {
      // Arrange
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Account inactive',
          message: 'Your account has been deactivated. Please contact administrator.',
        }),
        status: 403,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Account inactive');
    });

    it('should return token expiration information', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      const mockResponse = {
        success: true,
        data: {
          user,
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
          expiresIn: 3600, // 1 hour
          tokenType: 'Bearer',
        },
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => mockResponse,
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      const data = await response.json();
      expect(data.data.expiresIn).toBe(3600);
      expect(data.data.tokenType).toBe('Bearer');
    });

    it('should not return sensitive user data in response', async () => {
      // Arrange
      const user = createTestUser({ email: validCredentials.email });
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            // Should NOT include: passwordHash, ssn, etc.
          },
          token: 'mock-jwt-token',
        },
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => mockResponse,
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      const data = await response.json();
      expect(data.data.user.passwordHash).toBeUndefined();
      expect(data.data.user.password).toBeUndefined();
      expect(data.data.user.ssn).toBeUndefined();
    });

    it('should handle case-insensitive email matching', async () => {
      // Arrange
      const user = createTestUser({ email: 'nurse@school.edu' });
      const uppercaseEmailCredentials = {
        email: 'NURSE@SCHOOL.EDU',
        password: 'SecurePassword123!',
      };

      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: true,
          data: { user, token: 'mock-token' },
        }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uppercaseEmailCredentials),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
    });
  });
});
