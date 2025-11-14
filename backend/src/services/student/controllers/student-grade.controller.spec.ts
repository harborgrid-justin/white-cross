/**
 * @fileoverview Student Grade Controller Tests
 * @module student/controllers/student-grade.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentGradeController } from './student-grade.controller';
import { StudentService } from '../student.service';
import { GradeTransitionDto } from '../dto/grade-transition.dto';
import { GraduationDto } from '../dto/graduation.dto';

describe('StudentGradeController', () => {
  let controller: StudentGradeController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  const mockAdvancementResponse = {
    success: true,
    studentId: mockStudentId,
    studentName: 'John Doe',
    previousGrade: '10',
    newGrade: '11',
    effectiveDate: new Date('2024-06-01'),
    reason: 'Promotion',
  };

  beforeEach(async () => {
    const mockStudentService = {
      advanceStudentGrade: jest.fn(),
      retainStudentGrade: jest.fn(),
      processStudentGraduation: jest.fn(),
      getGradeTransitionHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentGradeController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentGradeController>(StudentGradeController);
    studentService = module.get(StudentService);
  });

  describe('advanceGrade', () => {
    it('should advance student to next grade successfully', async () => {
      const gradeDto: GradeTransitionDto = {
        newGrade: '11',
        effectiveDate: '2024-06-01',
        reason: 'Academic promotion',
      };

      studentService.advanceStudentGrade.mockResolvedValue(mockAdvancementResponse);

      const result = await controller.advanceGrade(mockStudentId, gradeDto);

      expect(result).toEqual(mockAdvancementResponse);
      expect(result.success).toBe(true);
      expect(result.newGrade).toBe('11');
      expect(studentService.advanceStudentGrade).toHaveBeenCalledWith(mockStudentId, gradeDto);
    });

    it('should handle grade advancement with custom effective date', async () => {
      const gradeDto: GradeTransitionDto = {
        newGrade: '12',
        effectiveDate: '2024-09-01',
        reason: 'Start of new school year',
      };

      const mockResponse = {
        ...mockAdvancementResponse,
        newGrade: '12',
        previousGrade: '11',
      };
      studentService.advanceStudentGrade.mockResolvedValue(mockResponse);

      const result = await controller.advanceGrade(mockStudentId, gradeDto);

      expect(result.newGrade).toBe('12');
      expect(result.previousGrade).toBe('11');
    });

    it('should handle advancement errors', async () => {
      const gradeDto: GradeTransitionDto = {
        newGrade: '11',
        effectiveDate: '2024-06-01',
        reason: 'Promotion',
      };

      studentService.advanceStudentGrade.mockRejectedValue(new Error('Advancement failed'));

      await expect(controller.advanceGrade(mockStudentId, gradeDto)).rejects.toThrow(
        'Advancement failed',
      );
    });
  });

  describe('retainGrade', () => {
    it('should retain student in current grade successfully', async () => {
      const gradeDto: GradeTransitionDto = {
        newGrade: '10',
        effectiveDate: '2024-06-01',
        reason: 'Academic performance requires additional support',
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        studentName: 'John Doe',
        grade: '10',
        effectiveDate: new Date('2024-06-01'),
        reason: gradeDto.reason,
        action: 'retained',
      };

      studentService.retainStudentGrade.mockResolvedValue(mockResponse);

      const result = await controller.retainGrade(mockStudentId, gradeDto);

      expect(result).toEqual(mockResponse);
      expect(result.action).toBe('retained');
      expect(result.grade).toBe('10');
      expect(studentService.retainStudentGrade).toHaveBeenCalledWith(mockStudentId, gradeDto);
    });

    it('should handle retention errors', async () => {
      const gradeDto: GradeTransitionDto = {
        newGrade: '10',
        effectiveDate: '2024-06-01',
        reason: 'Retention',
      };

      studentService.retainStudentGrade.mockRejectedValue(new Error('Retention failed'));

      await expect(controller.retainGrade(mockStudentId, gradeDto)).rejects.toThrow(
        'Retention failed',
      );
    });
  });

  describe('graduateStudent', () => {
    it('should process student graduation successfully', async () => {
      const graduationDto: GraduationDto = {
        graduationDate: '2024-06-15',
        diplomaNumber: 'DIPL-2024-001',
        honors: 'Summa Cum Laude',
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        studentName: 'John Doe',
        graduationDate: new Date('2024-06-15'),
        diplomaNumber: 'DIPL-2024-001',
        honors: 'Summa Cum Laude',
      };

      studentService.processStudentGraduation.mockResolvedValue(mockResponse);

      const result = await controller.graduateStudent(mockStudentId, graduationDto);

      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.diplomaNumber).toBe('DIPL-2024-001');
      expect(studentService.processStudentGraduation).toHaveBeenCalledWith(
        mockStudentId,
        graduationDto,
      );
    });

    it('should handle graduation without honors', async () => {
      const graduationDto: GraduationDto = {
        graduationDate: '2024-06-15',
        diplomaNumber: 'DIPL-2024-002',
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        studentName: 'Jane Smith',
        graduationDate: new Date('2024-06-15'),
        diplomaNumber: 'DIPL-2024-002',
        honors: undefined,
      };

      studentService.processStudentGraduation.mockResolvedValue(mockResponse);

      const result = await controller.graduateStudent(mockStudentId, graduationDto);

      expect(result.honors).toBeUndefined();
    });

    it('should handle graduation errors', async () => {
      const graduationDto: GraduationDto = {
        graduationDate: '2024-06-15',
        diplomaNumber: 'DIPL-2024-001',
      };

      studentService.processStudentGraduation.mockRejectedValue(
        new Error('Graduation processing failed'),
      );

      await expect(controller.graduateStudent(mockStudentId, graduationDto)).rejects.toThrow(
        'Graduation processing failed',
      );
    });
  });

  describe('getGradeHistory', () => {
    it('should retrieve grade transition history successfully', async () => {
      const mockHistory = {
        success: true,
        studentId: mockStudentId,
        studentName: 'John Doe',
        currentGrade: '11',
        history: [
          {
            date: new Date('2020-09-01'),
            action: 'enrolled',
            grade: '9',
            reason: 'Initial enrollment',
          },
          {
            date: new Date('2021-06-15'),
            action: 'promoted',
            grade: '10',
            reason: 'Academic advancement',
          },
          {
            date: new Date('2022-06-15'),
            action: 'promoted',
            grade: '11',
            reason: 'Academic advancement',
          },
        ],
      };

      studentService.getGradeTransitionHistory.mockResolvedValue(mockHistory);

      const result = await controller.getGradeHistory(mockStudentId);

      expect(result).toEqual(mockHistory);
      expect(result.history).toHaveLength(3);
      expect(result.currentGrade).toBe('11');
      expect(studentService.getGradeTransitionHistory).toHaveBeenCalledWith(mockStudentId);
    });

    it('should handle history with retention', async () => {
      const mockHistory = {
        success: true,
        studentId: mockStudentId,
        studentName: 'Jane Smith',
        currentGrade: '10',
        history: [
          {
            date: new Date('2020-09-01'),
            action: 'enrolled',
            grade: '9',
            reason: 'Initial enrollment',
          },
          {
            date: new Date('2021-06-15'),
            action: 'retained',
            grade: '9',
            reason: 'Academic support needed',
          },
          {
            date: new Date('2022-06-15'),
            action: 'promoted',
            grade: '10',
            reason: 'Academic improvement',
          },
        ],
      };

      studentService.getGradeTransitionHistory.mockResolvedValue(mockHistory);

      const result = await controller.getGradeHistory(mockStudentId);

      expect(result.history.some((h: { action: string }) => h.action === 'retained')).toBe(true);
    });

    it('should handle errors when retrieving history', async () => {
      studentService.getGradeTransitionHistory.mockRejectedValue(new Error('History not found'));

      await expect(controller.getGradeHistory(mockStudentId)).rejects.toThrow('History not found');
    });
  });
});
