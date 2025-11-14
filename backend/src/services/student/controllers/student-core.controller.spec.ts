/**
 * @fileoverview Student Core Controller Tests
 * @module student/controllers/student-core.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentCoreController } from './student-core.controller';
import { StudentCrudService } from '../services/student-crud.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { Student } from '@/database';
import type { PaginatedResponse } from '../types';

describe('StudentCoreController', () => {
  let controller: StudentCoreController;
  let crudService: jest.Mocked<StudentCrudService>;

  const mockStudent: Partial<Student> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    dateOfBirth: new Date('2008-01-15'),
    gender: 'M',
    isActive: true,
  };

  beforeEach(async () => {
    const mockCrudService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentCoreController],
      providers: [
        {
          provide: StudentCrudService,
          useValue: mockCrudService,
        },
      ],
    }).compile();

    controller = module.get<StudentCoreController>(StudentCoreController);
    crudService = module.get(StudentCrudService);
  });

  describe('create', () => {
    it('should create a new student successfully', async () => {
      const createDto: CreateStudentDto = {
        studentNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        grade: '10',
        dateOfBirth: '2008-01-15',
        gender: 'M',
        schoolId: '123e4567-e89b-12d3-a456-426614174001',
      };

      crudService.create.mockResolvedValue(mockStudent as Student);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockStudent);
      expect(crudService.create).toHaveBeenCalledWith(createDto);
    });

    it('should handle creation errors', async () => {
      const createDto: CreateStudentDto = {
        studentNumber: 'STU001',
        firstName: 'John',
        lastName: 'Doe',
        grade: '10',
        dateOfBirth: '2008-01-15',
        gender: 'M',
        schoolId: '123e4567-e89b-12d3-a456-426614174001',
      };

      crudService.create.mockRejectedValue(new Error('Student number already exists'));

      await expect(controller.create(createDto)).rejects.toThrow('Student number already exists');
    });
  });

  describe('findAll', () => {
    it('should return paginated students', async () => {
      const filterDto: StudentFilterDto = { page: 1, limit: 20 };
      const mockResponse: PaginatedResponse<Student> = {
        data: [mockStudent as Student],
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      };

      crudService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(mockResponse);
      expect(crudService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should apply filters correctly', async () => {
      const filterDto: StudentFilterDto = {
        search: 'john',
        grade: '10',
        isActive: true,
      };

      const mockResponse: PaginatedResponse<Student> = {
        data: [mockStudent as Student],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      crudService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(filterDto);

      expect(crudService.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a single student by ID', async () => {
      const studentId = mockStudent.id as string;
      crudService.findOne.mockResolvedValue(mockStudent as Student);

      const result = await controller.findOne(studentId);

      expect(result).toEqual(mockStudent);
      expect(crudService.findOne).toHaveBeenCalledWith(studentId);
    });

    it('should handle student not found', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174999';
      crudService.findOne.mockRejectedValue(new Error('Student not found'));

      await expect(controller.findOne(studentId)).rejects.toThrow('Student not found');
    });
  });

  describe('update', () => {
    it('should update student successfully', async () => {
      const studentId = mockStudent.id as string;
      const updateDto: UpdateStudentDto = {
        firstName: 'Jane',
        grade: '11',
      };

      const updatedStudent = { ...mockStudent, ...updateDto };
      crudService.update.mockResolvedValue(updatedStudent as Student);

      const result = await controller.update(studentId, updateDto);

      expect(result).toEqual(updatedStudent);
      expect(crudService.update).toHaveBeenCalledWith(studentId, updateDto);
    });

    it('should handle update errors', async () => {
      const studentId = mockStudent.id as string;
      const updateDto: UpdateStudentDto = { grade: '11' };

      crudService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(studentId, updateDto)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should delete student successfully', async () => {
      const studentId = mockStudent.id as string;
      crudService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(studentId);

      expect(result).toBeUndefined();
      expect(crudService.remove).toHaveBeenCalledWith(studentId);
    });

    it('should handle deletion errors', async () => {
      const studentId = mockStudent.id as string;
      crudService.remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.remove(studentId)).rejects.toThrow('Deletion failed');
    });
  });
});
