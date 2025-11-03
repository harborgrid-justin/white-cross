/**
 * Student Resolver Unit Tests
 *
 * Tests resolver logic in isolation with mocked dependencies.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { StudentResolver } from '../../../src/infrastructure/graphql/resolvers/student.resolver';
import { StudentService } from '../../../src/student/student.service';
import { DataLoaderFactory } from '../../../src/infrastructure/graphql/dataloaders/dataloader.factory';
import { Gender } from '../../../src/infrastructure/graphql/dto/student.dto';
import { GraphQLContext } from '../../../src/infrastructure/graphql/types/context.interface';

describe('StudentResolver (Unit)', () => {
  let resolver: StudentResolver;
  let studentService: jest.Mocked<StudentService>;
  let dataLoaderFactory: jest.Mocked<DataLoaderFactory>;

  const mockStudent = {
    id: 'student-1',
    studentNumber: 'STU001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('2010-05-15'),
    grade: '5',
    gender: 'MALE' as any,
    isActive: true,
    enrollmentDate: new Date('2020-09-01'),
    nurseId: 'nurse-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockContext: Partial<GraphQLContext> = {
    req: {
      user: {
        id: 'user-1',
        role: 'ADMIN',
      },
    } as any,
    loaders: {
      contactsByStudentLoader: {
        load: jest.fn(),
      },
      medicationsByStudentLoader: {
        load: jest.fn(),
      },
      healthRecordsByStudentLoader: {
        load: jest.fn(),
      },
    } as any,
  };

  beforeEach(async () => {
    const mockStudentService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByIds: jest.fn(),
    };

    const mockDataLoaderFactory = {
      createLoaders: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentResolver,
        {
          provide: StudentService,
          useValue: mockStudentService,
        },
        {
          provide: DataLoaderFactory,
          useValue: mockDataLoaderFactory,
        },
      ],
    }).compile();

    resolver = module.get<StudentResolver>(StudentResolver);
    studentService = module.get(StudentService) as jest.Mocked<StudentService>;
    dataLoaderFactory = module.get(DataLoaderFactory) as jest.Mocked<DataLoaderFactory>;
  });

  describe('getStudent', () => {
    it('should return a student when found', async () => {
      studentService.findOne.mockResolvedValue(mockStudent);

      const result = await resolver.getStudent('student-1', mockContext as any);

      expect(result).toBeDefined();
      expect(result?.id).toBe('student-1');
      expect(result?.fullName).toBe('John Doe');
      expect(studentService.findOne).toHaveBeenCalledWith('student-1');
    });

    it('should return null when student not found', async () => {
      studentService.findOne.mockResolvedValue(null);

      const result = await resolver.getStudent('non-existent', mockContext as any);

      expect(result).toBeNull();
      expect(studentService.findOne).toHaveBeenCalledWith('non-existent');
    });

    it('should construct fullName correctly', async () => {
      studentService.findOne.mockResolvedValue(mockStudent);

      const result = await resolver.getStudent('student-1', mockContext as any);

      expect(result?.fullName).toBe('John Doe');
    });

    it('should handle gender enum conversion', async () => {
      studentService.findOne.mockResolvedValue(mockStudent);

      const result = await resolver.getStudent('student-1', mockContext as any);

      expect(result?.gender).toBe(Gender.MALE);
    });
  });

  describe('getStudents', () => {
    it('should return paginated list of students', async () => {
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

      const result = await resolver.getStudents(1, 20, 'lastName', 'ASC', undefined, mockContext as any);

      expect(result.students).toHaveLength(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.total).toBe(1);
      expect(studentService.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 20,
        orderBy: 'lastName',
        orderDirection: 'ASC',
      });
    });

    it('should apply filters correctly', async () => {
      studentService.findAll.mockResolvedValue({
        data: [],
        meta: { page: 1, limit: 20, total: 0, pages: 0 },
      });

      await resolver.getStudents(
        1,
        20,
        'lastName',
        'ASC',
        { grade: '5', isActive: true },
        mockContext as any,
      );

      expect(studentService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          grade: '5',
          isActive: true,
        })
      );
    });

    it('should add fullName to each student', async () => {
      studentService.findAll.mockResolvedValue({
        data: [mockStudent],
        meta: { page: 1, limit: 20, total: 1, pages: 1 },
      });

      const result = await resolver.getStudents(1, 20, 'lastName', 'ASC', undefined, mockContext as any);

      expect(result.students[0].fullName).toBeDefined();
      expect(result.students[0].fullName).toBe('John Doe');
    });
  });

  describe('contacts field resolver', () => {
    it('should use DataLoader to load contacts', async () => {
      const mockContacts = [
        {
          id: 'contact-1',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          type: 'Guardian',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockContext.loaders?.contactsByStudentLoader.load as jest.Mock).mockResolvedValue(mockContacts);

      const result = await resolver.contacts(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result).toHaveLength(1);
      expect(result[0].firstName).toBe('Jane');
      expect(mockContext.loaders?.contactsByStudentLoader.load).toHaveBeenCalledWith('student-1');
    });

    it('should return empty array on error', async () => {
      (mockContext.loaders?.contactsByStudentLoader.load as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      const result = await resolver.contacts(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result).toEqual([]);
    });
  });

  describe('medications field resolver', () => {
    it('should use DataLoader to load medications', async () => {
      const mockMedications = [
        {
          id: 'med-1',
          studentId: 'student-1',
          medication: { name: 'Aspirin' },
          dosage: '500mg',
          frequency: 'Daily',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockContext.loaders?.medicationsByStudentLoader.load as jest.Mock).mockResolvedValue(mockMedications);

      const result = await resolver.medications(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Aspirin');
      expect(result[0].dosage).toBe('500mg');
    });

    it('should handle missing medication names', async () => {
      const mockMedications = [
        {
          id: 'med-1',
          studentId: 'student-1',
          medication: null,
          medicationName: 'Ibuprofen',
          dosage: '200mg',
          frequency: 'As needed',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockContext.loaders?.medicationsByStudentLoader.load as jest.Mock).mockResolvedValue(mockMedications);

      const result = await resolver.medications(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result[0].name).toBe('Ibuprofen');
    });
  });

  describe('contactCount field resolver', () => {
    it('should return count of contacts', async () => {
      const mockContacts = [
        { id: 'contact-1' } as any,
        { id: 'contact-2' } as any,
      ];

      (mockContext.loaders?.contactsByStudentLoader.load as jest.Mock).mockResolvedValue(mockContacts);

      const result = await resolver.contactCount(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result).toBe(2);
    });

    it('should return 0 for students with no contacts', async () => {
      (mockContext.loaders?.contactsByStudentLoader.load as jest.Mock).mockResolvedValue([]);

      const result = await resolver.contactCount(
        { id: 'student-1' } as any,
        mockContext as GraphQLContext,
      );

      expect(result).toBe(0);
    });
  });
});
