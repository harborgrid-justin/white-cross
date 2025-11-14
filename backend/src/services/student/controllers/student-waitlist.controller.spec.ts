/**
 * @fileoverview Student Waitlist Controller Tests
 * @module student/controllers/student-waitlist.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentWaitlistController } from './student-waitlist.controller';
import { StudentService } from '../student.service';
import { AddWaitlistDto } from '../dto/add-waitlist.dto';
import { WaitlistPriorityDto } from '../dto/waitlist-priority.dto';

describe('StudentWaitlistController', () => {
  let controller: StudentWaitlistController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  const mockWaitlistResponse = {
    success: true,
    studentId: mockStudentId,
    position: 5,
    priority: 'normal',
    estimatedWaitDays: 30,
  };

  beforeEach(async () => {
    const mockStudentService = {
      addStudentToWaitlist: jest.fn(),
      updateWaitlistPriority: jest.fn(),
      admitStudentFromWaitlist: jest.fn(),
      removeStudentFromWaitlist: jest.fn(),
      getStudentWaitlistStatus: jest.fn(),
      getWaitlistOverview: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentWaitlistController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentWaitlistController>(StudentWaitlistController);
    studentService = module.get(StudentService);
  });

  describe('addToWaitlist', () => {
    it('should add student to waitlist successfully', async () => {
      const addDto: AddWaitlistDto = {
        priority: 'normal',
        reason: 'School at capacity',
        gradeRequested: '9',
      };

      studentService.addStudentToWaitlist.mockResolvedValue(mockWaitlistResponse);

      const result = await controller.addToWaitlist(mockStudentId, addDto);

      expect(result).toEqual(mockWaitlistResponse);
      expect(studentService.addStudentToWaitlist).toHaveBeenCalledWith(mockStudentId, addDto);
    });

    it('should pass through service errors', async () => {
      const addDto: AddWaitlistDto = {
        priority: 'normal',
        reason: 'Capacity',
        gradeRequested: '9',
      };

      studentService.addStudentToWaitlist.mockRejectedValue(new Error('Waitlist error'));

      await expect(controller.addToWaitlist(mockStudentId, addDto)).rejects.toThrow(
        'Waitlist error',
      );
    });
  });

  describe('updateWaitlistPriority', () => {
    it('should update waitlist priority successfully', async () => {
      const priorityDto: WaitlistPriorityDto = {
        priority: 'high',
        reason: 'Sibling enrolled',
      };

      const mockResponse = { ...mockWaitlistResponse, priority: 'high', position: 2 };
      studentService.updateWaitlistPriority.mockResolvedValue(mockResponse);

      const result = await controller.updateWaitlistPriority(mockStudentId, priorityDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.updateWaitlistPriority).toHaveBeenCalledWith(mockStudentId, priorityDto);
    });

    it('should handle priority update errors', async () => {
      const priorityDto: WaitlistPriorityDto = {
        priority: 'high',
        reason: 'Test',
      };

      studentService.updateWaitlistPriority.mockRejectedValue(new Error('Update failed'));

      await expect(controller.updateWaitlistPriority(mockStudentId, priorityDto)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('admitFromWaitlist', () => {
    it('should admit student from waitlist successfully', async () => {
      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        enrollmentDate: new Date(),
        previousPosition: 5,
      };

      studentService.admitStudentFromWaitlist.mockResolvedValue(mockResponse);

      const result = await controller.admitFromWaitlist(mockStudentId);

      expect(result).toEqual(mockResponse);
      expect(studentService.admitStudentFromWaitlist).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle admission errors', async () => {
      studentService.admitStudentFromWaitlist.mockRejectedValue(new Error('Admission failed'));

      await expect(controller.admitFromWaitlist(mockStudentId)).rejects.toThrow('Admission failed');
    });
  });

  describe('removeFromWaitlist', () => {
    it('should remove student from waitlist successfully', async () => {
      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        removedAt: new Date(),
      };

      studentService.removeStudentFromWaitlist.mockResolvedValue(mockResponse);

      const result = await controller.removeFromWaitlist(mockStudentId);

      expect(result).toEqual(mockResponse);
      expect(studentService.removeStudentFromWaitlist).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle removal errors', async () => {
      studentService.removeStudentFromWaitlist.mockRejectedValue(new Error('Removal failed'));

      await expect(controller.removeFromWaitlist(mockStudentId)).rejects.toThrow('Removal failed');
    });
  });

  describe('getWaitlistStatus', () => {
    it('should retrieve waitlist status successfully', async () => {
      studentService.getStudentWaitlistStatus.mockResolvedValue(mockWaitlistResponse);

      const result = await controller.getWaitlistStatus(mockStudentId);

      expect(result).toEqual(mockWaitlistResponse);
      expect(studentService.getStudentWaitlistStatus).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle status retrieval errors', async () => {
      studentService.getStudentWaitlistStatus.mockRejectedValue(new Error('Status not found'));

      await expect(controller.getWaitlistStatus(mockStudentId)).rejects.toThrow('Status not found');
    });
  });

  describe('getWaitlistOverview', () => {
    it('should retrieve waitlist overview successfully', async () => {
      const mockOverview = {
        total: 50,
        byGrade: { '9': 15, '10': 20, '11': 10, '12': 5 },
        byPriority: { high: 10, normal: 35, low: 5 },
        averageWaitDays: 25,
      };

      studentService.getWaitlistOverview.mockResolvedValue(mockOverview);

      const result = await controller.getWaitlistOverview();

      expect(result).toEqual(mockOverview);
      expect(studentService.getWaitlistOverview).toHaveBeenCalledWith(undefined);
    });

    it('should filter overview by grade when provided', async () => {
      const mockOverview = {
        total: 15,
        byGrade: { '9': 15 },
        byPriority: { high: 3, normal: 10, low: 2 },
        averageWaitDays: 20,
      };

      studentService.getWaitlistOverview.mockResolvedValue(mockOverview);

      const result = await controller.getWaitlistOverview('9');

      expect(result).toEqual(mockOverview);
      expect(studentService.getWaitlistOverview).toHaveBeenCalledWith('9');
    });

    it('should handle overview retrieval errors', async () => {
      studentService.getWaitlistOverview.mockRejectedValue(new Error('Overview failed'));

      await expect(controller.getWaitlistOverview()).rejects.toThrow('Overview failed');
    });
  });
});
