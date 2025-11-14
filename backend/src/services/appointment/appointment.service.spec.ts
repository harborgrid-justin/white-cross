/**
 * @fileoverview Appointment Service Tests (Facade)
 * @module appointment/appointment.service.spec
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { RequestContextService } from '@/common/context/request-context.service';
import { AppConfigService } from '@/common/config/app-config.service';
import { AppointmentReadService } from './services/appointment-read.service';
import { AppointmentWriteService } from './services/appointment-write.service';
import { AppointmentStatusService } from './services/appointment-status.service';
import { AppointmentQueryService } from './services/appointment-query.service';
import { AppointmentSchedulingService } from './services/appointment-scheduling.service';
import { AppointmentStatisticsService } from './services/appointment-statistics.service';
import { AppointmentRecurringService } from './services/appointment-recurring.service';
import { WaitlistService } from './services/waitlist.service';
import { ReminderService } from './services/reminder.service';
import { Appointment } from '@/database/models';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

describe('AppointmentService', () => {
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
  let configService: jest.Mocked<AppConfigService>;

  const mockAppointment: Partial<Appointment> = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    studentId: 'student-1',
    nurseId: 'nurse-1',
    status: 'SCHEDULED',
    startTime: new Date('2024-01-15T10:00:00Z'),
    duration: 30,
  };

  beforeEach(async () => {
    const mockServices = {
      readService: { getAppointments: jest.fn(), getAppointmentById: jest.fn() },
      writeService: { createAppointment: jest.fn(), updateAppointment: jest.fn(), cancelAppointment: jest.fn() },
      statusService: { startAppointment: jest.fn(), completeAppointment: jest.fn(), markNoShow: jest.fn() },
      queryService: { getUpcomingAppointments: jest.fn(), getAppointmentsByDate: jest.fn(), getGeneralUpcomingAppointments: jest.fn(), getAppointmentHistory: jest.fn(), getAppointmentsByDateRange: jest.fn(), getAppointmentsForStudents: jest.fn(), searchAppointments: jest.fn() },
      schedulingService: { checkAvailability: jest.fn(), getAvailableSlots: jest.fn(), checkConflicts: jest.fn() },
      statisticsService: { getStatistics: jest.fn(), getAppointmentTrends: jest.fn(), getNoShowStats: jest.fn(), getNoShowCount: jest.fn(), getUtilizationStats: jest.fn(), exportCalendar: jest.fn() },
      recurringService: { createRecurringAppointments: jest.fn(), bulkCancelAppointments: jest.fn() },
      waitlistService: { addToWaitlist: jest.fn(), getWaitlist: jest.fn(), updateWaitlistPriority: jest.fn(), getWaitlistPosition: jest.fn(), notifyWaitlistEntry: jest.fn(), removeFromWaitlist: jest.fn(), cleanupExpiredEntries: jest.fn() },
      reminderService: { processPendingReminders: jest.fn(), getAppointmentReminders: jest.fn(), scheduleReminder: jest.fn(), cancelReminder: jest.fn() },
      configService: { isProduction: false },
      requestContext: { requestId: 'test', userId: 'user-1', getLogContext: jest.fn(), getAuditContext: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: RequestContextService, useValue: mockServices.requestContext },
        { provide: AppointmentReadService, useValue: mockServices.readService },
        { provide: AppointmentWriteService, useValue: mockServices.writeService },
        { provide: AppointmentStatusService, useValue: mockServices.statusService },
        { provide: AppointmentQueryService, useValue: mockServices.queryService },
        { provide: AppointmentSchedulingService, useValue: mockServices.schedulingService },
        { provide: AppointmentStatisticsService, useValue: mockServices.statisticsService },
        { provide: AppointmentRecurringService, useValue: mockServices.recurringService },
        { provide: WaitlistService, useValue: mockServices.waitlistService },
        { provide: ReminderService, useValue: mockServices.reminderService },
        { provide: AppConfigService, useValue: mockServices.configService },
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
    configService = module.get(AppConfigService);
  });

  describe('CRUD Operations', () => {
    it('should delegate getAppointments to readService', async () => {
      const mockResponse = { data: [mockAppointment], meta: { page: 1, limit: 20, total: 1, pages: 1 } };
      readService.getAppointments.mockResolvedValue(mockResponse);

      const result = await service.getAppointments({});

      expect(result).toEqual(mockResponse);
      expect(readService.getAppointments).toHaveBeenCalledWith({});
    });

    it('should delegate getAppointmentById to readService', async () => {
      readService.getAppointmentById.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.getAppointmentById('appt-1');

      expect(result).toEqual(mockAppointment);
      expect(readService.getAppointmentById).toHaveBeenCalledWith('appt-1');
    });

    it('should delegate createAppointment to writeService', async () => {
      const createDto: CreateAppointmentDto = {
        studentId: 'student-1',
        nurseId: 'nurse-1',
        type: 'CHECKUP',
        startTime: '2024-01-15T10:00:00Z',
        duration: 30,
        reason: 'Annual checkup',
      };
      writeService.createAppointment.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.createAppointment(createDto);

      expect(result).toEqual(mockAppointment);
      expect(writeService.createAppointment).toHaveBeenCalledWith(createDto);
    });

    it('should delegate updateAppointment to writeService', async () => {
      const updateDto = { duration: 45 };
      writeService.updateAppointment.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.updateAppointment('appt-1', updateDto);

      expect(result).toEqual(mockAppointment);
      expect(writeService.updateAppointment).toHaveBeenCalledWith('appt-1', updateDto);
    });

    it('should delegate cancelAppointment to writeService', async () => {
      writeService.cancelAppointment.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.cancelAppointment('appt-1', 'Student sick');

      expect(result).toEqual(mockAppointment);
      expect(writeService.cancelAppointment).toHaveBeenCalledWith('appt-1', 'Student sick');
    });
  });

  describe('Status Operations', () => {
    it('should delegate startAppointment to statusService', async () => {
      statusService.startAppointment.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.startAppointment('appt-1');

      expect(result).toEqual(mockAppointment);
      expect(statusService.startAppointment).toHaveBeenCalledWith('appt-1');
    });

    it('should delegate completeAppointment to statusService', async () => {
      const completionData = { notes: 'Completed successfully', outcomes: 'Healthy' };
      statusService.completeAppointment.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.completeAppointment('appt-1', completionData);

      expect(result).toEqual(mockAppointment);
      expect(statusService.completeAppointment).toHaveBeenCalledWith('appt-1', completionData);
    });

    it('should delegate markNoShow to statusService', async () => {
      statusService.markNoShow.mockResolvedValue(mockAppointment as Appointment);

      const result = await service.markNoShow('appt-1');

      expect(result).toEqual(mockAppointment);
      expect(statusService.markNoShow).toHaveBeenCalledWith('appt-1');
    });
  });

  describe('Query Operations', () => {
    it('should delegate getUpcomingAppointments to queryService', async () => {
      queryService.getUpcomingAppointments.mockResolvedValue([mockAppointment as Appointment]);

      const result = await service.getUpcomingAppointments('nurse-1', 10);

      expect(result).toEqual([mockAppointment]);
      expect(queryService.getUpcomingAppointments).toHaveBeenCalledWith('nurse-1', 10);
    });

    it('should delegate searchAppointments to queryService', async () => {
      const searchDto = { query: 'checkup', page: 1, limit: 20 };
      const mockResponse = { data: [mockAppointment], meta: { page: 1, limit: 20, total: 1, pages: 1 } };
      queryService.searchAppointments.mockResolvedValue(mockResponse);

      const result = await service.searchAppointments(searchDto);

      expect(result).toEqual(mockResponse);
      expect(queryService.searchAppointments).toHaveBeenCalledWith(searchDto);
    });
  });

  describe('Lifecycle', () => {
    it('should cleanup resources on module destroy', async () => {
      reminderService.processPendingReminders.mockResolvedValue({ processed: 0, sent: 0, failed: 0 });

      await service.onModuleDestroy();

      expect(reminderService.processPendingReminders).toHaveBeenCalled();
    });
  });
});
