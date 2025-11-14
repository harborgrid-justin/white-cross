/**
 * @fileoverview Student Status Controller Tests
 * @module student/controllers/student-status.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentStatusController } from './student-status.controller';
import { StudentStatusService } from '../services/student-status.service';
import { TransferStudentDto } from '../dto/transfer-student.dto';
import { Student } from '@/database';

describe('StudentStatusController', () => {
  let controller: StudentStatusController;
  let statusService: jest.Mocked<StudentStatusService>;

  const mockStudent: Partial<Student> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    isActive: true,
    schoolId: '123e4567-e89b-12d3-a456-426614174001',
  };

  beforeEach(async () => {
    const mockStatusService = {
      deactivate: jest.fn(),
      reactivate: jest.fn(),
      transfer: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentStatusController],
      providers: [
        {
          provide: StudentStatusService,
          useValue: mockStatusService,
        },
      ],
    }).compile();

    controller = module.get<StudentStatusController>(StudentStatusController);
    statusService = module.get(StudentStatusService);
  });

  describe('deactivate', () => {
    it('should deactivate student successfully', async () => {
      const studentId = mockStudent.id as string;
      const deactivatedStudent = { ...mockStudent, isActive: false };
      statusService.deactivate.mockResolvedValue(deactivatedStudent as Student);

      const result = await controller.deactivate(studentId);

      expect(result).toEqual(deactivatedStudent);
      expect(result.isActive).toBe(false);
      expect(statusService.deactivate).toHaveBeenCalledWith(studentId, undefined);
    });

    it('should deactivate student with reason', async () => {
      const studentId = mockStudent.id as string;
      const reason = 'Graduated';
      const deactivatedStudent = { ...mockStudent, isActive: false };
      statusService.deactivate.mockResolvedValue(deactivatedStudent as Student);

      const result = await controller.deactivate(studentId, reason);

      expect(result).toEqual(deactivatedStudent);
      expect(statusService.deactivate).toHaveBeenCalledWith(studentId, reason);
    });

    it('should handle deactivation errors', async () => {
      const studentId = mockStudent.id as string;
      statusService.deactivate.mockRejectedValue(new Error('Deactivation failed'));

      await expect(controller.deactivate(studentId)).rejects.toThrow('Deactivation failed');
    });
  });

  describe('reactivate', () => {
    it('should reactivate student successfully', async () => {
      const studentId = mockStudent.id as string;
      const reactivatedStudent = { ...mockStudent, isActive: true };
      statusService.reactivate.mockResolvedValue(reactivatedStudent as Student);

      const result = await controller.reactivate(studentId);

      expect(result).toEqual(reactivatedStudent);
      expect(result.isActive).toBe(true);
      expect(statusService.reactivate).toHaveBeenCalledWith(studentId);
    });

    it('should handle reactivation errors', async () => {
      const studentId = mockStudent.id as string;
      statusService.reactivate.mockRejectedValue(new Error('Reactivation failed'));

      await expect(controller.reactivate(studentId)).rejects.toThrow('Reactivation failed');
    });
  });

  describe('transfer', () => {
    it('should transfer student to another school', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newSchoolId: '123e4567-e89b-12d3-a456-426614174999',
        transferDate: '2024-01-15',
        reason: 'Family relocation',
      };

      const transferredStudent = {
        ...mockStudent,
        schoolId: transferDto.newSchoolId,
      };
      statusService.transfer.mockResolvedValue(transferredStudent as Student);

      const result = await controller.transfer(studentId, transferDto);

      expect(result).toEqual(transferredStudent);
      expect(result.schoolId).toBe(transferDto.newSchoolId);
      expect(statusService.transfer).toHaveBeenCalledWith(studentId, transferDto);
    });

    it('should handle transfer with nurse reassignment', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newSchoolId: '123e4567-e89b-12d3-a456-426614174999',
        newNurseId: '123e4567-e89b-12d3-a456-426614174888',
        transferDate: '2024-01-15',
        reason: 'School transfer with nurse change',
      };

      const transferredStudent = {
        ...mockStudent,
        schoolId: transferDto.newSchoolId,
        nurseId: transferDto.newNurseId,
      };
      statusService.transfer.mockResolvedValue(transferredStudent as Student);

      const result = await controller.transfer(studentId, transferDto);

      expect(result.schoolId).toBe(transferDto.newSchoolId);
      expect(result.nurseId).toBe(transferDto.newNurseId);
    });

    it('should validate transfer DTO', async () => {
      const studentId = mockStudent.id as string;
      const invalidDto = {} as TransferStudentDto;

      statusService.transfer.mockRejectedValue(new Error('Validation failed'));

      await expect(controller.transfer(studentId, invalidDto)).rejects.toThrow('Validation failed');
    });

    it('should handle transfer errors', async () => {
      const studentId = mockStudent.id as string;
      const transferDto: TransferStudentDto = {
        newSchoolId: '123e4567-e89b-12d3-a456-426614174999',
        transferDate: '2024-01-15',
        reason: 'Transfer',
      };

      statusService.transfer.mockRejectedValue(new Error('Transfer failed'));

      await expect(controller.transfer(studentId, transferDto)).rejects.toThrow('Transfer failed');
    });
  });
});
