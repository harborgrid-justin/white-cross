/**
 * @fileoverview Student Query Service Tests
 * @module services/student/student-query.service.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { StudentQueryService } from './student-query.service';
import { Student, User } from '@/database';
import { QueryCacheService } from '@/database/services';
import { RequestContextService } from '@/common/context/request-context.service';
import { StudentFilterDto } from '../dto/student-filter.dto';

describe('StudentQueryService', () => {
  let service: StudentQueryService;
  let studentModel: jest.Mocked<typeof Student>;
  let queryCacheService: jest.Mocked<QueryCacheService>;
  let requestContext: jest.Mocked<RequestContextService>;

  const mockStudent = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    grade: '10',
    dateOfBirth: new Date('2008-01-15'),
    gender: 'M',
    isActive: true,
    nurseId: '123e4567-e89b-12d3-a456-426614174001',
    schoolId: '123e4567-e89b-12d3-a456-426614174002',
    photo: null,
  };

  const mockUser = {
    id: '123e4567-e89b-12d3-a456-426614174001',
    firstName: 'Jane',
    lastName: 'Nurse',
    email: 'jane@example.com',
    role: 'NURSE',
  };

  beforeEach(async () => {
    const mockStudentModel = {
      findAndCountAll: jest.fn(),
      findAll: jest.fn(),
      sequelize: {
        fn: jest.fn(),
        col: jest.fn(),
      },
    };

    const mockQueryCacheService = {
      findWithCache: jest.fn(),
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
        StudentQueryService,
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: QueryCacheService,
          useValue: mockQueryCacheService,
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContext,
        },
      ],
    }).compile();

    service = module.get<StudentQueryService>(StudentQueryService);
    studentModel = module.get(getModelToken(Student));
    queryCacheService = module.get(QueryCacheService);
    requestContext = module.get(RequestContextService);
  });

  describe('findAll', () => {
    it('should return paginated students with default pagination', async () => {
      const filterDto: StudentFilterDto = {};
      const mockResponse = {
        rows: [mockStudent],
        count: 1,
      };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(filterDto);

      expect(result).toEqual({
        data: [mockStudent],
        meta: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      });
      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 20,
          offset: 0,
          distinct: true,
        }),
      );
    });

    it('should apply search filter across firstName, lastName, and studentNumber', async () => {
      const filterDto: StudentFilterDto = { search: 'john' };
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            [Op.or]: [
              { firstName: { [Op.iLike]: '%john%' } },
              { lastName: { [Op.iLike]: '%john%' } },
              { studentNumber: { [Op.iLike]: '%john%' } },
            ],
          }),
        }),
      );
    });

    it('should filter by grade when provided', async () => {
      const filterDto: StudentFilterDto = { grade: '10' };
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ grade: '10' }),
        }),
      );
    });

    it('should filter by isActive status', async () => {
      const filterDto: StudentFilterDto = { isActive: true };
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
    });

    it('should filter by nurseId when provided', async () => {
      const filterDto: StudentFilterDto = { nurseId: '123e4567-e89b-12d3-a456-426614174001' };
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ nurseId: '123e4567-e89b-12d3-a456-426614174001' }),
        }),
      );
    });

    it('should filter by gender when provided', async () => {
      const filterDto: StudentFilterDto = { gender: 'M' };
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ gender: 'M' }),
        }),
      );
    });

    it('should handle pagination correctly', async () => {
      const filterDto: StudentFilterDto = { page: 2, limit: 10 };
      const mockResponse = { rows: [mockStudent], count: 25 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      const result = await service.findAll(filterDto);

      expect(result.meta).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        pages: 3,
      });
      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          offset: 10,
        }),
      );
    });

    it('should include nurse relationship with LEFT JOIN', async () => {
      const filterDto: StudentFilterDto = {};
      const mockResponse = { rows: [mockStudent], count: 1 };

      studentModel.findAndCountAll.mockResolvedValue(mockResponse);

      await service.findAll(filterDto);

      expect(studentModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: User,
              as: 'nurse',
              required: false,
            }),
          ]),
        }),
      );
    });

    it('should handle database errors gracefully', async () => {
      const filterDto: StudentFilterDto = {};
      studentModel.findAndCountAll.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll(filterDto)).rejects.toThrow();
    });
  });

  describe('search', () => {
    it('should search students by query string', async () => {
      studentModel.findAll.mockResolvedValue([mockStudent]);

      const result = await service.search('john');

      expect(result).toEqual([mockStudent]);
      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
            [Op.or]: [
              { firstName: { [Op.iLike]: '%john%' } },
              { lastName: { [Op.iLike]: '%john%' } },
              { studentNumber: { [Op.iLike]: '%john%' } },
            ],
          }),
          limit: 20,
        }),
      );
    });

    it('should respect custom limit parameter', async () => {
      studentModel.findAll.mockResolvedValue([mockStudent]);

      await service.search('john', 50);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 50,
        }),
      );
    });

    it('should only return active students', async () => {
      studentModel.findAll.mockResolvedValue([mockStudent]);

      await service.search('john');

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isActive: true,
          }),
        }),
      );
    });

    it('should order results by lastName and firstName', async () => {
      studentModel.findAll.mockResolvedValue([mockStudent]);

      await service.search('john');

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [
            ['lastName', 'ASC'],
            ['firstName', 'ASC'],
          ],
        }),
      );
    });

    it('should handle search errors', async () => {
      studentModel.findAll.mockRejectedValue(new Error('Search failed'));

      await expect(service.search('john')).rejects.toThrow();
    });
  });

  describe('findByGrade', () => {
    it('should find students by grade using cache', async () => {
      queryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      const result = await service.findByGrade('10');

      expect(result).toEqual([mockStudent]);
      expect(queryCacheService.findWithCache).toHaveBeenCalledWith(
        studentModel,
        expect.objectContaining({
          where: { grade: '10', isActive: true },
        }),
        expect.objectContaining({
          ttl: 300,
          keyPrefix: 'student_grade',
          invalidateOn: ['create', 'update', 'destroy'],
        }),
      );
    });

    it('should only return active students', async () => {
      queryCacheService.findWithCache.mockResolvedValue([mockStudent]);

      await service.findByGrade('10');

      expect(queryCacheService.findWithCache).toHaveBeenCalledWith(
        studentModel,
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
        expect.any(Object),
      );
    });

    it('should handle cache errors', async () => {
      queryCacheService.findWithCache.mockRejectedValue(new Error('Cache error'));

      await expect(service.findByGrade('10')).rejects.toThrow();
    });
  });

  describe('findAllGrades', () => {
    it('should return unique grades', async () => {
      const mockGrades = [{ grade: '9' }, { grade: '10' }, { grade: '11' }];
      studentModel.findAll.mockResolvedValue(mockGrades as Student[]);

      const result = await service.findAllGrades();

      expect(result).toEqual(['9', '10', '11']);
      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
          order: [['grade', 'ASC']],
          raw: true,
        }),
      );
    });

    it('should only include active students', async () => {
      studentModel.findAll.mockResolvedValue([]);

      await service.findAllGrades();

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        }),
      );
    });

    it('should handle empty results', async () => {
      studentModel.findAll.mockResolvedValue([]);

      const result = await service.findAllGrades();

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      studentModel.findAll.mockRejectedValue(new Error('Query failed'));

      await expect(service.findAllGrades()).rejects.toThrow();
    });
  });

  describe('findAssignedStudents', () => {
    it('should find students assigned to a nurse', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      studentModel.findAll.mockResolvedValue([mockStudent]);

      const result = await service.findAssignedStudents(nurseId);

      expect(result).toEqual([mockStudent]);
      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { nurseId, isActive: true },
        }),
      );
    });

    it('should validate UUID format', async () => {
      const invalidId = 'invalid-uuid';

      await expect(service.findAssignedStudents(invalidId)).rejects.toThrow();
    });

    it('should only return specific attributes', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      studentModel.findAll.mockResolvedValue([mockStudent]);

      await service.findAssignedStudents(nurseId);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          attributes: [
            'id',
            'studentNumber',
            'firstName',
            'lastName',
            'grade',
            'dateOfBirth',
            'gender',
            'photo',
          ],
        }),
      );
    });

    it('should handle errors', async () => {
      const nurseId = '123e4567-e89b-12d3-a456-426614174001';
      studentModel.findAll.mockRejectedValue(new Error('Query failed'));

      await expect(service.findAssignedStudents(nurseId)).rejects.toThrow();
    });
  });

  describe('findByIds', () => {
    it('should find students by IDs in correct order', async () => {
      const ids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174003',
        '123e4567-e89b-12d3-a456-426614174004',
      ];
      const student1 = { ...mockStudent, id: ids[0] };
      const student2 = { ...mockStudent, id: ids[2] };
      studentModel.findAll.mockResolvedValue([student1, student2] as Student[]);

      const result = await service.findByIds(ids);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual(student1);
      expect(result[1]).toBeNull();
      expect(result[2]).toEqual(student2);
    });

    it('should handle empty ID array', async () => {
      studentModel.findAll.mockResolvedValue([]);

      const result = await service.findByIds([]);

      expect(result).toEqual([]);
    });

    it('should handle all missing students', async () => {
      const ids = ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'];
      studentModel.findAll.mockResolvedValue([]);

      const result = await service.findByIds(ids);

      expect(result).toEqual([null, null]);
    });

    it('should use IN operator for query', async () => {
      const ids = ['123e4567-e89b-12d3-a456-426614174000'];
      studentModel.findAll.mockResolvedValue([mockStudent]);

      await service.findByIds(ids);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: { [Op.in]: ids } },
        }),
      );
    });

    it('should handle errors', async () => {
      studentModel.findAll.mockRejectedValue(new Error('Batch query failed'));

      await expect(service.findByIds(['123e4567-e89b-12d3-a456-426614174000'])).rejects.toThrow();
    });
  });

  describe('findBySchoolIds', () => {
    it('should group students by school ID', async () => {
      const schoolIds = ['school-1', 'school-2', 'school-3'];
      const student1 = { ...mockStudent, schoolId: 'school-1' };
      const student2 = { ...mockStudent, id: 'student-2', schoolId: 'school-2' };
      const student3 = { ...mockStudent, id: 'student-3', schoolId: 'school-2' };

      studentModel.findAll.mockResolvedValue([student1, student2, student3] as Student[]);

      const result = await service.findBySchoolIds(schoolIds);

      expect(result).toHaveLength(3);
      expect(result[0]).toEqual([student1]);
      expect(result[1]).toEqual([student2, student3]);
      expect(result[2]).toEqual([]);
    });

    it('should only return active students', async () => {
      studentModel.findAll.mockResolvedValue([]);

      await service.findBySchoolIds(['school-1']);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ isActive: true }),
        }),
      );
    });

    it('should include nurse relationship', async () => {
      studentModel.findAll.mockResolvedValue([]);

      await service.findBySchoolIds(['school-1']);

      expect(studentModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: User,
              as: 'nurse',
              required: false,
            }),
          ]),
        }),
      );
    });

    it('should handle empty school IDs', async () => {
      studentModel.findAll.mockResolvedValue([]);

      const result = await service.findBySchoolIds([]);

      expect(result).toEqual([]);
    });

    it('should handle errors', async () => {
      studentModel.findAll.mockRejectedValue(new Error('Batch query failed'));

      await expect(service.findBySchoolIds(['school-1'])).rejects.toThrow();
    });
  });
});
