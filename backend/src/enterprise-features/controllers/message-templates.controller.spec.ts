import { Test, TestingModule } from '@nestjs/testing';
import { MessageTemplatesController } from './message-templates.controller';
import { MessageTemplateLibraryService } from '../message-template-library.service';
import { CreateMessageTemplateDto, MessageTemplateResponseDto, RenderTemplateDto } from '../dto';

describe('MessageTemplatesController', () => {
  let controller: MessageTemplatesController;
  let service: jest.Mocked<MessageTemplateLibraryService>;

  const mockTemplateService = {
    createMessageTemplate: jest.fn(),
    renderMessageTemplate: jest.fn(),
    getMessageTemplatesByCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageTemplatesController],
      providers: [
        {
          provide: MessageTemplateLibraryService,
          useValue: mockTemplateService,
        },
      ],
    }).compile();

    controller = module.get<MessageTemplatesController>(MessageTemplatesController);
    service = module.get(MessageTemplateLibraryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTemplate', () => {
    it('should create message template', async () => {
      const dto: CreateMessageTemplateDto = {
        name: 'Appointment Reminder',
        category: 'REMINDERS',
        subject: 'Upcoming Appointment',
        body: 'Dear {{parentName}}, {{studentName}} has an appointment on {{appointmentDate}}',
        variables: ['parentName', 'studentName', 'appointmentDate'],
        language: 'en',
        createdBy: 'admin-123',
      };

      const expectedResult: Partial<MessageTemplateResponseDto> = {
        id: 'template-456',
        name: dto.name,
        category: dto.category,
        language: dto.language,
      };

      mockTemplateService.createMessageTemplate.mockResolvedValue(expectedResult);

      const result = await controller.createTemplate(dto);

      expect(service.createMessageTemplate).toHaveBeenCalledWith(
        dto.name,
        dto.category,
        dto.subject,
        dto.body,
        dto.variables,
        dto.language,
        dto.createdBy,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('renderTemplate', () => {
    it('should render template with variables', async () => {
      const templateId = 'template-456';
      const dto: RenderTemplateDto = {
        variables: {
          parentName: 'John Doe',
          studentName: 'Jane Doe',
          appointmentDate: '2025-01-20',
        },
      };

      const expectedResult = {
        rendered: 'Dear John Doe, Jane Doe has an appointment on 2025-01-20',
      };

      mockTemplateService.renderMessageTemplate.mockResolvedValue(expectedResult);

      const result = await controller.renderTemplate(templateId, dto);

      expect(service.renderMessageTemplate).toHaveBeenCalledWith(
        templateId,
        dto.variables,
      );
      expect(result.rendered).toContain('John Doe');
    });
  });

  describe('getTemplatesByCategory', () => {
    it('should retrieve templates by category', async () => {
      const category = 'REMINDERS';
      const expectedTemplates: Partial<MessageTemplateResponseDto>[] = [
        { id: 'template-1', name: 'Appointment Reminder', category },
        { id: 'template-2', name: 'Medication Reminder', category },
      ];

      mockTemplateService.getMessageTemplatesByCategory.mockResolvedValue(expectedTemplates);

      const result = await controller.getTemplatesByCategory(category);

      expect(service.getMessageTemplatesByCategory).toHaveBeenCalledWith(category);
      expect(result).toHaveLength(2);
    });
  });
});
