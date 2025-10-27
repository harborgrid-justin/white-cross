/**
 * Health Records API Route Tests
 * Tests for /api/v1/health-records endpoint
 * Priority: HIGH - HIPAA compliance risk, highly sensitive PHI
 */

import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import {
  createHealthRecord,
  createNurse,
  createAdmin,
  createUser,
  createStudent,
} from '../../../../../../tests/utils/test-factories';
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

describe('/api/v1/health-records', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default audit context
    mockCreateAuditContext.mockReturnValue({
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    } as any);
  });

  describe('GET /api/v1/health-records', () => {
    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/health-records');

      // Act
      const response = await GET(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return list of health records for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const healthRecords = [
        createHealthRecord({ type: 'vaccination' }),
        createHealthRecord({ type: 'screening' }),
      ];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
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

    it('should use short cache time for highly sensitive PHI', async () => {
      // Arrange
      const nurse = createNurse();
      const healthRecords = [createHealthRecord()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockProxyToBackend).toHaveBeenCalledWith(
        expect.anything(),
        '/api/v1/health-records',
        expect.objectContaining({
          cache: expect.objectContaining({
            revalidate: 30, // Short cache time for highly sensitive data
            tags: ['health-records'],
          }),
        })
      );
    });

    it('should log PHI access for HIPAA compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const healthRecords = [createHealthRecord(), createHealthRecord()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'VIEW',
          resource: 'HealthRecord',
          details: expect.stringContaining('Listed health records'),
        })
      );
    });

    it('should audit log contain user and timestamp for compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const healthRecords = [createHealthRecord()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      const auditCall = mockLogPHIAccess.mock.calls[0][0];
      expect(auditCall.timestamp).toBeDefined();
      expect(auditCall.ipAddress).toBeDefined();
      expect(auditCall.userAgent).toBeDefined();
    });

    it('should support filtering by student ID', async () => {
      // Arrange
      const nurse = createNurse();
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const healthRecords = [createHealthRecord({ studentId })];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest(
        `http://localhost:3000/api/v1/health-records?studentId=${studentId}`,
        {
          headers: { Authorization: `Bearer token-${nurse.id}` },
        }
      );

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.every((record: any) => record.studentId === studentId)).toBe(true);
    });

    it('should support filtering by record type', async () => {
      // Arrange
      const nurse = createNurse();
      const healthRecords = [
        createHealthRecord({ type: 'vaccination' }),
        createHealthRecord({ type: 'vaccination' }),
      ];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: healthRecords }),
        status: 200,
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/api/v1/health-records?type=vaccination',
        {
          headers: { Authorization: `Bearer token-${nurse.id}` },
        }
      );

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.every((record: any) => record.type === 'vaccination')).toBe(true);
    });

    it('should handle backend errors gracefully', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(new Error('Backend unavailable'));

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch health records');
    });

    it('should not expose PHI in error messages', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(
        new Error('Database error: Patient John Doe diagnosed with condition X')
      );

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch health records');
      expect(data.error).not.toContain('John Doe');
      expect(data.error).not.toContain('diagnosed');
    });
  });

  describe('POST /api/v1/health-records', () => {
    const validHealthRecordData = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      type: 'vaccination',
      date: '2024-01-15',
      description: 'Annual flu vaccination administered',
      provider: 'School Nurse Jane Smith',
      diagnosis: '',
      treatment: 'Influenza vaccine, 0.5ml IM',
      notes: 'No adverse reactions observed',
    };

    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      const response = await POST(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should create health record for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const newHealthRecord = createHealthRecord(validHealthRecordData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newHealthRecord }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validHealthRecordData),
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
      const newHealthRecord = createHealthRecord(validHealthRecordData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newHealthRecord }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          resource: 'HealthRecord',
          resourceId: newHealthRecord.id,
          details: 'Health record created',
        })
      );
    });

    it('should invalidate multiple cache tags after creation', async () => {
      // Arrange
      const nurse = createNurse();
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const newHealthRecord = createHealthRecord({ ...validHealthRecordData, studentId });

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newHealthRecord }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockRevalidateTag).toHaveBeenCalledWith('health-records');
      expect(mockRevalidateTag).toHaveBeenCalledWith(
        `student-${studentId}-health-records`
      );
      expect(mockRevalidateTag).toHaveBeenCalledWith(`student-${studentId}`);
    });

    it('should validate required fields', async () => {
      // Arrange
      const nurse = createNurse();
      const invalidData = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'vaccination',
        // Missing date, description
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['date is required', 'description is required'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
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
      expect(data.error).toBe('Validation failed');
    });

    it('should validate record type enum', async () => {
      // Arrange
      const nurse = createNurse();
      const invalidTypeData = {
        ...validHealthRecordData,
        type: 'invalid-type',
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: [
            'type must be one of: vaccination, screening, illness, injury, chronic-condition, assessment',
          ],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(invalidTypeData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should handle backend errors gracefully', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(new Error('Database connection failed'));

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create health record');
    });

    it('should not allow creation without proper permissions', async () => {
      // Arrange
      const userWithoutPermissions = createUser({
        role: 'parent',
        permissions: ['read:health-records'],
      });

      mockAuthenticateRequest.mockReturnValue(userWithoutPermissions);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: false, error: 'Insufficient permissions' }),
        status: 403,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${userWithoutPermissions.id}`,
        },
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      const response = await POST(request, { user: userWithoutPermissions });

      // Assert
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Insufficient permissions');
    });

    it('should verify student exists before creating health record', async () => {
      // Arrange
      const nurse = createNurse();
      const dataWithInvalidStudent = {
        ...validHealthRecordData,
        studentId: 'non-existent-student-id',
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: false, error: 'Student not found' }),
        status: 404,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(dataWithInvalidStudent),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(404);
      const data = await response.json();
      expect(data.error).toBe('Student not found');
    });

    it('should create comprehensive audit trail for PHI', async () => {
      // Arrange
      const nurse = createNurse();
      const newHealthRecord = createHealthRecord(validHealthRecordData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newHealthRecord }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
          'X-Forwarded-For': '192.168.1.100',
          'User-Agent': 'Mozilla/5.0',
        },
        body: JSON.stringify(validHealthRecordData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      const auditCall = mockLogPHIAccess.mock.calls[0][0];
      expect(auditCall.action).toBe('CREATE');
      expect(auditCall.resource).toBe('HealthRecord');
      expect(auditCall.resourceId).toBe(newHealthRecord.id);
      expect(auditCall.timestamp).toBeDefined();
      expect(auditCall.ipAddress).toBeDefined();
      expect(auditCall.userAgent).toBeDefined();
    });
  });
});
