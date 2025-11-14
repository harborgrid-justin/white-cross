import { Test, TestingModule } from '@nestjs/testing';
import { WaitlistController } from './waitlist.controller';
import { WaitlistManagementService } from '../waitlist-management.service';
import { AddToWaitlistDto, AutoFillFromWaitlistDto, WaitlistEntryResponseDto } from '../dto';

describe('WaitlistController', () => {
  let controller: WaitlistController;
  let service: jest.Mocked<WaitlistManagementService>;

  const mockWaitlistService = {
    addToWaitlist: jest.fn(),
    autoFillFromWaitlist: jest.fn(),
    getWaitlistByPriority: jest.fn(),
    getWaitlistStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitlistController],
      providers: [
        {
          provide: WaitlistManagementService,
          useValue: mockWaitlistService,
        },
      ],
    }).compile();

    controller = module.get<WaitlistController>(WaitlistController);
    service = module.get(WaitlistManagementService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWaitlist', () => {
    it('should add student to waitlist with high priority', async () => {
      const dto: AddToWaitlistDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'URGENT_CARE',
        priority: 'HIGH',
      };

      const expectedResult: Partial<WaitlistEntryResponseDto> = {
        id: 'waitlist-123',
        studentId: dto.studentId,
        appointmentType: dto.appointmentType,
        priority: dto.priority,
        position: 1,
        estimatedWaitTime: '15 minutes',
      };

      mockWaitlistService.addToWaitlist.mockResolvedValue(expectedResult);

      const result = await controller.addToWaitlist(dto);

      expect(service.addToWaitlist).toHaveBeenCalledWith(
        dto.studentId,
        dto.appointmentType,
        dto.priority,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should add student to waitlist with medium priority', async () => {
      const dto: AddToWaitlistDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'ROUTINE_CHECKUP',
        priority: 'MEDIUM',
      };

      const expectedResult: Partial<WaitlistEntryResponseDto> = {
        id: 'waitlist-124',
        studentId: dto.studentId,
        appointmentType: dto.appointmentType,
        priority: dto.priority,
        position: 5,
        estimatedWaitTime: '2 hours',
      };

      mockWaitlistService.addToWaitlist.mockResolvedValue(expectedResult);

      const result = await controller.addToWaitlist(dto);

      expect(result.position).toBe(5);
      expect(result.priority).toBe('MEDIUM');
    });

    it('should handle duplicate waitlist entry', async () => {
      const dto: AddToWaitlistDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'ROUTINE_CHECKUP',
        priority: 'LOW',
      };

      mockWaitlistService.addToWaitlist.mockRejectedValue(
        new Error('Student already on waitlist for this appointment type'),
      );

      await expect(controller.addToWaitlist(dto)).rejects.toThrow(
        'Student already on waitlist for this appointment type',
      );
    });

    it('should handle invalid student ID', async () => {
      const dto: AddToWaitlistDto = {
        studentId: 'invalid-student',
        appointmentType: 'URGENT_CARE',
        priority: 'HIGH',
      };

      mockWaitlistService.addToWaitlist.mockRejectedValue(
        new Error('Student not found'),
      );

      await expect(controller.addToWaitlist(dto)).rejects.toThrow('Student not found');
    });
  });

  describe('autoFillFromWaitlist', () => {
    it('should auto-fill appointment from waitlist successfully', async () => {
      const dto: AutoFillFromWaitlistDto = {
        appointmentSlot: '2025-01-20T10:00:00.000Z',
        appointmentType: 'ROUTINE_CHECKUP',
      };

      const expectedResult = {
        success: true,
        appointmentSlot: dto.appointmentSlot,
        filledWith: {
          studentId: '123e4567-e89b-12d3-a456-426614174000',
          waitlistEntryId: 'waitlist-125',
          priority: 'HIGH',
        },
        notificationSent: true,
      };

      mockWaitlistService.autoFillFromWaitlist.mockResolvedValue(expectedResult);

      const result = await controller.autoFillFromWaitlist(dto);

      expect(service.autoFillFromWaitlist).toHaveBeenCalledWith(
        new Date(dto.appointmentSlot),
        dto.appointmentType,
      );
      expect(result.success).toBe(true);
      expect(result.notificationSent).toBe(true);
    });

    it('should handle empty waitlist', async () => {
      const dto: AutoFillFromWaitlistDto = {
        appointmentSlot: '2025-01-20T10:00:00.000Z',
        appointmentType: 'ROUTINE_CHECKUP',
      };

      const expectedResult = {
        success: false,
        message: 'No eligible students on waitlist',
        appointmentSlot: dto.appointmentSlot,
      };

      mockWaitlistService.autoFillFromWaitlist.mockResolvedValue(expectedResult);

      const result = await controller.autoFillFromWaitlist(dto);

      expect(result.success).toBe(false);
    });

    it('should handle invalid appointment slot', async () => {
      const dto: AutoFillFromWaitlistDto = {
        appointmentSlot: 'invalid-date',
        appointmentType: 'ROUTINE_CHECKUP',
      };

      mockWaitlistService.autoFillFromWaitlist.mockRejectedValue(
        new Error('Invalid date format'),
      );

      await expect(controller.autoFillFromWaitlist(dto)).rejects.toThrow(
        'Invalid date format',
      );
    });
  });

  describe('getWaitlistByPriority', () => {
    it('should retrieve waitlist ordered by priority', async () => {
      const expectedEntries: Partial<WaitlistEntryResponseDto>[] = [
        {
          id: 'waitlist-1',
          studentId: 'student-1',
          priority: 'HIGH',
          position: 1,
          appointmentType: 'URGENT_CARE',
        },
        {
          id: 'waitlist-2',
          studentId: 'student-2',
          priority: 'HIGH',
          position: 2,
          appointmentType: 'ROUTINE_CHECKUP',
        },
        {
          id: 'waitlist-3',
          studentId: 'student-3',
          priority: 'MEDIUM',
          position: 3,
          appointmentType: 'ROUTINE_CHECKUP',
        },
      ];

      mockWaitlistService.getWaitlistByPriority.mockResolvedValue(expectedEntries);

      const result = await controller.getWaitlistByPriority();

      expect(service.getWaitlistByPriority).toHaveBeenCalled();
      expect(result).toEqual(expectedEntries);
      expect(result[0].priority).toBe('HIGH');
    });

    it('should handle empty waitlist', async () => {
      mockWaitlistService.getWaitlistByPriority.mockResolvedValue([]);

      const result = await controller.getWaitlistByPriority();

      expect(result).toEqual([]);
    });
  });

  describe('getWaitlistStatus', () => {
    it('should retrieve waitlist status for student', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedStatus = {
        studentId,
        entries: [
          {
            id: 'waitlist-123',
            appointmentType: 'ROUTINE_CHECKUP',
            priority: 'MEDIUM',
            position: 5,
            estimatedWaitTime: '2 hours',
            addedAt: '2025-01-14T08:00:00.000Z',
          },
        ],
      };

      mockWaitlistService.getWaitlistStatus.mockResolvedValue(expectedStatus);

      const result = await controller.getWaitlistStatus(studentId);

      expect(service.getWaitlistStatus).toHaveBeenCalledWith(studentId);
      expect(result.studentId).toBe(studentId);
      expect(result.entries).toHaveLength(1);
    });

    it('should handle student not on waitlist', async () => {
      const studentId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedStatus = {
        studentId,
        entries: [],
      };

      mockWaitlistService.getWaitlistStatus.mockResolvedValue(expectedStatus);

      const result = await controller.getWaitlistStatus(studentId);

      expect(result.entries).toEqual([]);
    });

    it('should handle invalid student ID', async () => {
      const studentId = 'invalid-student';

      mockWaitlistService.getWaitlistStatus.mockRejectedValue(
        new Error('Student not found'),
      );

      await expect(controller.getWaitlistStatus(studentId)).rejects.toThrow(
        'Student not found',
      );
    });
  });
});
