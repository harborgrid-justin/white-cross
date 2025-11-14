import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { VaccinationsService, VaccinationQueryOptions } from './vaccinations.service';
import { RequestContextService } from '@/common/context/request-context.service';
import { Student, Vaccination } from '@/database/models';
import { Op } from 'sequelize';

describe('VaccinationsService', () => {
  let service: VaccinationsService;
  let studentModel: jest.Mocked<typeof Student>;
  let vaccinationModel: jest.Mocked<typeof Vaccination>;
  let requestContext: jest.Mocked<RequestContextService>;

  const mockStudent = {
    id: 'student-123',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2010-01-15',
    toJSON: jest.fn().mockReturnThis(),
  };

  const mockVaccination = {
    id: 'vaccination-123',
    studentId: 'student-123',
    vaccineType: 'MMR',
    nextDueDate: new Date('2025-12-01'),
    seriesComplete: false,
    student: mockStudent,
    toJSON: jest.fn().mockReturnValue({
      id: 'vaccination-123',
      studentId: 'student-123',
      vaccineType: 'MMR',
      nextDueDate: new Date('2025-12-01'),
      seriesComplete: false,
    }),
  };

  beforeEach(async () => {
    const mockStudentModel = {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const mockVaccinationModel = {
      findByPk: jest.fn(),
      findAll: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    const mockRequestContext = {
      get: jest.fn(),
      set: jest.fn(),
      getTenantId: jest.fn().mockReturnValue('tenant-123'),
      getUserId: jest.fn().mockReturnValue('user-123'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VaccinationsService,
        {
          provide: RequestContextService,
          useValue: mockRequestContext,
        },
        {
          provide: getModelToken(Student),
          useValue: mockStudentModel,
        },
        {
          provide: getModelToken(Vaccination),
          useValue: mockVaccinationModel,
        },
      ],
    }).compile();

    service = module.get<VaccinationsService>(VaccinationsService);
    requestContext = module.get(RequestContextService);
    studentModel = module.get(getModelToken(Student));
    vaccinationModel = module.get(getModelToken(Vaccination));
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should inject all required dependencies', () => {
      expect(requestContext).toBeDefined();
      expect(studentModel).toBeDefined();
      expect(vaccinationModel).toBeDefined();
    });
  });

  describe('getVaccinationsByStatus', () => {
    it('should get both due and overdue vaccinations', async () => {
      const dueVaccination = { ...mockVaccination, toJSON: jest.fn().mockReturnValue({ ...mockVaccination }) };
      const overdueVaccination = {
        ...mockVaccination,
        id: 'vaccination-456',
        nextDueDate: new Date('2025-10-01'),
        toJSON: jest.fn().mockReturnValue({
          id: 'vaccination-456',
          nextDueDate: new Date('2025-10-01'),
        }),
      };

      vaccinationModel.findAll
        .mockResolvedValueOnce([dueVaccination] as unknown as Vaccination[])
        .mockResolvedValueOnce([overdueVaccination] as unknown as Vaccination[]);

      const result = await service.getVaccinationsByStatus(['due', 'overdue'], { page: 1, limit: 50 });

      expect(result.vaccinations).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.statusFilter).toBe('due,overdue');
      expect(vaccinationModel.findAll).toHaveBeenCalledTimes(2);
    });

    it('should get only due vaccinations', async () => {
      const dueVaccination = { ...mockVaccination, toJSON: jest.fn().mockReturnValue({ ...mockVaccination }) };

      vaccinationModel.findAll.mockResolvedValue([dueVaccination] as unknown as Vaccination[]);

      const result = await service.getVaccinationsByStatus(['due'], { page: 1, limit: 50 });

      expect(result.vaccinations).toHaveLength(1);
      expect(result.vaccinations[0].status).toBe('due');
      expect(result.statusFilter).toBe('due');
      expect(vaccinationModel.findAll).toHaveBeenCalledTimes(1);
    });

    it('should get only overdue vaccinations', async () => {
      const overdueVaccination = { ...mockVaccination, toJSON: jest.fn().mockReturnValue({ ...mockVaccination }) };

      vaccinationModel.findAll.mockResolvedValue([overdueVaccination] as unknown as Vaccination[]);

      const result = await service.getVaccinationsByStatus(['overdue'], { page: 1, limit: 50 });

      expect(result.vaccinations).toHaveLength(1);
      expect(result.vaccinations[0].status).toBe('overdue');
      expect(result.statusFilter).toBe('overdue');
    });

    it('should filter by studentId', async () => {
      const dueVaccination = { ...mockVaccination, toJSON: jest.fn().mockReturnValue({ ...mockVaccination }) };

      vaccinationModel.findAll.mockResolvedValue([dueVaccination] as unknown as Vaccination[]);

      const result = await service.getVaccinationsByStatus(['due'], {
        page: 1,
        limit: 50,
        studentId: 'student-123',
      });

      expect(result.vaccinations).toHaveLength(1);
      expect(vaccinationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            studentId: 'student-123',
          }),
        })
      );
    });

    it('should filter by vaccineType', async () => {
      vaccinationModel.findAll.mockResolvedValue([mockVaccination] as unknown as Vaccination[]);

      await service.getVaccinationsByStatus(['due'], {
        page: 1,
        limit: 50,
        vaccineType: 'MMR',
      });

      expect(vaccinationModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vaccineType: { [Op.iLike]: '%MMR%' },
          }),
        })
      );
    });

    it('should apply pagination correctly', async () => {
      const vaccinations = Array.from({ length: 10 }, (_, i) => ({
        ...mockVaccination,
        id: `vaccination-${i}`,
        toJSON: jest.fn().mockReturnValue({ id: `vaccination-${i}` }),
      }));

      vaccinationModel.findAll.mockResolvedValue(vaccinations as unknown as Vaccination[]);

      const result = await service.getVaccinationsByStatus(['due'], { page: 2, limit: 5 });

      expect(result.vaccinations).toHaveLength(5);
      expect(result.page).toBe(2);
      expect(result.total).toBe(10);
    });

    it('should throw error if no statuses provided', async () => {
      await expect(service.getVaccinationsByStatus([], { page: 1, limit: 50 })).rejects.toThrow(
        'At least one status must be specified'
      );
    });

    it('should validate UUID for studentId', async () => {
      await expect(
        service.getVaccinationsByStatus(['due'], { studentId: 'invalid-uuid' })
      ).rejects.toThrow();
    });

    it('should handle empty results', async () => {
      vaccinationModel.findAll.mockResolvedValue([]);

      const result = await service.getVaccinationsByStatus(['due'], { page: 1, limit: 50 });

      expect(result.vaccinations).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getDueVaccinations', () => {
    it('should retrieve due vaccinations with pagination', async () => {
      const vaccinations = [mockVaccination];
      const total = 1;

      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: vaccinations as unknown as Vaccination[],
        count: total,
      });

      const result = await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(total);
      expect(vaccinationModel.findAndCountAll).toHaveBeenCalled();
    });

    it('should filter by studentId', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getDueVaccinations({ studentId: 'student-123', page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            studentId: 'student-123',
          }),
        })
      );
    });

    it('should filter by vaccineType', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getDueVaccinations({ vaccineType: 'MMR', page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vaccineType: { [Op.iLike]: '%MMR%' },
          }),
        })
      );
    });

    it('should only include incomplete vaccination series', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            seriesComplete: false,
          }),
        })
      );
    });

    it('should include student information', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: studentModel,
              as: 'student',
            }),
          ]),
        })
      );
    });

    it('should order by nextDueDate ascending', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['nextDueDate', 'ASC']],
        })
      );
    });

    it('should validate studentId UUID format', async () => {
      await expect(service.getDueVaccinations({ studentId: 'invalid-uuid' })).rejects.toThrow();
    });

    it('should handle empty results', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('getOverdueVaccinations', () => {
    it('should retrieve overdue vaccinations', async () => {
      const overdueVaccination = {
        ...mockVaccination,
        nextDueDate: new Date('2025-10-01'),
      };

      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [overdueVaccination] as unknown as Vaccination[],
        count: 1,
      });

      const result = await service.getOverdueVaccinations({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it('should filter by studentId', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getOverdueVaccinations({ studentId: 'student-123', page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            studentId: 'student-123',
          }),
        })
      );
    });

    it('should filter by vaccineType', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getOverdueVaccinations({ vaccineType: 'Hepatitis', page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vaccineType: { [Op.iLike]: '%Hepatitis%' },
          }),
        })
      );
    });

    it('should only include overdue vaccinations with nextDueDate < today', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getOverdueVaccinations({ page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            nextDueDate: { [Op.lt]: expect.any(Date) },
          }),
        })
      );
    });

    it('should validate studentId UUID format', async () => {
      await expect(service.getOverdueVaccinations({ studentId: 'not-a-uuid' })).rejects.toThrow();
    });

    it('should handle no overdue vaccinations', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.getOverdueVaccinations({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(0);
    });
  });

  describe('getVaccinationById', () => {
    it('should retrieve vaccination by id', async () => {
      vaccinationModel.findByPk.mockResolvedValue(mockVaccination as unknown as Vaccination);

      const result = await service.getVaccinationById('vaccination-123');

      expect(result).toEqual(mockVaccination);
      expect(vaccinationModel.findByPk).toHaveBeenCalledWith('vaccination-123');
    });

    it('should validate UUID format', async () => {
      await expect(service.getVaccinationById('invalid-id')).rejects.toThrow();
    });

    it('should throw error if vaccination not found', async () => {
      vaccinationModel.findByPk.mockResolvedValue(null);

      await expect(service.getVaccinationById('vaccination-999')).rejects.toThrow();
    });
  });

  describe('getVaccinationsByStudentId', () => {
    it('should retrieve all vaccinations for a student', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as unknown as Student);
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      const result = await service.getVaccinationsByStudentId('student-123', { page: 1, limit: 20 });

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(studentModel.findByPk).toHaveBeenCalledWith('student-123');
    });

    it('should validate student UUID format', async () => {
      await expect(service.getVaccinationsByStudentId('invalid-uuid')).rejects.toThrow();
    });

    it('should throw error if student not found', async () => {
      studentModel.findByPk.mockResolvedValue(null);

      await expect(service.getVaccinationsByStudentId('student-999')).rejects.toThrow();
    });

    it('should filter by vaccineType', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as unknown as Student);
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getVaccinationsByStudentId('student-123', { vaccineType: 'MMR', page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vaccineType: { [Op.iLike]: '%MMR%' },
          }),
        })
      );
    });

    it('should order by createdAt descending', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as unknown as Student);
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getVaccinationsByStudentId('student-123', { page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          order: [['createdAt', 'DESC']],
        })
      );
    });

    it('should include student information', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as unknown as Student);
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      await service.getVaccinationsByStudentId('student-123', { page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.arrayContaining([
            expect.objectContaining({
              model: studentModel,
              as: 'student',
            }),
          ]),
        })
      );
    });

    it('should handle student with no vaccinations', async () => {
      studentModel.findByPk.mockResolvedValue(mockStudent as unknown as Student);
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.getVaccinationsByStudentId('student-123', { page: 1, limit: 20 });

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle database connection errors', async () => {
      const error = new Error('Database connection failed');
      vaccinationModel.findAndCountAll.mockRejectedValue(error);

      await expect(service.getDueVaccinations({ page: 1, limit: 20 })).rejects.toThrow(
        'Database connection failed'
      );
    });

    it('should handle invalid date ranges', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.getDueVaccinations({ page: 1, limit: 20 });

      expect(result.data).toHaveLength(0);
    });

    it('should handle large pagination values', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      const result = await service.getDueVaccinations({ page: 1000, limit: 100 });

      expect(result.data).toHaveLength(0);
    });

    it('should handle concurrent requests', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [mockVaccination] as unknown as Vaccination[],
        count: 1,
      });

      const promises = [
        service.getDueVaccinations({ page: 1, limit: 20 }),
        service.getOverdueVaccinations({ page: 1, limit: 20 }),
        service.getVaccinationsByStatus(['due'], { page: 1, limit: 20 }),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
    });

    it('should handle special characters in vaccineType filter', async () => {
      vaccinationModel.findAndCountAll.mockResolvedValue({
        rows: [],
        count: 0,
      });

      await service.getDueVaccinations({ vaccineType: "MMR's \"test\"", page: 1, limit: 20 });

      expect(vaccinationModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            vaccineType: { [Op.iLike]: expect.any(String) },
          }),
        })
      );
    });
  });
});
