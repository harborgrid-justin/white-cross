/**
 * @fileoverview Student Management Controller Tests
 * @module student/controllers/student-management.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentManagementController } from './student-management.controller';
import { StudentService } from '../student.service';
import { TransferStudentDto } from '../dto/transfer-student.dto';
import { StudentBulkUpdateDto } from '../dto/bulk-update.dto';
import { Student } from '@/database';

describe('StudentManagementController', () => {
  let controller: StudentManagementController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudent: Partial<Student> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    isActive: true,
    nurseId: null,
  };

  beforeEach(async () => {
    const mockStudentService = {
      deactivate: jest.fn(),
      reactivate: jest.fn(),
      transfer: jest.fn(),
      bulkUpdate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentManagementController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentManagementController>(StudentManagementController);
    studentService = module.get(StudentService);
  });

  describe('deactivate', () => {
    it('should deactivate student successfully', async () => {
      const studentId = mockStudent.id as string;
      const deactivatedStudent = { ...mockStudent, isActive: false };
      studentService.deactivate.mockResolvedValue(deactivatedStudent as Student);

      const result = await controller.deactivate(studentId);

      expect(result).toEqual(deactivatedStudent);
      expect(studentService.deactivate).toHaveBeenCalledWith(studentId, undefined);
    });

    it('should deactivate student with reason', async () => {
      const studentId = mockStudent.id as string;
      const reason = 'Transferred to another school';
      const deactivatedStudent = { ...mockStudent, isActive: false };
      studentService.deactivate.mockResolvedValue(deactivatedStudent as Student);

      const result = await controller.deactivate(studentId, reason);

      expect(result).toEqual(deactivatedStudent);
      expect(studentService.deactivate).toHaveBeenCalledWith(studentId, reason);
    });

    it('should handle deactivation errors', async () => {
      const studentId = mockStudent.id as string;
      studentService.deactivate.mockRejectedValue(new Error('Deactivation failed'));

      await expect(controller.deactivate(studentId)).rejects.toThrow('Deactivation failed');
    });
  });

  describe('reactivate', () => {
    it('should reactivate student successfully', async () => {
      const studentId = mockStudent.id as string;
      const reactivatedStudent = { ...mockStudent, isActive: true };
      studentService.reactivate.mockResolvedValue(reactivatedStudent as Student);

      const result = await controller.reactivate(studentId);

      expect(result).toEqual(reactivatedStudent);
      expect(studentService.reactivate).toHaveBeenCalledWith(studentId);
    });

    it('should handle reactivation errors', async () => {
      const studentId = mockStudent.id as string;
      studentService.reactivate.mockRejectedValue(new Error('Reactivation failed'));

      await expect(controller.reactivate(studentId)).rejects.toThrow('Reactivation failed');
    });
  });

  describe('transfer', () => {
    it('should transfer student to new nurse', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newNurseId: '123e4567-e89b-12d3-a456-426614174001',
        transferDate: '2024-01-15',
        reason: 'Caseload balancing',
      };

      const transferredStudent = { ...mockStudent, nurseId: transferDto.newNurseId };
      studentService.transfer.mockResolvedValue(transferredStudent as Student);

      const result = await controller.transfer(studentId, transferDto);

      expect(result).toEqual(transferredStudent);
      expect(studentService.transfer).toHaveBeenCalledWith(studentId, transferDto);
    });

    it('should transfer student to new grade', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newGrade: '11',
        transferDate: '2024-06-01',
        reason: 'Grade advancement',
      };

      const transferredStudent = { ...mockStudent, grade: '11' };
      studentService.transfer.mockResolvedValue(transferredStudent as Student);

      const result = await controller.transfer(studentId, transferDto);

      expect(result).toEqual(transferredStudent);
      expect(studentService.transfer).toHaveBeenCalledWith(studentId, transferDto);
    });

    it('should transfer student to both new nurse and grade', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newNurseId: '123e4567-e89b-12d3-a456-426614174001',
        newGrade: '11',
        transferDate: '2024-06-01',
        reason: 'Promotion and reassignment',
      };

      const transferredStudent = {
        ...mockStudent,
        nurseId: transferDto.newNurseId,
        grade: '11',
      };
      studentService.transfer.mockResolvedValue(transferredStudent as Student);

      const result = await controller.transfer(studentId, transferDto);

      expect(result).toEqual(transferredStudent);
      expect(studentService.transfer).toHaveBeenCalledWith(studentId, transferDto);
    });

    it('should handle transfer errors', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newNurseId: '123e4567-e89b-12d3-a456-426614174001',
        transferDate: '2024-01-15',
        reason: 'Transfer',
      };

      studentService.transfer.mockRejectedValue(new Error('Transfer failed'));

      await expect(controller.transfer(studentId, transferDto)).rejects.toThrow('Transfer failed');
    });
  });

  describe('bulkUpdate', () => {
    it('should bulk update students by nurse assignment', async () => {
      const bulkDto: StudentBulkUpdateDto = {
        studentIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174001',
        ],
        updates: {
          nurseId: '123e4567-e89b-12d3-a456-426614174002',
        },
      };

      const mockResponse = { updated: 2 };
      studentService.bulkUpdate.mockResolvedValue(mockResponse);

      const result = await controller.bulkUpdate(bulkDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.bulkUpdate).toHaveBeenCalledWith(bulkDto);
    });

    it('should bulk update students by grade', async () => {
      const bulkDto: StudentBulkUpdateDto = {
        studentIds: ['123e4567-e89b-12d3-a456-426614174000'],
        updates: {
          grade: '11',
        },
      };

      const mockResponse = { updated: 1 };
      studentService.bulkUpdate.mockResolvedValue(mockResponse);

      const result = await controller.bulkUpdate(bulkDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.bulkUpdate).toHaveBeenCalledWith(bulkDto);
    });

    it('should bulk update student active status', async () => {
      const bulkDto: StudentBulkUpdateDto = {
        studentIds: [
          '123e4567-e89b-12d3-a456-426614174000',
          '123e4567-e89b-12d3-a456-426614174001',
          '123e4567-e89b-12d3-a456-426614174002',
        ],
        updates: {
          isActive: false,
        },
      };

      const mockResponse = { updated: 3 };
      studentService.bulkUpdate.mockResolvedValue(mockResponse);

      const result = await controller.bulkUpdate(bulkDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.bulkUpdate).toHaveBeenCalledWith(bulkDto);
    });

    it('should handle empty student IDs array', async () => {
      const bulkDto: StudentBulkUpdateDto = {
        studentIds: [],
        updates: { grade: '10' },
      };

      const mockResponse = { updated: 0 };
      studentService.bulkUpdate.mockResolvedValue(mockResponse);

      const result = await controller.bulkUpdate(bulkDto);

      expect(result.updated).toBe(0);
    });

    it('should handle bulk update errors', async () => {
      const bulkDto: StudentBulkUpdateDto = {
        studentIds: ['123e4567-e89b-12d3-a456-426614174000'],
        updates: { grade: '11' },
      };

      studentService.bulkUpdate.mockRejectedValue(new Error('Bulk update failed'));

      await expect(controller.bulkUpdate(bulkDto)).rejects.toThrow('Bulk update failed');
    });
  });
});
