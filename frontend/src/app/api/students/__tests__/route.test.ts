/**
 * Students API Route Tests
 * Tests for /students endpoint
 * Priority: HIGH - PHI exposure risk, HIPAA compliance
 */

import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { createStudent, createNurse, createAdmin, createUser } from '../../../../../../tests/utils/test-factories';
import { verifyAuditLog, containsPHI } from '../../../../../../tests/utils/hipaa-test-utils';

// Mock dependencies
jest.mock('@/lib/apiProxy');
jest.mock('@/lib/audit');
jest.mock('@/lib/auth');
jest.mock('next/cache');

import { proxyToBackend } from '@/lib/apiProxy';
import { logPHIAccess, createAuditContext } from '@/lib/audit';
import { authenticateRequest } from '@/lib/auth';
import { revalidateTag } from 'next/cache';

const mockProxyToBackend = proxyToBackend as jest.MockedFunction<typeof proxyToBackend>;
const mockLogPHIAccess = logPHIAccess as jest.MockedFunction<typeof logPHIAccess>;
const mockAuthenticateRequest = authenticateRequest as jest.MockedFunction<
  typeof authenticateRequest
>;
const mockRevalidateTag = revalidateTag as jest.MockedFunction<typeof revalidateTag>;
const mockCreateAuditContext = createAuditContext as jest.MockedFunction<
  typeof createAuditContext
>;

describe('/students', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default audit context
    mockCreateAuditContext.mockReturnValue({
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    } as any);
  });

  describe('GET /students', () => {
    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/students');

      // Act
      const response = await GET(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return list of students for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const students = [createStudent(), createStudent()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: students }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
    });

    it('should use caching for student list', async () => {
      // Arrange
      const nurse = createNurse();
      const students = [createStudent()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: students }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockProxyToBackend).toHaveBeenCalledWith(
        expect.anything(),
        '/students',
        expect.objectContaining({
          cache: expect.objectContaining({
            revalidate: 60,
            tags: ['students'],
          }),
        })
      );
    });

    it('should log PHI access for HIPAA compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const students = [createStudent(), createStudent()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: students }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'VIEW',
          resource: 'Student',
          details: expect.stringContaining('Listed students'),
        })
      );
    });

    it('should support filtering by query parameters', async () => {
      // Arrange
      const nurse = createNurse();
      const students = [createStudent({ grade: '5' })];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: students }),
        status: 200,
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/students?grade=5&status=active',
        {
          headers: { Authorization: `Bearer token-${nurse.id}` },
        }
      );

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      expect(mockProxyToBackend).toHaveBeenCalledWith(
        expect.anything(),
        '/students',
        expect.anything()
      );
    });

    it('should handle backend errors gracefully', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(new Error('Backend unavailable'));

      const request = new NextRequest('http://localhost:3000/students', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch students');
    });

    it('should not expose PHI in error messages', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(
        new Error('Database error: SELECT * FROM students WHERE ssn=123-45-6789')
      );

      const request = new NextRequest('http://localhost:3000/students', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch students');
      expect(data.error).not.toContain('ssn');
      expect(data.error).not.toContain('123-45-6789');
    });
  });

  describe('POST /students', () => {
    const validStudentData = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2010-05-15',
      grade: '5',
      gender: 'male',
    };

    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        body: JSON.stringify(validStudentData),
      });

      // Act
      const response = await POST(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should create student for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const newStudent = createStudent(validStudentData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newStudent }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validStudentData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBeDefined();
    });

    it('should log PHI creation for HIPAA compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const newStudent = createStudent(validStudentData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newStudent }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validStudentData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          resource: 'Student',
          resourceId: newStudent.id,
          details: 'Student record created',
        })
      );
    });

    it('should invalidate students cache after creation', async () => {
      // Arrange
      const nurse = createNurse();
      const newStudent = createStudent(validStudentData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newStudent }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validStudentData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockRevalidateTag).toHaveBeenCalledWith('students');
    });

    it('should handle validation errors', async () => {
      // Arrange
      const nurse = createNurse();
      const invalidData = { firstName: 'John' }; // Missing required fields

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['lastName is required', 'dateOfBirth is required'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(invalidData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.error).toBe('Validation failed');
    });

    it('should handle backend errors gracefully', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validStudentData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create student');
    });

    it('should not create student without proper permissions', async () => {
      // Arrange
      const userWithoutPermissions = createUser({
        role: 'parent',
        permissions: ['read:students'],
      });

      mockAuthenticateRequest.mockReturnValue(userWithoutPermissions);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: false, error: 'Insufficient permissions' }),
        status: 403,
      } as any);

      const request = new NextRequest('http://localhost:3000/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${userWithoutPermissions.id}`,
        },
        body: JSON.stringify(validStudentData),
      });

      // Act
      const response = await POST(request, { user: userWithoutPermissions });

      // Assert
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Insufficient permissions');
    });
  });
});
