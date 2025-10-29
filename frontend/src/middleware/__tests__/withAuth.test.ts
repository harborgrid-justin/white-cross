/**
 * Unit tests for withAuth middleware
 * Tests authentication, authorization, and role-based access control
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withOptionalAuth, withRole, withMinimumRole } from '../withAuth';
import * as jwtVerifier from '@/lib/auth/jwtVerifier';

// Mock the JWT verifier module
jest.mock('@/lib/auth/jwtVerifier');

const mockExtractToken = jwtVerifier.extractToken as jest.MockedFunction<typeof jwtVerifier.extractToken>;
const mockVerifyToken = jwtVerifier.verifyToken as jest.MockedFunction<typeof jwtVerifier.verifyToken>;
const mockHasRolePermission = jwtVerifier.hasRolePermission as jest.MockedFunction<typeof jwtVerifier.hasRolePermission>;

describe('withAuth', () => {
  let mockRequest: NextRequest;
  let mockContext: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock request
    mockRequest = new NextRequest('http://localhost:3000/api/test', {
      method: 'GET',
      headers: {
        'authorization': 'Bearer valid-token'
      }
    });

    mockContext = { params: {} };
  });

  describe('withAuth', () => {
    it('should authenticate valid token and call handler', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'user-123',
        role: 'NURSE',
        email: 'nurse@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockExtractToken).toHaveBeenCalledWith(mockRequest);
      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token');
      expect(mockHandler).toHaveBeenCalledWith(
        mockRequest,
        mockContext,
        expect.objectContaining({
          user: mockPayload,
          token: 'valid-token'
        })
      );
      expect(response.status).toBe(200);
    });

    it('should return 401 when no token is provided', async () => {
      mockExtractToken.mockReturnValue(null);

      const mockHandler = jest.fn();
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json).toMatchObject({
        error: 'Unauthorized',
        code: 'AUTH_TOKEN_MISSING'
      });
    });

    it('should return 401 when token is invalid', async () => {
      mockExtractToken.mockReturnValue('invalid-token');
      mockVerifyToken.mockResolvedValue({
        valid: false,
        error: 'Invalid token signature'
      });

      const mockHandler = jest.fn();
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);

      const json = await response.json();
      expect(json).toMatchObject({
        error: 'Unauthorized',
        code: 'AUTH_TOKEN_INVALID'
      });
    });

    it('should return 401 when token is expired', async () => {
      mockExtractToken.mockReturnValue('expired-token');
      mockVerifyToken.mockResolvedValue({
        valid: false,
        error: 'Token expired'
      });

      const mockHandler = jest.fn();
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });

    it('should handle verification errors gracefully', async () => {
      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockRejectedValue(new Error('Verification service error'));

      const mockHandler = jest.fn();
      const wrappedHandler = withAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  describe('withOptionalAuth', () => {
    it('should provide auth context when token is valid', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'user-123',
        role: 'NURSE',
        email: 'nurse@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withOptionalAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(
        mockRequest,
        mockContext,
        expect.objectContaining({
          user: mockPayload,
          token: 'valid-token'
        })
      );
      expect(response.status).toBe(200);
    });

    it('should call handler with null auth when no token provided', async () => {
      mockExtractToken.mockReturnValue(null);

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ public: true })
      );

      const wrappedHandler = withOptionalAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(
        mockRequest,
        mockContext,
        null
      );
      expect(response.status).toBe(200);
    });

    it('should call handler with null auth when token is invalid', async () => {
      mockExtractToken.mockReturnValue('invalid-token');
      mockVerifyToken.mockResolvedValue({
        valid: false,
        error: 'Invalid token'
      });

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ public: true })
      );

      const wrappedHandler = withOptionalAuth(mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).toHaveBeenCalledWith(
        mockRequest,
        mockContext,
        null
      );
    });
  });

  describe('withRole', () => {
    it('should allow access when user has required role', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'admin-123',
        role: 'ADMIN',
        email: 'admin@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withRole('ADMIN', mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should allow access when user has one of multiple required roles', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'nurse-123',
        role: 'NURSE',
        email: 'nurse@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withRole(['ADMIN', 'NURSE', 'SCHOOL_ADMIN'], mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should deny access when user does not have required role', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'staff-123',
        role: 'STAFF',
        email: 'staff@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });

      const mockHandler = jest.fn();
      const wrappedHandler = withRole('ADMIN', mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);

      const json = await response.json();
      expect(json).toMatchObject({
        error: 'Forbidden',
        code: 'AUTH_INSUFFICIENT_ROLE'
      });
    });
  });

  describe('withMinimumRole', () => {
    it('should allow access when user meets minimum role requirement', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'admin-123',
        role: 'ADMIN',
        email: 'admin@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });
      mockHasRolePermission.mockReturnValue(true);

      const mockHandler = jest.fn().mockResolvedValue(
        NextResponse.json({ success: true })
      );

      const wrappedHandler = withMinimumRole('NURSE', mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHasRolePermission).toHaveBeenCalledWith('ADMIN', 'NURSE');
      expect(mockHandler).toHaveBeenCalled();
      expect(response.status).toBe(200);
    });

    it('should deny access when user does not meet minimum role', async () => {
      const mockPayload: jwtVerifier.JWTPayload = {
        userId: 'staff-123',
        role: 'STAFF',
        email: 'staff@example.com',
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      };

      mockExtractToken.mockReturnValue('valid-token');
      mockVerifyToken.mockResolvedValue({
        valid: true,
        payload: mockPayload
      });
      mockHasRolePermission.mockReturnValue(false);

      const mockHandler = jest.fn();
      const wrappedHandler = withMinimumRole('ADMIN', mockHandler);
      const response = await wrappedHandler(mockRequest, mockContext);

      expect(mockHasRolePermission).toHaveBeenCalledWith('STAFF', 'ADMIN');
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(403);

      const json = await response.json();
      expect(json).toMatchObject({
        error: 'Forbidden',
        code: 'AUTH_INSUFFICIENT_PERMISSIONS'
      });
    });
  });
});
