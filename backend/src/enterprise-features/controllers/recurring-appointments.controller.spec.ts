import { Test, TestingModule } from '@nestjs/testing';
import { RecurringAppointmentsController } from './recurring-appointments.controller';
import { RecurringAppointmentsService } from '../recurring-appointments.service';
import { CreateRecurringTemplateDto, RecurringTemplateResponseDto } from '../dto';

describe('RecurringAppointmentsController', () => {
  let controller: RecurringAppointmentsController;
  let service: jest.Mocked<RecurringAppointmentsService>;

  const mockRecurringAppointmentsService = {
    createRecurringTemplate: jest.fn(),
    cancelRecurringSeries: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringAppointmentsController],
      providers: [
        {
          provide: RecurringAppointmentsService,
          useValue: mockRecurringAppointmentsService,
        },
      ],
    }).compile();

    controller = module.get<RecurringAppointmentsController>(RecurringAppointmentsController);
    service = module.get(RecurringAppointmentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRecurringTemplate', () => {
    it('should create weekly recurring appointment template', async () => {
      const dto: CreateRecurringTemplateDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'MEDICATION_ADMINISTRATION',
        frequency: 'WEEKLY',
        dayOfWeek: 'MONDAY',
        timeOfDay: '10:00:00',
        startDate: '2025-01-20T00:00:00.000Z',
        createdBy: 'nurse-456',
      };

      const expectedResult: Partial<RecurringTemplateResponseDto> = {
        id: 'template-789',
        studentId: dto.studentId,
        frequency: dto.frequency,
        dayOfWeek: dto.dayOfWeek,
        timeOfDay: dto.timeOfDay,
        status: 'ACTIVE',
      };

      mockRecurringAppointmentsService.createRecurringTemplate.mockResolvedValue(expectedResult);

      const result = await controller.createRecurringTemplate(dto);

      expect(service.createRecurringTemplate).toHaveBeenCalledWith({
        studentId: dto.studentId,
        appointmentType: dto.appointmentType,
        frequency: dto.frequency,
        dayOfWeek: dto.dayOfWeek,
        timeOfDay: dto.timeOfDay,
        startDate: new Date(dto.startDate),
        endDate: undefined,
        createdBy: dto.createdBy,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should create daily recurring appointment template', async () => {
      const dto: CreateRecurringTemplateDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'VITAL_SIGNS_CHECK',
        frequency: 'DAILY',
        dayOfWeek: undefined,
        timeOfDay: '14:00:00',
        startDate: '2025-01-15T00:00:00.000Z',
        endDate: '2025-06-30T00:00:00.000Z',
        createdBy: 'nurse-456',
      };

      const expectedResult: Partial<RecurringTemplateResponseDto> = {
        id: 'template-790',
        studentId: dto.studentId,
        frequency: dto.frequency,
        timeOfDay: dto.timeOfDay,
        status: 'ACTIVE',
      };

      mockRecurringAppointmentsService.createRecurringTemplate.mockResolvedValue(expectedResult);

      const result = await controller.createRecurringTemplate(dto);

      expect(service.createRecurringTemplate).toHaveBeenCalledWith({
        studentId: dto.studentId,
        appointmentType: dto.appointmentType,
        frequency: dto.frequency,
        dayOfWeek: dto.dayOfWeek,
        timeOfDay: dto.timeOfDay,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate!),
        createdBy: dto.createdBy,
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle invalid student ID', async () => {
      const dto: CreateRecurringTemplateDto = {
        studentId: 'invalid-student',
        appointmentType: 'MEDICATION_ADMINISTRATION',
        frequency: 'WEEKLY',
        dayOfWeek: 'MONDAY',
        timeOfDay: '10:00:00',
        startDate: '2025-01-20T00:00:00.000Z',
        createdBy: 'nurse-456',
      };

      mockRecurringAppointmentsService.createRecurringTemplate.mockRejectedValue(
        new Error('Student not found'),
      );

      await expect(controller.createRecurringTemplate(dto)).rejects.toThrow(
        'Student not found',
      );
    });

    it('should handle invalid time format', async () => {
      const dto: CreateRecurringTemplateDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'MEDICATION_ADMINISTRATION',
        frequency: 'WEEKLY',
        dayOfWeek: 'MONDAY',
        timeOfDay: 'invalid-time',
        startDate: '2025-01-20T00:00:00.000Z',
        createdBy: 'nurse-456',
      };

      mockRecurringAppointmentsService.createRecurringTemplate.mockRejectedValue(
        new Error('Invalid time format'),
      );

      await expect(controller.createRecurringTemplate(dto)).rejects.toThrow(
        'Invalid time format',
      );
    });

    it('should handle end date before start date', async () => {
      const dto: CreateRecurringTemplateDto = {
        studentId: '123e4567-e89b-12d3-a456-426614174000',
        appointmentType: 'MEDICATION_ADMINISTRATION',
        frequency: 'WEEKLY',
        dayOfWeek: 'MONDAY',
        timeOfDay: '10:00:00',
        startDate: '2025-06-01T00:00:00.000Z',
        endDate: '2025-01-01T00:00:00.000Z',
        createdBy: 'nurse-456',
      };

      mockRecurringAppointmentsService.createRecurringTemplate.mockRejectedValue(
        new Error('End date must be after start date'),
      );

      await expect(controller.createRecurringTemplate(dto)).rejects.toThrow(
        'End date must be after start date',
      );
    });
  });

  describe('cancelRecurringSeries', () => {
    it('should cancel recurring series successfully', async () => {
      const templateId = 'template-789';
      const expectedResult = {
        templateId,
        status: 'CANCELLED',
        message: 'Recurring series cancelled successfully',
        affectedAppointments: 12,
      };

      mockRecurringAppointmentsService.cancelRecurringSeries.mockResolvedValue(expectedResult);

      const result = await controller.cancelRecurringSeries(templateId);

      expect(service.cancelRecurringSeries).toHaveBeenCalledWith(
        templateId,
        'system',
        'API cancellation',
      );
      expect(result).toEqual(expectedResult);
    });

    it('should handle nonexistent template', async () => {
      const templateId = 'nonexistent-template';

      mockRecurringAppointmentsService.cancelRecurringSeries.mockRejectedValue(
        new Error('Template not found'),
      );

      await expect(controller.cancelRecurringSeries(templateId)).rejects.toThrow(
        'Template not found',
      );
    });

    it('should handle already cancelled template', async () => {
      const templateId = 'template-789';

      mockRecurringAppointmentsService.cancelRecurringSeries.mockRejectedValue(
        new Error('Template is already cancelled'),
      );

      await expect(controller.cancelRecurringSeries(templateId)).rejects.toThrow(
        'Template is already cancelled',
      );
    });

    it('should handle service errors during cancellation', async () => {
      const templateId = 'template-789';

      mockRecurringAppointmentsService.cancelRecurringSeries.mockRejectedValue(
        new Error('Failed to cancel future appointments'),
      );

      await expect(controller.cancelRecurringSeries(templateId)).rejects.toThrow(
        'Failed to cancel future appointments',
      );
    });
  });
});
