/**
 * @fileoverview Student CRUD Controller Tests
 * @module student/controllers/student-crud.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentCrudController } from './student-crud.controller';
import { StudentService } from '../student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { StudentFilterDto } from '../dto/student-filter.dto';
import { Student } from '@/database';

describe('StudentCrudController', () => {
  let controller: StudentCrudController;
  let studentService: jest.Mocked<StudentService>;

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
    const mockStudentService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentCrudController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentCrudController>(StudentCrudController);
    studentService = module.get(StudentService);
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

      studentService.create.mockResolvedValue(mockStudent as Student);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockStudent);
      expect(studentService.create).toHaveBeenCalledWith(createDto);
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

      studentService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createDto)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should return paginated students with default filters', async () => {
      const filterDto: StudentFilterDto = {};
      const mockResponse = {
        data: [mockStudent],
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      };

      studentService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should apply search filter', async () => {
      const filterDto: StudentFilterDto = { search: 'john' };
      const mockResponse = {
        data: [mockStudent],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      studentService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should apply grade filter', async () => {
      const filterDto: StudentFilterDto = { grade: '10' };
      const mockResponse = {
        data: [mockStudent],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      studentService.findAll.mockResolvedValue(mockResponse);

      await controller.findAll(filterDto);

      expect(studentService.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should handle pagination parameters', async () => {
      const filterDto: StudentFilterDto = { page: 2, limit: 10 };
      const mockResponse = {
        data: [mockStudent],
        meta: { page: 2, limit: 10, total: 25, pages: 3 },
      };

      studentService.findAll.mockResolvedValue(mockResponse);

      const result = await controller.findAll(filterDto);

      expect(result.meta.page).toBe(2);
      expect(result.meta.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a single student by ID', async () => {
      const studentId = mockStudent.id as string;
      studentService.findOne.mockResolvedValue(mockStudent as Student);

      const result = await controller.findOne(studentId);

      expect(result).toEqual(mockStudent);
      expect(studentService.findOne).toHaveBeenCalledWith(studentId);
    });

    it('should handle student not found', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174999';
      studentService.findOne.mockRejectedValue(new Error('Student not found'));

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
      studentService.update.mockResolvedValue(updatedStudent as Student);

      const result = await controller.update(studentId, updateDto);

      expect(result).toEqual(updatedStudent);
      expect(studentService.update).toHaveBeenCalledWith(studentId, updateDto);
    });

    it('should handle partial updates', async () => {
      const studentId = mockStudent.id as string;
      const updateDto: UpdateStudentDto = { grade: '11' };

      studentService.update.mockResolvedValue(mockStudent as Student);

      await controller.update(studentId, updateDto);

      expect(studentService.update).toHaveBeenCalledWith(studentId, updateDto);
    });

    it('should handle update errors', async () => {
      const studentId = mockStudent.id as string;
      const updateDto: UpdateStudentDto = { grade: '11' };

      studentService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(studentId, updateDto)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should soft delete student successfully', async () => {
      const studentId = mockStudent.id as string;
      studentService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(studentId);

      expect(result).toBeUndefined();
      expect(studentService.remove).toHaveBeenCalledWith(studentId);
    });

    it('should handle deletion errors', async () => {
      const studentId = mockStudent.id as string;
      studentService.remove.mockRejectedValue(new Error('Deletion failed'));

      await expect(controller.remove(studentId)).rejects.toThrow('Deletion failed');
    });
  });
});
