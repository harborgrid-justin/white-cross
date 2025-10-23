/**
 * Students API Tests
 * Tests CRUD operations and error handling for student management
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/mocks/server';
import { StudentsApi } from '../studentsApi';
import { ApiClient } from '@/services/core/ApiClient';
import type { Student, CreateStudentData, UpdateStudentData } from '@/types/student.types';

describe('StudentsApi', () => {
  let studentsApi: StudentsApi;
  let apiClient: ApiClient;

  const mockStudent: Student = {
    id: '123',
    studentNumber: 'STU-12345',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-05-15',
    grade: '8',
    gender: 'MALE',
    photo: 'https://example.com/photo.jpg',
    medicalRecordNum: 'MRN-12345',
    nurseId: 'nurse-123',
    enrollmentDate: '2024-01-15',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    // Server is already started in global setup
    apiClient = new ApiClient({
      baseURL: 'http://localhost:3000/api',
      timeout: 10000,
      enableLogging: false,
      enableRetry: false,
    });
    studentsApi = new StudentsApi(apiClient);
  });

  afterEach(() => {
    // Handlers are reset in global teardown
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all students with pagination', async () => {
      // Arrange
      const mockResponse = {
        success: true,
        data: {
          students: [mockStudent],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      server.use(
        http.get('http://localhost:3000/api/api/students', async () => {
          return HttpResponse.json(mockResponse);
        })
      );

      // Act
      const result = await studentsApi.getAll({ page: 1, limit: 10 });

      // Assert
      expect(result.students).toHaveLength(1);
      expect(result.students[0]).toEqual(mockStudent);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should apply filters when fetching students', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students', async ({ request }) => {
          const url = new URL(request.url);
          const search = url.searchParams.get('search');
          const grade = url.searchParams.get('grade');

          expect(search).toBe('John');
          expect(grade).toBe('8');

          return HttpResponse.json({
            success: true,
            data: {
              students: [mockStudent],
              total: 1,
              page: 1,
              limit: 10,
              totalPages: 1,
            },
          });
        })
      );

      // Act
      await studentsApi.getAll({
        search: 'John',
        grade: '8',
        page: 1,
        limit: 10,
      });

      // Assert - expectations in the mock handler
    });

    it('should handle empty results', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students', async () => {
          return HttpResponse.json({
            success: true,
            data: {
              students: [],
              total: 0,
              page: 1,
              limit: 10,
              totalPages: 0,
            },
          });
        })
      );

      // Act
      const result = await studentsApi.getAll();

      // Assert
      expect(result.students).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getById', () => {
    it('should fetch student by ID', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students/123', async () => {
          return HttpResponse.json({
            success: true,
            data: {
              student: mockStudent,
            },
          });
        })
      );

      // Act
      const student = await studentsApi.getById('123');

      // Assert
      expect(student).toEqual(mockStudent);
      expect(student.id).toBe('123');
    });

    it('should throw error when student not found', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students/999', async () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Student not found',
              },
            },
            { status: 404 }
          );
        })
      );

      // Act & Assert
      await expect(studentsApi.getById('999')).rejects.toThrow(/student not found/i);
    });

    it('should throw error when ID is missing', async () => {
      // Act & Assert
      await expect(studentsApi.getById('')).rejects.toThrow(/student id is required/i);
    });
  });

  describe('create', () => {
    it('should create new student successfully', async () => {
      // Arrange
      const newStudentData: CreateStudentData = {
        studentNumber: 'STU-99999',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2012-03-20',
        grade: '6',
        gender: 'FEMALE',
      };

      const createdStudent = {
        ...mockStudent,
        ...newStudentData,
        id: '456',
      };

      server.use(
        http.post('http://localhost:3000/api/students', async ({ request }) => {
          const body = await request.json();
          expect(body).toMatchObject(newStudentData);

          return HttpResponse.json({
            success: true,
            data: {
              student: createdStudent,
            },
          });
        })
      );

      // Act
      const student = await studentsApi.create(newStudentData);

      // Assert
      expect(student.id).toBe('456');
      expect(student.firstName).toBe('Jane');
      expect(student.lastName).toBe('Smith');
    });

    it('should validate student data before creating', async () => {
      // Arrange - invalid data (firstName too short)
      const invalidData = {
        studentNumber: 'STU-99999',
        firstName: '',
        lastName: 'Smith',
        dateOfBirth: '2012-03-20',
        grade: '6',
        gender: 'FEMALE' as const,
      };

      // Act & Assert
      await expect(studentsApi.create(invalidData)).rejects.toThrow(/validation error/i);
    });

    it('should handle server validation errors', async () => {
      // Arrange
      const newStudentData: CreateStudentData = {
        studentNumber: 'STU-DUPLICATE',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2012-03-20',
        grade: '6',
        gender: 'MALE',
      };

      server.use(
        http.post('http://localhost:3000/api/students', async () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Student number already exists',
              },
            },
            { status: 400 }
          );
        })
      );

      // Act & Assert
      await expect(studentsApi.create(newStudentData)).rejects.toThrow(/already exists/i);
    });
  });

  describe('update', () => {
    it('should update student successfully', async () => {
      // Arrange
      const updateData: UpdateStudentData = {
        firstName: 'Jonathan',
        grade: '9',
      };

      const updatedStudent = {
        ...mockStudent,
        ...updateData,
      };

      server.use(
        http.put('http://localhost:3000/api/students/123', async ({ request }) => {
          const body = await request.json();
          expect(body).toMatchObject(updateData);

          return HttpResponse.json({
            success: true,
            data: {
              student: updatedStudent,
            },
          });
        })
      );

      // Act
      const student = await studentsApi.update('123', updateData);

      // Assert
      expect(student.firstName).toBe('Jonathan');
      expect(student.grade).toBe('9');
    });

    it('should throw error when updating with invalid ID', async () => {
      // Act & Assert
      await expect(studentsApi.update('', { firstName: 'John' })).rejects.toThrow(
        /student id is required/i
      );
    });

    it('should validate update data', async () => {
      // Arrange - invalid grade
      const invalidUpdate = {
        grade: 'INVALID_GRADE_VERY_LONG_STRING',
      };

      // Act & Assert
      await expect(studentsApi.update('123', invalidUpdate)).rejects.toThrow(/validation error/i);
    });
  });

  describe('deactivate', () => {
    it('should deactivate student successfully', async () => {
      // Arrange
      server.use(
        http.delete('http://localhost:3000/api/students/123', async () => {
          return HttpResponse.json({
            success: true,
            data: {
              message: 'Student deactivated successfully',
            },
          });
        })
      );

      // Act
      const result = await studentsApi.deactivate('123');

      // Assert
      expect(result.success).toBe(true);
      expect(result.message).toMatch(/deactivated successfully/i);
    });

    it('should throw error when deactivating with invalid ID', async () => {
      // Act & Assert
      await expect(studentsApi.deactivate('')).rejects.toThrow(/student id is required/i);
    });

    it('should handle deactivation errors', async () => {
      // Arrange
      server.use(
        http.delete('http://localhost:3000/api/students/123', async () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Cannot deactivate student with active medications',
              },
            },
            { status: 400 }
          );
        })
      );

      // Act & Assert
      await expect(studentsApi.deactivate('123')).rejects.toThrow(/active medications/i);
    });
  });

  describe('search', () => {
    it('should search students by query', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students/search/John', async () => {
          return HttpResponse.json({
            success: true,
            data: {
              students: [mockStudent],
            },
          });
        })
      );

      // Act
      const students = await studentsApi.search('John');

      // Assert
      expect(students).toHaveLength(1);
      expect(students[0]).toEqual(mockStudent);
    });

    it('should return empty array for empty query', async () => {
      // Act
      const students = await studentsApi.search('   ');

      // Assert
      expect(students).toEqual([]);
    });

    it('should handle search errors gracefully', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students/search/error', async () => {
          return HttpResponse.json(
            {
              error: {
                message: 'Search failed',
              },
            },
            { status: 500 }
          );
        })
      );

      // Act & Assert
      await expect(studentsApi.search('error')).rejects.toThrow(/search failed/i);
    });
  });

  describe('getStatistics', () => {
    it('should fetch student statistics', async () => {
      // Arrange
      const mockStats = {
        totalMedications: 5,
        activeMedications: 3,
        allergiesCount: 2,
        chronicConditionsCount: 1,
        lastVisit: '2024-01-15',
      };

      server.use(
        http.get('http://localhost:3000/api/students/123/statistics', async () => {
          return HttpResponse.json({
            success: true,
            data: mockStats,
          });
        })
      );

      // Act
      const stats = await studentsApi.getStatistics('123');

      // Assert
      expect(stats).toEqual(mockStats);
      expect(stats.totalMedications).toBe(5);
      expect(stats.activeMedications).toBe(3);
    });

    it('should throw error when fetching stats without ID', async () => {
      // Act & Assert
      await expect(studentsApi.getStatistics('')).rejects.toThrow(/student id is required/i);
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students', async () => {
          return HttpResponse.error();
        })
      );

      // Act & Assert
      await expect(studentsApi.getAll()).rejects.toThrow();
    });

    it('should handle timeout errors', async () => {
      // Arrange
      const slowClient = new ApiClient({
        baseURL: 'http://localhost:3000',
        timeout: 100, // 100ms timeout
        enableRetry: false,
      });
      const slowStudentsApi = new StudentsApi(slowClient);

      server.use(
        http.get('http://localhost:3000/api/students', async () => {
          // Delay longer than timeout
          await new Promise(resolve => setTimeout(resolve, 200));
          return HttpResponse.json({ success: true, data: { students: [] } });
        })
      );

      // Act & Assert
      await expect(slowStudentsApi.getAll()).rejects.toThrow();
    });

    it('should handle malformed response data', async () => {
      // Arrange
      server.use(
        http.get('http://localhost:3000/api/students/123', async () => {
          return HttpResponse.json({
            success: true,
            data: null, // Malformed: should have student property
          });
        })
      );

      // Act & Assert
      await expect(studentsApi.getById('123')).rejects.toThrow();
    });
  });
});
