/**
 * @fileoverview Student Query Controller Tests
 * @module student/controllers/student-query.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentQueryController } from './student-query.controller';
import { StudentService } from '../student.service';
import { Student } from '@/database';

describe('StudentQueryController', () => {
  let controller: StudentQueryController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudent: Partial<Student> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    isActive: true,
  };

  beforeEach(async () => {
    const mockStudentService = {
      search: jest.fn(),
      findAllGrades: jest.fn(),
      findByGrade: jest.fn(),
      findAssignedStudents: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentQueryController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentQueryController>(StudentQueryController);
    studentService = module.get(StudentService);
  });

  describe('search', () => {
    it('should search students with default limit', async () => {
      const query = 'john';
      const mockResults = [mockStudent];
      studentService.search.mockResolvedValue(mockResults as Student[]);

      const result = await controller.search(query);

      expect(result).toEqual(mockResults);
      expect(studentService.search).toHaveBeenCalledWith(query, undefined);
    });

    it('should search students with custom limit', async () => {
      const query = 'doe';
      const limit = 50;
      const mockResults = [mockStudent];
      studentService.search.mockResolvedValue(mockResults as Student[]);

      const result = await controller.search(query, limit);

      expect(result).toEqual(mockResults);
      expect(studentService.search).toHaveBeenCalledWith(query, limit);
    });

    it('should return empty array when no matches found', async () => {
      const query = 'nonexistent';
      studentService.search.mockResolvedValue([]);

      const result = await controller.search(query);

      expect(result).toEqual([]);
      expect(studentService.search).toHaveBeenCalledWith(query, undefined);
    });

    it('should handle search errors', async () => {
      const query = 'test';
      studentService.search.mockRejectedValue(new Error('Search failed'));

      await expect(controller.search(query)).rejects.toThrow('Search failed');
    });
  });

  describe('getAllGrades', () => {
    it('should return all unique grades', async () => {
      const mockGrades = ['K', '1', '2', '3', '4', '5', '6'];
      studentService.findAllGrades.mockResolvedValue(mockGrades);

      const result = await controller.getAllGrades();

      expect(result).toEqual(mockGrades);
      expect(studentService.findAllGrades).toHaveBeenCalled();
    });

    it('should return empty array when no grades exist', async () => {
      studentService.findAllGrades.mockResolvedValue([]);

      const result = await controller.getAllGrades();

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      studentService.findAllGrades.mockRejectedValue(new Error('Query failed'));

      await expect(controller.getAllGrades()).rejects.toThrow('Query failed');
    });
  });

  describe('findByGrade', () => {
    it('should return students in specific grade', async () => {
      const grade = '10';
      const mockResults = [mockStudent, { ...mockStudent, id: 'student-2' }];
      studentService.findByGrade.mockResolvedValue(mockResults as Student[]);

      const result = await controller.findByGrade(grade);

      expect(result).toEqual(mockResults);
      expect(result).toHaveLength(2);
      expect(studentService.findByGrade).toHaveBeenCalledWith(grade);
    });

    it('should return empty array for grade with no students', async () => {
      const grade = '12';
      studentService.findByGrade.mockResolvedValue([]);

      const result = await controller.findByGrade(grade);

      expect(result).toEqual([]);
      expect(studentService.findByGrade).toHaveBeenCalledWith(grade);
    });

    it('should handle grade search errors', async () => {
      const grade = '10';
      studentService.findByGrade.mockRejectedValue(new Error('Grade query failed'));

      await expect(controller.findByGrade(grade)).rejects.toThrow('Grade query failed');
    });
  });

  describe('findAssignedStudents', () => {
    it('should return students assigned to a nurse', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      const mockResults = [mockStudent];
      studentService.findAssignedStudents.mockResolvedValue(mockResults as Student[]);

      const result = await controller.findAssignedStudents(nurseId);

      expect(result).toEqual(mockResults);
      expect(studentService.findAssignedStudents).toHaveBeenCalledWith(nurseId);
    });

    it('should return empty array when nurse has no assigned students', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      studentService.findAssignedStudents.mockResolvedValue([]);

      const result = await controller.findAssignedStudents(nurseId);

      expect(result).toEqual([]);
    });

    it('should handle assignment query errors', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      studentService.findAssignedStudents.mockRejectedValue(new Error('Query failed'));

      await expect(controller.findAssignedStudents(nurseId)).rejects.toThrow('Query failed');
    });
  });
});
