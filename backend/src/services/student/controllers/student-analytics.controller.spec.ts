/**
 * @fileoverview Student Analytics Controller Tests
 * @module student/controllers/student-analytics.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentAnalyticsController } from './student-analytics.controller';
import { StudentService } from '../student.service';
import type { StudentStatistics, StudentDataExport } from '../types';

describe('StudentAnalyticsController', () => {
  let controller: StudentAnalyticsController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  const mockStatistics: StudentStatistics = {
    healthRecords: 25,
    allergies: 2,
    medications: 1,
    appointments: 8,
    incidents: 1,
  };

  const mockDataExport: StudentDataExport = {
    exportDate: new Date('2024-01-15'),
    student: {
      id: mockStudentId,
      studentNumber: 'STU001',
      firstName: 'John',
      lastName: 'Doe',
      grade: '10',
    },
    statistics: mockStatistics,
  };

  beforeEach(async () => {
    const mockStudentService = {
      getStatistics: jest.fn(),
      exportData: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAnalyticsController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentAnalyticsController>(StudentAnalyticsController);
    studentService = module.get(StudentService);
  });

  describe('getStatistics', () => {
    it('should return student statistics successfully', async () => {
      studentService.getStatistics.mockResolvedValue(mockStatistics);

      const result = await controller.getStatistics(mockStudentId);

      expect(result).toEqual(mockStatistics);
      expect(result.healthRecords).toBe(25);
      expect(result.allergies).toBe(2);
      expect(result.medications).toBe(1);
      expect(studentService.getStatistics).toHaveBeenCalledWith(mockStudentId);
    });

    it('should return zero counts for student with no records', async () => {
      const emptyStats: StudentStatistics = {
        healthRecords: 0,
        allergies: 0,
        medications: 0,
        appointments: 0,
        incidents: 0,
      };
      studentService.getStatistics.mockResolvedValue(emptyStats);

      const result = await controller.getStatistics(mockStudentId);

      expect(result).toEqual(emptyStats);
      expect(result.healthRecords).toBe(0);
    });

    it('should handle statistics retrieval errors', async () => {
      studentService.getStatistics.mockRejectedValue(new Error('Student not found'));

      await expect(controller.getStatistics(mockStudentId)).rejects.toThrow('Student not found');
    });

    it('should handle database errors', async () => {
      studentService.getStatistics.mockRejectedValue(new Error('Database connection error'));

      await expect(controller.getStatistics(mockStudentId)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('exportData', () => {
    it('should export student data successfully', async () => {
      studentService.exportData.mockResolvedValue(mockDataExport);

      const result = await controller.exportData(mockStudentId);

      expect(result).toEqual(mockDataExport);
      expect(result.student.id).toBe(mockStudentId);
      expect(result.statistics).toEqual(mockStatistics);
      expect(result.exportDate).toBeInstanceOf(Date);
      expect(studentService.exportData).toHaveBeenCalledWith(mockStudentId);
    });

    it('should include all student information in export', async () => {
      const fullExport: StudentDataExport = {
        ...mockDataExport,
        student: {
          id: mockStudentId,
          studentNumber: 'STU001',
          firstName: 'John',
          lastName: 'Doe',
          grade: '10',
          dateOfBirth: new Date('2008-01-15'),
          gender: 'M',
          email: 'john.doe@example.com',
        },
      };
      studentService.exportData.mockResolvedValue(fullExport);

      const result = await controller.exportData(mockStudentId);

      expect(result.student.studentNumber).toBe('STU001');
      expect(result.student.firstName).toBe('John');
      expect(result.student.lastName).toBe('Doe');
      expect(result.student.grade).toBe('10');
    });

    it('should handle export errors', async () => {
      studentService.exportData.mockRejectedValue(new Error('Export failed'));

      await expect(controller.exportData(mockStudentId)).rejects.toThrow('Export failed');
    });

    it('should handle student not found', async () => {
      studentService.exportData.mockRejectedValue(new Error('Student not found'));

      await expect(controller.exportData(mockStudentId)).rejects.toThrow('Student not found');
    });
  });
});
