/**
 * @fileoverview Appointment Service Unit Tests
 * @module appointment/__tests__
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from '../appointment.service';
import { AppointmentReadService } from '../services/appointment-read.service';
import { AppointmentWriteService } from '../services/appointment-write.service';
import { AppointmentStatusService } from '../services/appointment-status.service';
import { AppointmentQueryService } from '../services/appointment-query.service';
import { AppointmentSchedulingService } from '../services/appointment-scheduling.service';
import { AppointmentStatisticsService } from '../services/appointment-statistics.service';
import { AppointmentRecurringService } from '../services/appointment-recurring.service';
import { WaitlistService } from '../services/waitlist.service';
import { ReminderService } from '../services/reminder.service';
import { RequestContextService } from '@/common/context/request-context.service';
import { AppConfigService } from '@/common/config/app-config.service';
import { AppointmentStatus } from '../dto/update-appointment.dto';

describe('AppointmentService (Facade)', () => {
  let service: AppointmentService;
  let readService: jest.Mocked<AppointmentReadService>;
  let writeService: jest.Mocked<AppointmentWriteService>;
  let statusService: jest.Mocked<AppointmentStatusService>;
  let queryService: jest.Mocked<AppointmentQueryService>;
  let schedulingService: jest.Mocked<AppointmentSchedulingService>;
  let statisticsService: jest.Mocked<AppointmentStatisticsService>;
  let recurringService: jest.Mocked<AppointmentRecurringService>;
  let waitlistService: jest.Mocked<WaitlistService>;
  let reminderService: jest.Mocked<ReminderService>;

  const mockRequestContext = {
    getCurrentUser: jest.fn().mockReturnValue({ id: 'user-1', role: 'nurse' }),
  };

  const mockConfig = {
    isProduction: false,
  };

  const mockAppointment = {
    id: 'appt-1',
    studentId: 'student-1',
    nurseId: 'nurse-1',
    appointmentType: 'Checkup',
    appointmentDate: new Date('2025-12-01T10:00:00Z'),
    duration: 30,
    status: AppointmentStatus.SCHEDULED,
    notes: 'Annual checkup',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        {
          provide: AppointmentReadService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            getUpcoming: jest.fn(),
            getPast: jest.fn(),
          },
        },
        {
          provide: AppointmentWriteService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: AppointmentStatusService,
          useValue: {
            markCompleted: jest.fn(),
            markCancelled: jest.fn(),
            markNoShow: jest.fn(),
            reschedule: jest.fn(),
          },
        },
        {
          provide: AppointmentQueryService,
          useValue: {
            search: jest.fn(),
            findByDateRange: jest.fn(),
            findByStudent: jest.fn(),
            findByNurse: jest.fn(),
          },
        },
        {
          provide: AppointmentSchedulingService,
          useValue: {
            getAvailableSlots: jest.fn(),
            checkAvailability: jest.fn(),
            findOptimalSlot: jest.fn(),
          },
        },
        {
          provide: AppointmentStatisticsService,
          useValue: {
            getStatistics: jest.fn(),
            getUtilizationRate: jest.fn(),
            getNoShowRate: jest.fn(),
          },
        },
        {
          provide: AppointmentRecurringService,
          useValue: {
            createRecurring: jest.fn(),
            getRecurringSeries: jest.fn(),
            updateRecurringSeries: jest.fn(),
          },
        },
        {
          provide: WaitlistService,
          useValue: {
            addToWaitlist: jest.fn(),
            removeFromWaitlist: jest.fn(),
            getWaitlist: jest.fn(),
            cleanupExpiredEntries: jest.fn(),
          },
        },
        {
          provide: ReminderService,
          useValue: {
            createReminder: jest.fn(),
            processUpcomingReminders: jest.fn(),
            cancelReminder: jest.fn(),
          },
        },
        {
          provide: RequestContextService,
          useValue: mockRequestContext,
        },
        {
          provide: AppConfigService,
          useValue: mockConfig,
        },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    readService = module.get(AppointmentReadService);
    writeService = module.get(AppointmentWriteService);
    statusService = module.get(AppointmentStatusService);
    queryService = module.get(AppointmentQueryService);
    schedulingService = module.get(AppointmentSchedulingService);
    statisticsService = module.get(AppointmentStatisticsService);
    recurringService = module.get(AppointmentRecurringService);
    waitlistService = module.get(WaitlistService);
    reminderService = module.get(ReminderService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Lifecycle', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should cleanup on module destroy', async () => {
      await service.onModuleDestroy();
      expect(waitlistService.cleanupExpiredEntries).not.toHaveBeenCalled(); // Not in production mode
    });
  });

  describe('Read Operations', () => {
    it('should delegate findAll to read service', async () => {
      const filters = { status: AppointmentStatus.SCHEDULED };
      const mockResult = {
        data: [mockAppointment],
        total: 1,
        page: 1,
        limit: 10,
      };
      readService.findAll.mockResolvedValueOnce(mockResult);

      const result = await service.findAll(filters);

      expect(readService.findAll).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockResult);
    });

    it('should delegate findOne to read service', async () => {
      readService.findOne.mockResolvedValueOnce(mockAppointment);

      const result = await service.findOne('appt-1');

      expect(readService.findOne).toHaveBeenCalledWith('appt-1');
      expect(result).toEqual(mockAppointment);
    });

    it('should get upcoming appointments', async () => {
      const mockUpcoming = [mockAppointment];
      readService.getUpcoming.mockResolvedValueOnce(mockUpcoming);

      const result = await service.getUpcoming('student-1', 7);

      expect(readService.getUpcoming).toHaveBeenCalledWith('student-1', 7);
      expect(result).toEqual(mockUpcoming);
    });
  });

  describe('Write Operations', () => {
    it('should create appointment', async () => {
      const createDto = {
        studentId: 'student-1',
        nurseId: 'nurse-1',
        appointmentType: 'Checkup',
        appointmentDate: new Date('2025-12-01T10:00:00Z'),
        duration: 30,
      };
      writeService.create.mockResolvedValueOnce(mockAppointment);

      const result = await service.create(createDto);

      expect(writeService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockAppointment);
    });

    it('should update appointment', async () => {
      const updateDto = { notes: 'Updated notes' };
      const updated = { ...mockAppointment, ...updateDto };
      writeService.update.mockResolvedValueOnce(updated);

      const result = await service.update('appt-1', updateDto);

      expect(writeService.update).toHaveBeenCalledWith('appt-1', updateDto);
      expect(result).toEqual(updated);
    });

    it('should remove appointment', async () => {
      writeService.remove.mockResolvedValueOnce(undefined);

      await service.remove('appt-1');

      expect(writeService.remove).toHaveBeenCalledWith('appt-1');
    });
  });

  describe('Status Operations', () => {
    it('should mark appointment as completed', async () => {
      const completed = { ...mockAppointment, status: AppointmentStatus.COMPLETED };
      statusService.markCompleted.mockResolvedValueOnce(completed);

      const result = await service.markCompleted('appt-1', { notes: 'Completed successfully' });

      expect(statusService.markCompleted).toHaveBeenCalledWith('appt-1', { notes: 'Completed successfully' });
      expect(result.status).toBe(AppointmentStatus.COMPLETED);
    });

    it('should mark appointment as cancelled', async () => {
      const cancelled = { ...mockAppointment, status: AppointmentStatus.CANCELLED };
      statusService.markCancelled.mockResolvedValueOnce(cancelled);

      const result = await service.markCancelled('appt-1', 'Student sick');

      expect(statusService.markCancelled).toHaveBeenCalledWith('appt-1', 'Student sick');
      expect(result.status).toBe(AppointmentStatus.CANCELLED);
    });

    it('should reschedule appointment', async () => {
      const newDate = new Date('2025-12-02T14:00:00Z');
      const rescheduled = { ...mockAppointment, appointmentDate: newDate };
      statusService.reschedule.mockResolvedValueOnce(rescheduled);

      const result = await service.reschedule('appt-1', newDate, 'Nurse requested');

      expect(statusService.reschedule).toHaveBeenCalledWith('appt-1', newDate, 'Nurse requested');
      expect(result.appointmentDate).toEqual(newDate);
    });
  });

  describe('Query Operations', () => {
    it('should search appointments', async () => {
      const searchDto = { query: 'checkup', limit: 10 };
      const mockResults = [mockAppointment];
      queryService.search.mockResolvedValueOnce(mockResults);

      const result = await service.search(searchDto);

      expect(queryService.search).toHaveBeenCalledWith(searchDto);
      expect(result).toEqual(mockResults);
    });

    it('should find appointments by date range', async () => {
      const dateRange = {
        startDate: new Date('2025-12-01'),
        endDate: new Date('2025-12-31'),
      };
      queryService.findByDateRange.mockResolvedValueOnce([mockAppointment]);

      const result = await service.findByDateRange(dateRange);

      expect(queryService.findByDateRange).toHaveBeenCalledWith(dateRange);
    });
  });

  describe('Scheduling Operations', () => {
    it('should get available slots', async () => {
      const date = new Date('2025-12-01');
      const mockSlots = [
        { start: new Date('2025-12-01T09:00:00Z'), end: new Date('2025-12-01T09:30:00Z'), available: true },
        { start: new Date('2025-12-01T10:00:00Z'), end: new Date('2025-12-01T10:30:00Z'), available: true },
      ];
      schedulingService.getAvailableSlots.mockResolvedValueOnce(mockSlots);

      const result = await service.getAvailableSlots(date, 'nurse-1', 30);

      expect(schedulingService.getAvailableSlots).toHaveBeenCalledWith(date, 'nurse-1', 30);
      expect(result).toEqual(mockSlots);
    });

    it('should check availability', async () => {
      const date = new Date('2025-12-01T10:00:00Z');
      schedulingService.checkAvailability.mockResolvedValueOnce(true);

      const result = await service.checkAvailability(date, 'nurse-1', 30);

      expect(schedulingService.checkAvailability).toHaveBeenCalledWith(date, 'nurse-1', 30);
      expect(result).toBe(true);
    });
  });

  describe('Statistics Operations', () => {
    it('should get appointment statistics', async () => {
      const filters = { startDate: new Date('2025-12-01'), endDate: new Date('2025-12-31') };
      const mockStats = {
        total: 100,
        completed: 80,
        cancelled: 15,
        noShow: 5,
      };
      statisticsService.getStatistics.mockResolvedValueOnce(mockStats);

      const result = await service.getStatistics(filters);

      expect(statisticsService.getStatistics).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockStats);
    });
  });

  describe('Waitlist Operations', () => {
    it('should add to waitlist', async () => {
      const waitlistEntry = {
        id: 'waitlist-1',
        studentId: 'student-1',
        appointmentType: 'Checkup',
        priority: 'HIGH',
        requestedDate: new Date('2025-12-01'),
      };
      waitlistService.addToWaitlist.mockResolvedValueOnce(waitlistEntry);

      const result = await service.addToWaitlist({
        studentId: 'student-1',
        appointmentType: 'Checkup',
        requestedDate: new Date('2025-12-01'),
      });

      expect(waitlistService.addToWaitlist).toHaveBeenCalled();
      expect(result).toEqual(waitlistEntry);
    });
  });

  describe('Reminder Operations', () => {
    it('should create reminder', async () => {
      const reminderDto = {
        appointmentId: 'appt-1',
        sendAt: new Date('2025-11-30T10:00:00Z'),
        method: 'email' as const,
      };
      const mockReminder = { id: 'reminder-1', ...reminderDto };
      reminderService.createReminder.mockResolvedValueOnce(mockReminder);

      const result = await service.createReminder(reminderDto);

      expect(reminderService.createReminder).toHaveBeenCalledWith(reminderDto);
      expect(result).toEqual(mockReminder);
    });
  });
});
