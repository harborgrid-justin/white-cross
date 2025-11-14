/**
 * @fileoverview Student Health Controller Tests
 * @module student/controllers/student-health.controller.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { StudentHealthController } from './student-health.controller';
import { StudentService } from '../student.service';
import { StudentHealthRecordsDto } from '../dto/student-health-records.dto';
import { MentalHealthRecordsDto } from '../dto/mental-health-records.dto';

describe('StudentHealthController', () => {
  let controller: StudentHealthController;
  let studentService: jest.Mocked<StudentService>;

  const mockStudentId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(async () => {
    const mockStudentService = {
      getStudentHealthRecords: jest.fn(),
      getStudentMentalHealthRecords: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentHealthController],
      providers: [
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
      ],
    }).compile();

    controller = module.get<StudentHealthController>(StudentHealthController);
    studentService = module.get(StudentService);
  });

  describe('getHealthRecords', () => {
    it('should retrieve health records successfully', async () => {
      const query: StudentHealthRecordsDto = { page: 1, limit: 20 };
      const mockRecords = {
        data: [{ id: 'record-1', type: 'checkup', date: new Date() }],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      studentService.getStudentHealthRecords.mockResolvedValue(mockRecords);

      const result = await controller.getHealthRecords(mockStudentId, query);

      expect(result).toEqual(mockRecords);
      expect(studentService.getStudentHealthRecords).toHaveBeenCalledWith(mockStudentId, 1, 20);
    });

    it('should handle pagination parameters', async () => {
      const query: StudentHealthRecordsDto = { page: 2, limit: 50 };
      studentService.getStudentHealthRecords.mockResolvedValue({ data: [], meta: { page: 2, limit: 50, total: 0, pages: 0 } });

      await controller.getHealthRecords(mockStudentId, query);

      expect(studentService.getStudentHealthRecords).toHaveBeenCalledWith(mockStudentId, 2, 50);
    });
  });

  describe('getMentalHealthRecords', () => {
    it('should retrieve mental health records successfully', async () => {
      const query: MentalHealthRecordsDto = { page: 1, limit: 20 };
      const mockRecords = {
        data: [{ id: 'mh-record-1', session: 'counseling', date: new Date() }],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      studentService.getStudentMentalHealthRecords.mockResolvedValue(mockRecords);

      const result = await controller.getMentalHealthRecords(mockStudentId, query);

      expect(result).toEqual(mockRecords);
      expect(studentService.getStudentMentalHealthRecords).toHaveBeenCalledWith(mockStudentId, 1, 20);
    });

    it('should handle empty mental health records', async () => {
      const query: MentalHealthRecordsDto = { page: 1, limit: 20 };
      studentService.getStudentMentalHealthRecords.mockResolvedValue({ data: [], meta: { page: 1, limit: 20, total: 0, pages: 0 } });

      const result = await controller.getMentalHealthRecords(mockStudentId, query);

      expect(result.data).toEqual([]);
    });
  });
});
