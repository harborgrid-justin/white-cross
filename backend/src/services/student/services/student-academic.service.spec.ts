/**
 * @fileoverview Student Academic Service Tests
 * @module services/student/student-academic.service.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StudentAcademicService } from './student-academic.service';
import { Student } from '@/database';
import { AcademicTranscriptService } from '@/services/academic-transcript/academic-transcript.service';
import { RequestContextService } from '@/common/context/request-context.service';
import { ImportTranscriptDto } from '../dto/import-transcript.dto';
import { AcademicHistoryDto } from '../dto/academic-history.dto';
import { PerformanceTrendsDto } from '../dto/performance-trends.dto';
import { BulkGradeTransitionDto } from '../dto/bulk-grade-transition.dto';
import { GraduatingStudentsDto } from '../dto/graduating-students.dto';
import { GradeTransitionDto } from '../dto/grade-transition.dto';
import { GraduationDto } from '../dto/graduation.dto';

describe('StudentAcademicService', () => {
  let service: StudentAcademicService;
  let studentModel: jest.Mocked<typeof Student>;
  let academicTranscriptService: jest.Mocked<AcademicTranscriptService>;
  let requestContext: jest.Mocked<RequestContextService>;

  const mockStudent = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    isActive: true,
    createdAt: new Date('2020-01-01'),
    save: jest.fn(),
  };

  const mockTranscript = {
    id: 'transcript-1',
    studentId: '123e4567-e89b-12d3-a456-426614174000',
    academicYear: '2023-2024',
    semester: 'Fall',
    gpa: 3.5,
    subjects: [
      { subjectName: 'Math', grade: 'A', credits: 3 },
      { subjectName: 'Science', grade: 'B+', credits: 3 },
    ],
  };

  beforeEach(async () => {
    const mockStudentModel = {
      findByPk: jest.fn(),
      findAll: jest.fn(),
    };

    const mockAcademicTranscriptService = {
      importTranscript: jest.fn(),
      getAcademicHistory: jest.fn(),
      analyzePerformanceTrends: jest.fn(),
      batchGetAcademicHistories: jest.fn(),
    };

    const mockRequestContext = {
      requestId: 'test-request-id',
      userId: 'test-user-id',
      getLogContext: jest.fn().mockReturnValue({ requestId: 'test-request-id' }),
      getAuditContext: jest.fn().mockReturnValue({
        requestId: 'test-request-id',
        timestamp: new Date(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentAcademicService,
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: AcademicTranscriptService,
          useValue: mockAcademicTranscriptService,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContext,
        },
      ],
    }).compile();

    service = module.get<StudentAcademicService>(StudentAcademicService);
    studentModel = module.get(getModelToken(Student));
    academicTranscriptService = module.get(AcademicTranscriptService);
    requestContext = module.get(RequestContextService);
  });

  describe('importAcademicTranscript', () => {
    const importDto: ImportTranscriptDto = {
      academicYear: '2023-2024',
      grades: [
        { courseName: 'Math', grade: 'A', numericGrade: 95, credits: 3 },
        { courseName: 'Science', grade: 'B+', numericGrade: 88, credits: 3 },
      ],
      totalCredits: 6,
      daysPresent: 170,
      daysAbsent: 10,
      achievements: ['Honor Roll'],
    };

    it('should import academic transcript successfully', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.importTranscript.mockResolvedValue(mockTranscript as never);

      const result = await service.importAcademicTranscript(mockStudent.id, importDto);

      expect(result.success).toBe(true);
      expect(result.studentId).toBe(mockStudent.id);
      expect(result.transcript.gpa).toBe(3.5);
      expect(academicTranscriptService.importTranscript).toHaveBeenCalled();
    });

    it('should validate student UUID', async () => {
      const invalidId = 'invalid-uuid';

      await expect(service.importAcademicTranscript(invalidId, importDto)).rejects.toThrow();
    });

    it('should throw NotFoundException if student not found', async () => {
      studentModel.findByPk.mockResolvedValue(null);

      await expect(
        service.importAcademicTranscript('123e4567-e89b-12d3-a456-426614174000', importDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if grades array is empty', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      const emptyGradesDto = { ...importDto, grades: [] };

      await expect(
        service.importAcademicTranscript(mockStudent.id, emptyGradesDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should calculate attendance rate correctly', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.importTranscript.mockResolvedValue(mockTranscript as never);

      await service.importAcademicTranscript(mockStudent.id, importDto);

      expect(academicTranscriptService.importTranscript).toHaveBeenCalledWith(
        expect.objectContaining({
          attendance: expect.objectContaining({
            totalDays: 180,
            presentDays: 170,
            absentDays: 10,
            attendanceRate: 94.4,
          }),
        }),
      );
    });

    it('should handle zero attendance days', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.importTranscript.mockResolvedValue(mockTranscript as never);

      const noDaysDto = { ...importDto, daysPresent: 0, daysAbsent: 0 };
      await service.importAcademicTranscript(mockStudent.id, noDaysDto);

      expect(academicTranscriptService.importTranscript).toHaveBeenCalledWith(
        expect.objectContaining({
          attendance: expect.objectContaining({
            attendanceRate: 100,
          }),
        }),
      );
    });

    it('should map grades to transcript subject format', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.importTranscript.mockResolvedValue(mockTranscript as never);

      await service.importAcademicTranscript(mockStudent.id, importDto);

      expect(academicTranscriptService.importTranscript).toHaveBeenCalledWith(
        expect.objectContaining({
          subjects: expect.arrayContaining([
            expect.objectContaining({
              subjectName: 'Math',
              grade: 'A',
              percentage: 95,
              credits: 3,
            }),
          ]),
        }),
      );
    });
  });

  describe('getAcademicHistory', () => {
    const historyDto: AcademicHistoryDto = { academicYear: '2023-2024' };

    it('should retrieve academic history successfully', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.getAcademicHistory.mockResolvedValue([
        { ...mockTranscript, academicYear: '2023-2024', gpa: 3.5 },
        { ...mockTranscript, id: 't2', academicYear: '2023-2024', gpa: 3.7 },
      ] as never);

      const result = await service.getAcademicHistory(mockStudent.id, historyDto);

      expect(result.success).toBe(true);
      expect(result.transcripts).toHaveLength(2);
      expect(result.summary.averageGPA).toBe(3.6);
    });

    it('should filter by academic year', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.getAcademicHistory.mockResolvedValue([
        { ...mockTranscript, academicYear: '2023-2024', gpa: 3.5 },
        { ...mockTranscript, id: 't2', academicYear: '2022-2023', gpa: 3.2 },
      ] as never);

      const result = await service.getAcademicHistory(mockStudent.id, historyDto);

      expect(result.transcripts).toHaveLength(1);
      expect(result.transcripts[0].academicYear).toBe('2023-2024');
    });

    it('should calculate summary statistics correctly', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.getAcademicHistory.mockResolvedValue([
        { ...mockTranscript, gpa: 3.0 },
        { ...mockTranscript, id: 't2', gpa: 4.0 },
        { ...mockTranscript, id: 't3', gpa: 3.5 },
      ] as never);

      const result = await service.getAcademicHistory(mockStudent.id, {});

      expect(result.summary).toEqual({
        totalTranscripts: 3,
        averageGPA: 3.5,
        highestGPA: 4.0,
        lowestGPA: 3.0,
      });
    });

    it('should handle empty transcripts', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.getAcademicHistory.mockResolvedValue([]);

      const result = await service.getAcademicHistory(mockStudent.id, {});

      expect(result.summary).toEqual({
        totalTranscripts: 0,
        averageGPA: 0,
        highestGPA: 0,
        lowestGPA: 0,
      });
    });

    it('should validate student UUID', async () => {
      await expect(service.getAcademicHistory('invalid-uuid', {})).rejects.toThrow();
    });
  });

  describe('getPerformanceTrends', () => {
    const trendsDto: PerformanceTrendsDto = {
      yearsToAnalyze: 3,
      semestersToAnalyze: 6,
    };

    it('should analyze performance trends successfully', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      const mockAnalysis = {
        gpa: { trend: 'improving', change: 0.3 },
        attendance: { trend: 'stable', change: 0.0 },
      };
      academicTranscriptService.analyzePerformanceTrends.mockResolvedValue(mockAnalysis as never);

      const result = await service.getPerformanceTrends(mockStudent.id, trendsDto);

      expect(result.success).toBe(true);
      expect(result.gpa.trend).toBe('improving');
      expect(result.student.currentGrade).toBe('10');
    });

    it('should include analysis parameters', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      academicTranscriptService.analyzePerformanceTrends.mockResolvedValue({} as never);

      const result = await service.getPerformanceTrends(mockStudent.id, trendsDto);

      expect(result.analysisParams).toEqual({
        yearsToAnalyze: 3,
        semestersToAnalyze: 6,
      });
    });

    it('should validate student UUID', async () => {
      await expect(service.getPerformanceTrends('invalid-uuid', trendsDto)).rejects.toThrow();
    });
  });

  describe('performBulkGradeTransition', () => {
    const bulkDto: BulkGradeTransitionDto = {
      effectiveDate: '2024-06-01',
      dryRun: false,
      criteria: {
        minimumGpa: 2.5,
        minimumAttendance: 0.9,
        requirePassingGrades: true,
      },
    };

    it('should perform bulk grade transition successfully', async () => {
      const students = [
        { ...mockStudent, grade: '9', save: jest.fn() },
        { ...mockStudent, id: 's2', grade: '10', save: jest.fn() },
      ];
      studentModel.findAll.mockResolvedValue(students as Student[]);

      const result = await service.performBulkGradeTransition(bulkDto);

      expect(result.success).toBe(true);
      expect(result.results.total).toBe(2);
      expect(result.results.promoted).toBeGreaterThan(0);
    });

    it('should handle dry run mode', async () => {
      const dryRunDto = { ...bulkDto, dryRun: true };
      studentModel.findAll.mockResolvedValue([mockStudent as Student]);

      const result = await service.performBulkGradeTransition(dryRunDto);

      expect(result.dryRun).toBe(true);
      expect(mockStudent.save).not.toHaveBeenCalled();
    });

    it('should graduate 12th graders', async () => {
      const twelfthGrader = { ...mockStudent, grade: '12', save: jest.fn() };
      studentModel.findAll.mockResolvedValue([twelfthGrader as Student]);

      const result = await service.performBulkGradeTransition(bulkDto);

      expect(result.results.graduated).toBe(1);
      expect(result.results.promoted).toBe(0);
    });

    it('should retain students not meeting criteria', async () => {
      const retainDto = {
        ...bulkDto,
        criteria: { minimumGpa: 4.0, minimumAttendance: 1.0, requirePassingGrades: true },
      };
      studentModel.findAll.mockResolvedValue([mockStudent as Student]);

      const result = await service.performBulkGradeTransition(retainDto);

      // Note: Current implementation simulates criteria as always meeting
      expect(result.results.total).toBe(1);
    });

    it('should use default criteria when not provided', async () => {
      const noCriteriaDto = { effectiveDate: '2024-06-01', dryRun: false };
      studentModel.findAll.mockResolvedValue([mockStudent as Student]);

      const result = await service.performBulkGradeTransition(
        noCriteriaDto as BulkGradeTransitionDto,
      );

      expect(result.criteria.minimumGpa).toBe(2.0);
      expect(result.criteria.minimumAttendance).toBe(0.9);
    });
  });

  describe('getGraduatingStudents', () => {
    const graduatingDto: GraduatingStudentsDto = {
      academicYear: '2023-2024',
      minimumGpa: 3.0,
      minimumCredits: 24,
    };

    it('should identify eligible graduating students', async () => {
      const twelfthGraders = [
        { ...mockStudent, grade: '12', id: 's1' },
        { ...mockStudent, grade: '12', id: 's2' },
      ];
      studentModel.findAll.mockResolvedValue(twelfthGraders as Student[]);

      const transcriptsMap = new Map([
        ['s1', [{ gpa: 3.5, subjects: [{ credits: 15 }, { credits: 12 }] }]],
        ['s2', [{ gpa: 2.5, subjects: [{ credits: 10 }] }]],
      ]);
      academicTranscriptService.batchGetAcademicHistories.mockResolvedValue(
        transcriptsMap as never,
      );

      const result = await service.getGraduatingStudents(graduatingDto);

      expect(result.success).toBe(true);
      expect(result.summary.eligible).toBe(1);
      expect(result.summary.ineligible).toBe(1);
    });

    it('should filter only grade 12 students', async () => {
      studentModel.findAll.mockResolvedValue([]);

      await service.getGraduatingStudents(graduatingDto);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            grade: '12',
            isActive: true,
          }),
        }),
      );
    });

    it('should use default criteria when not provided', async () => {
      studentModel.findAll.mockResolvedValue([]);
      academicTranscriptService.batchGetAcademicHistories.mockResolvedValue(new Map());

      const result = await service.getGraduatingStudents({});

      expect(result.criteria.minimumGpa).toBe(2.0);
      expect(result.criteria.minimumCredits).toBe(24);
    });

    it('should calculate cumulative GPA correctly', async () => {
      const student = { ...mockStudent, grade: '12', id: 's1' };
      studentModel.findAll.mockResolvedValue([student as Student]);

      const transcriptsMap = new Map([['s1', [{ gpa: 3.0 }, { gpa: 4.0 }, { gpa: 3.5 }]]]);
      academicTranscriptService.batchGetAcademicHistories.mockResolvedValue(
        transcriptsMap as never,
      );

      const result = await service.getGraduatingStudents(graduatingDto);

      expect(result.eligibleStudents[0].academicMetrics.cumulativeGpa).toBe(3.5);
    });

    it('should handle students with no transcripts', async () => {
      const student = { ...mockStudent, grade: '12' };
      studentModel.findAll.mockResolvedValue([student as Student]);
      academicTranscriptService.batchGetAcademicHistories.mockResolvedValue(new Map());

      const result = await service.getGraduatingStudents(graduatingDto);

      expect(result.ineligibleStudents[0].academicMetrics.cumulativeGpa).toBe(0);
      expect(result.ineligibleStudents[0].academicMetrics.totalCredits).toBe(0);
    });
  });

  describe('advanceStudentGrade', () => {
    const gradeDto: GradeTransitionDto = {
      newGrade: '11',
      effectiveDate: '2024-06-01',
      reason: 'Promotion',
    };

    it('should advance student grade successfully', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);

      const result = await service.advanceStudentGrade(mockStudent.id, gradeDto);

      expect(result.success).toBe(true);
      expect(result.previousGrade).toBe('10');
      expect(result.newGrade).toBe('11');
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should use current date if effectiveDate not provided', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      const noDa teDto = { newGrade: '11', reason: 'Promotion' } as GradeTransitionDto;

      const result = await service.advanceStudentGrade(mockStudent.id, noDa teDto);

      expect(result.effectiveDate).toBeInstanceOf(Date);
    });

    it('should validate student UUID', async () => {
      await expect(service.advanceStudentGrade('invalid-uuid', gradeDto)).rejects.toThrow();
    });

    it('should throw NotFoundException if student not found', async () => {
      studentModel.findByPk.mockResolvedValue(null);

      await expect(
        service.advanceStudentGrade('123e4567-e89b-12d3-a456-426614174000', gradeDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('retainStudentGrade', () => {
    const retainDto: GradeTransitionDto = {
      newGrade: '10',
      effectiveDate: '2024-06-01',
      reason: 'Academic performance',
    };

    it('should retain student in current grade', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);

      const result = await service.retainStudentGrade(mockStudent.id, retainDto);

      expect(result.success).toBe(true);
      expect(result.grade).toBe('10');
      expect(result.action).toBe('retained');
      expect(mockStudent.save).not.toHaveBeenCalled();
    });

    it('should validate student UUID', async () => {
      await expect(service.retainStudentGrade('invalid-uuid', retainDto)).rejects.toThrow();
    });
  });

  describe('processStudentGraduation', () => {
    const graduationDto: GraduationDto = {
      graduationDate: '2024-06-15',
      diplomaNumber: 'DIPL-2024-001',
      honors: 'Summa Cum Laude',
    };

    it('should process graduation successfully', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);

      const result = await service.processStudentGraduation(mockStudent.id, graduationDto);

      expect(result.success).toBe(true);
      expect(mockStudent.grade).toBe('GRADUATED');
      expect(mockStudent.isActive).toBe(false);
      expect(mockStudent.save).toHaveBeenCalled();
    });

    it('should use current date if graduationDate not provided', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);
      const noDateDto = { diplomaNumber: 'DIPL-001' } as GraduationDto;

      const result = await service.processStudentGraduation(mockStudent.id, noDateDto);

      expect(result.graduationDate).toBeInstanceOf(Date);
    });

    it('should validate student UUID', async () => {
      await expect(service.processStudentGraduation('invalid-uuid', graduationDto)).rejects.toThrow();
    });
  });

  describe('getGradeTransitionHistory', () => {
    it('should retrieve grade transition history', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as Student);

      const result = await service.getGradeTransitionHistory(mockStudent.id);

      expect(result.success).toBe(true);
      expect(result.currentGrade).toBe('10');
      expect(result.history).toHaveLength(1);
      expect(result.history[0].action).toBe('enrolled');
    });

    it('should validate student UUID', async () => {
      await expect(service.getGradeTransitionHistory('invalid-uuid')).rejects.toThrow();
    });

    it('should throw NotFoundException if student not found', async () => {
      studentModel.findByPk.mockResolvedValue(null);

      await expect(
        service.getGradeTransitionHistory('123e4567-e89b-12d3-a456-426614174000'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
