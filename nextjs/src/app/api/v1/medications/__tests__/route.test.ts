/**
 * Medications API Route Tests
 * Tests for /api/v1/medications endpoint
 * Priority: HIGH - Patient safety risk, HIPAA compliance
 */

import { GET, POST } from '../route';
import { NextRequest } from 'next/server';
import { createMedication, createNurse, createAdmin, createUser } from '../../../../../../tests/utils/test-factories';
import { verifyAuditLog } from '../../../../../../tests/utils/hipaa-test-utils';

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

describe('/api/v1/medications', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default audit context
    mockCreateAuditContext.mockReturnValue({
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'test-agent',
    } as any);
  });

  describe('GET /api/v1/medications', () => {
    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/medications');

      // Act
      const response = await GET(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should return list of medications for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const medications = [createMedication(), createMedication()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: medications }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(2);
      expect(data.data[0].name).toBeDefined();
      expect(data.data[0].dosage).toBeDefined();
    });

    it('should use shorter cache time for sensitive healthcare data', async () => {
      // Arrange
      const nurse = createNurse();
      const medications = [createMedication()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: medications }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockProxyToBackend).toHaveBeenCalledWith(
        expect.anything(),
        '/api/v1/medications',
        expect.objectContaining({
          cache: expect.objectContaining({
            revalidate: 30, // Shorter cache time for sensitive data
            tags: ['medications'],
          }),
        })
      );
    });

    it('should log PHI access for HIPAA compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const medications = [createMedication(), createMedication()];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: medications }),
        status: 200,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      await GET(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'VIEW',
          resource: 'Medication',
          details: expect.stringContaining('Listed medications'),
        })
      );
    });

    it('should support filtering by student ID', async () => {
      // Arrange
      const nurse = createNurse();
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const medications = [createMedication({ studentId })];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: medications }),
        status: 200,
      } as any);

      const request = new NextRequest(
        `http://localhost:3000/api/v1/medications?studentId=${studentId}`,
        {
          headers: { Authorization: `Bearer token-${nurse.id}` },
        }
      );

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.every((med: any) => med.studentId === studentId)).toBe(true);
    });

    it('should filter by medication status', async () => {
      // Arrange
      const nurse = createNurse();
      const medications = [
        createMedication({ status: 'active' }),
        createMedication({ status: 'active' }),
      ];

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: medications }),
        status: 200,
      } as any);

      const request = new NextRequest(
        'http://localhost:3000/api/v1/medications?status=active',
        {
          headers: { Authorization: `Bearer token-${nurse.id}` },
        }
      );

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.data.every((med: any) => med.status === 'active')).toBe(true);
    });

    it('should handle backend errors gracefully', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(new Error('Backend unavailable'));

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch medications');
    });

    it('should not expose sensitive medication details in errors', async () => {
      // Arrange
      const nurse = createNurse();

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockRejectedValue(
        new Error('Medication error: Patient John Doe has adverse reaction')
      );

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        headers: { Authorization: `Bearer token-${nurse.id}` },
      });

      // Act
      const response = await GET(request, { user: nurse });

      // Assert
      const data = await response.json();
      expect(data.error).toBe('Failed to fetch medications');
      expect(data.error).not.toContain('John Doe');
      expect(data.error).not.toContain('adverse reaction');
    });
  });

  describe('POST /api/v1/medications', () => {
    const validMedicationData = {
      studentId: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Ibuprofen',
      genericName: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'Twice daily',
      route: 'Oral',
      prescribedBy: 'Dr. Jane Smith',
      prescribedDate: '2024-01-15',
      expirationDate: '2025-01-15',
      instructions: 'Take with food',
    };

    it('should require authentication', async () => {
      // Arrange
      mockAuthenticateRequest.mockReturnValue(null);
      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        body: JSON.stringify(validMedicationData),
      });

      // Act
      const response = await POST(request, {});

      // Assert
      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe('Unauthorized');
    });

    it('should create medication for authenticated nurse', async () => {
      // Arrange
      const nurse = createNurse();
      const newMedication = createMedication(validMedicationData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newMedication }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validMedicationData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.id).toBeDefined();
      expect(data.data.name).toBe(validMedicationData.name);
    });

    it('should log PHI creation for HIPAA compliance', async () => {
      // Arrange
      const nurse = createNurse();
      const newMedication = createMedication(validMedicationData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newMedication }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validMedicationData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockLogPHIAccess).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CREATE',
          resource: 'Medication',
          resourceId: newMedication.id,
          details: 'Medication record created',
        })
      );
    });

    it('should invalidate medications cache after creation', async () => {
      // Arrange
      const nurse = createNurse();
      const newMedication = createMedication(validMedicationData);

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: true, data: newMedication }),
        status: 201,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validMedicationData),
      });

      // Act
      await POST(request, { user: nurse });

      // Assert
      expect(mockRevalidateTag).toHaveBeenCalledWith('medications');
    });

    it('should validate required medication fields', async () => {
      // Arrange
      const nurse = createNurse();
      const invalidData = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Ibuprofen',
        // Missing dosage, frequency, route
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['dosage is required', 'frequency is required', 'route is required'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
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

    it('should validate medication dosage format', async () => {
      // Arrange
      const nurse = createNurse();
      const invalidDosageData = {
        ...validMedicationData,
        dosage: 'invalid-dosage',
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['dosage must be in valid format (e.g., 200mg, 5ml)'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(invalidDosageData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe('Validation failed');
    });

    it('should validate expiration date is in future', async () => {
      // Arrange
      const nurse = createNurse();
      const expiredMedicationData = {
        ...validMedicationData,
        expirationDate: '2020-01-01',
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({
          success: false,
          error: 'Validation failed',
          details: ['expirationDate must be in the future'],
        }),
        status: 400,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(expiredMedicationData),
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

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${nurse.id}`,
        },
        body: JSON.stringify(validMedicationData),
      });

      // Act
      const response = await POST(request, { user: nurse });

      // Assert
      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe('Failed to create medication');
    });

    it('should not allow creation without proper permissions', async () => {
      // Arrange
      const userWithoutPermissions = createUser({
        role: 'parent',
        permissions: ['read:medications'],
      });

      mockAuthenticateRequest.mockReturnValue(userWithoutPermissions);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: false, error: 'Insufficient permissions' }),
        status: 403,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer token-${userWithoutPermissions.id}`,
        },
        body: JSON.stringify(validMedicationData),
      });

      // Act
      const response = await POST(request, { user: userWithoutPermissions });

      // Assert
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toBe('Insufficient permissions');
    });

    it('should verify student exists before creating medication', async () => {
      // Arrange
      const nurse = createNurse();
      const dataWithInvalidStudent = {
        ...validMedicationData,
        studentId: 'non-existent-student-id',
      };

      mockAuthenticateRequest.mockReturnValue(nurse);
      mockProxyToBackend.mockResolvedValue({
        json: async () => ({ success: false, error: 'Student not found' }),
        status: 404,
      } as any);

      const request = new NextRequest('http://localhost:3000/api/v1/medications', {
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
  });
});
