/**
 * @fileoverview Student Academic Controller Tests
 * @module student/controllers/student-academic.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentAcademicController } from './student-academic.controller';
import { StudentService } from '../student.service';
import { ImportTranscriptDto } from '../dto/import-transcript.dto';
import { AcademicHistoryDto } from '../dto/academic-history.dto';
import { PerformanceTrendsDto } from '../dto/performance-trends.dto';

describe('StudentAcademicController', () => {
  let controller: StudentAcademicController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const mockStudentService = {
      importAcademicTranscript: jest.fn(),
      getAcademicHistory: jest.fn(),
      getPerformanceTrends: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentAcademicController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentAcademicController>(StudentAcademicController);
    studentService = module.get(StudentService);
  });

  describe('importTranscript', () => {
    it('should import academic transcript successfully', async () => {
      const importDto: ImportTranscriptDto = {
        academicYear: '2023-2024',
        grades: [
          { courseName: 'Math', grade: 'A', numericGrade: 95, credits: 3 },
        ],
        totalCredits: 3,
        daysPresent: 170,
        daysAbsent: 10,
      };

      const mockResponse = {
        success: true,
        studentId: mockStudentId,
        transcript: { id: 'transcript-1', gpa: 3.8 },
      };

      studentService.importAcademicTranscript.mockResolvedValue(mockResponse);

      const result = await controller.importTranscript(mockStudentId, importDto);

      expect(result).toEqual(mockResponse);
      expect(studentService.importAcademicTranscript).toHaveBeenCalledWith(mockStudentId, importDto);
    });
  });

  describe('getAcademicHistory', () => {
    it('should retrieve academic history successfully', async () => {
      const query: AcademicHistoryDto = { academicYear: '2023-2024' };
      const mockHistory = {
        success: true,
        transcripts: [{ academicYear: '2023-2024', gpa: 3.5 }],
        summary: { averageGPA: 3.5, totalTranscripts: 1 },
      };

      studentService.getAcademicHistory.mockResolvedValue(mockHistory);

      const result = await controller.getAcademicHistory(mockStudentId, query);

      expect(result).toEqual(mockHistory);
      expect(studentService.getAcademicHistory).toHaveBeenCalledWith(mockStudentId, query);
    });
  });

  describe('getPerformanceTrends', () => {
    it('should analyze performance trends successfully', async () => {
      const query: PerformanceTrendsDto = { yearsToAnalyze: 3 };
      const mockTrends = {
        success: true,
        gpa: { trend: 'improving', change: 0.3 },
        attendance: { trend: 'stable' },
      };

      studentService.getPerformanceTrends.mockResolvedValue(mockTrends);

      const result = await controller.getPerformanceTrends(mockStudentId, query);

      expect(result).toEqual(mockTrends);
      expect(studentService.getPerformanceTrends).toHaveBeenCalledWith(mockStudentId, query);
    });
  });
});
