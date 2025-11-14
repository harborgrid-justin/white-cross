import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from '../services/communication.service';
import { CreateMessageTemplateDto } from '../dto/create-message-template.dto';
import { UpdateMessageTemplateDto } from '../dto/update-message-template.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { BroadcastMessageDto } from '../dto/broadcast-message.dto';
import { EmergencyAlertDto } from '../dto/emergency-alert.dto';

describe('CommunicationController', () => {
  let controller: CommunicationController;
  let communicationService: jest.Mocked<CommunicationService>;

  const mockTemplate = {
    id: 'template-123',
    name: 'Appointment Reminder',
    type: 'email',
    category: 'appointment',
    subject: 'Upcoming Appointment',
    content: 'You have an appointment on {{date}} at {{time}}',
    variables: ['date', 'time'],
    isActive: true,
    createdAt: '2025-10-28T10:00:00Z',
  };

  const mockMessage = {
    id: 'message-123',
    messageId: 'MSG-2024-001234',
    type: 'email',
    recipients: [
      {
        recipientId: 'recipient-1',
        recipientType: 'parent',
        deliveryMethod: 'email',
        status: 'delivered',
      },
    ],
    scheduledFor: null,
    sentAt: '2025-10-28T10:00:00Z',
    deliveryTracking: {
      totalRecipients: 1,
      sentCount: 1,
      deliveredCount: 1,
      failedCount: 0,
    },
  };

  beforeEach(async () => {
    const mockCommunicationService: Partial<jest.Mocked<CommunicationService>> = {
      createMessageTemplate: jest.fn(),
      sendMessage: jest.fn(),
      sendBroadcastMessage: jest.fn(),
      sendEmergencyAlert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommunicationController],
      providers: [
        {
          provide: CommunicationService,
          useValue: mockCommunicationService,
        },
      ],
    }).compile();

    controller = module.get<CommunicationController>(CommunicationController);
    communicationService = module.get(CommunicationService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should inject CommunicationService', () => {
      expect(communicationService).toBeDefined();
    });
  });

  describe('createTemplate', () => {
    it('should create a message template successfully', async () => {
      const dto: CreateMessageTemplateDto = {
        name: 'Appointment Reminder',
        type: 'email',
        category: 'appointment',
        subject: 'Upcoming Appointment',
        content: 'You have an appointment on {{date}} at {{time}}',
        variables: ['date', 'time'],
      };

      communicationService.createMessageTemplate.mockResolvedValue(mockTemplate);

      const result = await controller.createTemplate(dto);

      expect(result).toEqual(mockTemplate);
      expect(communicationService.createMessageTemplate).toHaveBeenCalledWith(dto);
      expect(communicationService.createMessageTemplate).toHaveBeenCalledTimes(1);
    });

    it('should handle SMS template creation', async () => {
      const dto: CreateMessageTemplateDto = {
        name: 'SMS Alert',
        type: 'sms',
        category: 'emergency',
        content: 'Emergency: {{message}}',
        variables: ['message'],
      };
      const smsTemplate = {
        ...mockTemplate,
        type: 'sms',
        category: 'emergency',
        subject: null,
      };

      communicationService.createMessageTemplate.mockResolvedValue(smsTemplate);

      const result = await controller.createTemplate(dto);

      expect(result.type).toBe('sms');
      expect(result.subject).toBeNull();
    });

    it('should handle push notification template', async () => {
      const dto: CreateMessageTemplateDto = {
        name: 'Medication Reminder',
        type: 'push',
        category: 'medication',
        content: 'Time to take {{medication}}',
        variables: ['medication'],
      };
      const pushTemplate = {
        ...mockTemplate,
        type: 'push',
        category: 'medication',
      };

      communicationService.createMessageTemplate.mockResolvedValue(pushTemplate);

      const result = await controller.createTemplate(dto);

      expect(result.type).toBe('push');
    });

    it('should handle validation errors', async () => {
      const dto: CreateMessageTemplateDto = {
        name: '',
        type: 'email',
        category: 'general',
        content: '',
        variables: [],
      };
      const error = new Error('Invalid input data - validation error');

      communicationService.createMessageTemplate.mockRejectedValue(error);

      await expect(controller.createTemplate(dto)).rejects.toThrow('Invalid input data - validation error');
    });

    it('should handle duplicate template names', async () => {
      const dto: CreateMessageTemplateDto = {
        name: 'Existing Template',
        type: 'email',
        category: 'general',
        content: 'Content',
        variables: [],
      };
      const error = new Error('Template with this name already exists');

      communicationService.createMessageTemplate.mockRejectedValue(error);

      await expect(controller.createTemplate(dto)).rejects.toThrow('Template with this name already exists');
    });
  });

  describe('getTemplates', () => {
    it('should retrieve all templates', async () => {
      const result = await controller.getTemplates();

      expect(result).toEqual([]);
    });

    it('should filter by type', async () => {
      const result = await controller.getTemplates('email');

      expect(result).toEqual([]);
    });

    it('should filter by category', async () => {
      const result = await controller.getTemplates(undefined, 'appointment');

      expect(result).toEqual([]);
    });

    it('should filter by both type and category', async () => {
      const result = await controller.getTemplates('sms', 'emergency');

      expect(result).toEqual([]);
    });
  });

  describe('updateTemplate', () => {
    it('should update a template successfully', async () => {
      const templateId = 'template-123';
      const dto: UpdateMessageTemplateDto = {
        name: 'Updated Name',
        content: 'Updated content',
      };

      const result = await controller.updateTemplate(templateId, dto);

      expect(result).toEqual({ success: true });
    });

    it('should handle partial updates', async () => {
      const templateId = 'template-123';
      const dto: UpdateMessageTemplateDto = {
        isActive: false,
      };

      const result = await controller.updateTemplate(templateId, dto);

      expect(result).toEqual({ success: true });
    });

    it('should handle non-existent template', async () => {
      const templateId = 'non-existent';
      const dto: UpdateMessageTemplateDto = {
        name: 'Updated',
      };

      const result = await controller.updateTemplate(templateId, dto);

      expect(result).toEqual({ success: true });
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template successfully', async () => {
      const templateId = 'template-123';

      const result = await controller.deleteTemplate(templateId);

      expect(result).toEqual({ success: true });
    });

    it('should handle non-existent template deletion', async () => {
      const templateId = 'non-existent';

      const result = await controller.deleteTemplate(templateId);

      expect(result).toEqual({ success: true });
    });
  });

  describe('sendMessage', () => {
    it('should send an individual message successfully', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1'],
        variables: { date: '2025-11-01', time: '10:00 AM' },
        type: 'email',
      };

      communicationService.sendMessage.mockResolvedValue(mockMessage);

      const result = await controller.sendMessage(dto);

      expect(result).toEqual(mockMessage);
      expect(communicationService.sendMessage).toHaveBeenCalledWith(dto);
    });

    it('should handle multiple recipients', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1', 'recipient-2', 'recipient-3'],
        variables: { date: '2025-11-01' },
        type: 'email',
      };
      const multiRecipientMessage = {
        ...mockMessage,
        deliveryTracking: {
          totalRecipients: 3,
          sentCount: 3,
          deliveredCount: 2,
          failedCount: 1,
        },
      };

      communicationService.sendMessage.mockResolvedValue(multiRecipientMessage);

      const result = await controller.sendMessage(dto);

      expect(result.deliveryTracking.totalRecipients).toBe(3);
      expect(result.deliveryTracking.failedCount).toBe(1);
    });

    it('should handle scheduled messages', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1'],
        variables: {},
        type: 'email',
        scheduledFor: '2025-11-15T10:00:00Z',
      };
      const scheduledMessage = {
        ...mockMessage,
        scheduledFor: '2025-11-15T10:00:00Z',
        sentAt: null,
      };

      communicationService.sendMessage.mockResolvedValue(scheduledMessage);

      const result = await controller.sendMessage(dto);

      expect(result.scheduledFor).toBeDefined();
      expect(result.sentAt).toBeNull();
    });

    it('should handle SMS messages', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1'],
        variables: {},
        type: 'sms',
      };
      const smsMessage = {
        ...mockMessage,
        type: 'sms',
      };

      communicationService.sendMessage.mockResolvedValue(smsMessage);

      const result = await controller.sendMessage(dto);

      expect(result.type).toBe('sms');
    });

    it('should handle personalization variables', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1'],
        variables: {
          firstName: 'John',
          lastName: 'Doe',
          appointmentDate: '2025-11-01',
          appointmentTime: '10:00 AM',
        },
        type: 'email',
      };

      communicationService.sendMessage.mockResolvedValue(mockMessage);

      const result = await controller.sendMessage(dto);

      expect(result).toEqual(mockMessage);
      expect(communicationService.sendMessage).toHaveBeenCalledWith(dto);
    });

    it('should handle validation errors', async () => {
      const dto: CreateMessageDto = {
        templateId: '',
        recipientIds: [],
        variables: {},
        type: 'email',
      };
      const error = new Error('Invalid message data or validation errors');

      communicationService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto)).rejects.toThrow('Invalid message data or validation errors');
    });

    it('should handle recipient access denied', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['unauthorized-recipient'],
        variables: {},
        type: 'email',
      };
      const error = new Error('Forbidden - Insufficient permissions or recipient access denied');

      communicationService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto)).rejects.toThrow(
        'Forbidden - Insufficient permissions or recipient access denied'
      );
    });
  });

  describe('sendBroadcast', () => {
    it('should send broadcast message successfully', async () => {
      const dto: BroadcastMessageDto = {
        title: 'School Closure Announcement',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: {
          grades: ['K', '1', '2'],
        },
        variables: {},
      };
      const broadcastResult = {
        id: 'broadcast-123',
        broadcastId: 'BCAST-2024-001234',
        title: 'School Closure Announcement',
        type: 'email',
        targetCriteria: { grades: ['K', '1', '2'] },
        estimatedRecipients: 150,
        actualRecipients: 145,
        scheduledFor: null,
        status: 'completed',
        createdAt: '2025-10-28T10:00:00Z',
        deliveryStats: {
          queued: 0,
          sent: 145,
          delivered: 142,
          failed: 3,
          optedOut: 5,
        },
      };

      communicationService.sendBroadcastMessage.mockResolvedValue(broadcastResult);

      const result = await controller.sendBroadcast(dto);

      expect(result).toEqual(broadcastResult);
      expect(communicationService.sendBroadcastMessage).toHaveBeenCalledWith(dto);
    });

    it('should handle multiple targeting criteria', async () => {
      const dto: BroadcastMessageDto = {
        title: 'Health Update',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: {
          grades: ['3', '4', '5'],
          nurses: ['nurse-1', 'nurse-2'],
          studentStatuses: ['active'],
        },
        variables: {},
      };
      const broadcastResult = {
        id: 'broadcast-123',
        broadcastId: 'BCAST-2024-001235',
        title: 'Health Update',
        type: 'email',
        targetCriteria: dto.targetCriteria,
        estimatedRecipients: 200,
        actualRecipients: 195,
        scheduledFor: null,
        status: 'completed',
        createdAt: '2025-10-28T10:00:00Z',
        deliveryStats: {
          queued: 0,
          sent: 195,
          delivered: 190,
          failed: 5,
          optedOut: 5,
        },
      };

      communicationService.sendBroadcastMessage.mockResolvedValue(broadcastResult);

      const result = await controller.sendBroadcast(dto);

      expect(result.targetCriteria).toEqual(dto.targetCriteria);
      expect(result.estimatedRecipients).toBe(200);
    });

    it('should handle scheduled broadcasts', async () => {
      const dto: BroadcastMessageDto = {
        title: 'Weekly Newsletter',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: { recipientTypes: ['parent'] },
        variables: {},
        scheduledFor: '2025-11-01T08:00:00Z',
      };
      const scheduledBroadcast = {
        id: 'broadcast-123',
        broadcastId: 'BCAST-2024-001236',
        title: 'Weekly Newsletter',
        type: 'email',
        targetCriteria: dto.targetCriteria,
        estimatedRecipients: 500,
        actualRecipients: 0,
        scheduledFor: '2025-11-01T08:00:00Z',
        status: 'scheduled',
        createdAt: '2025-10-28T10:00:00Z',
        deliveryStats: {
          queued: 500,
          sent: 0,
          delivered: 0,
          failed: 0,
          optedOut: 0,
        },
      };

      communicationService.sendBroadcastMessage.mockResolvedValue(scheduledBroadcast);

      const result = await controller.sendBroadcast(dto);

      expect(result.status).toBe('scheduled');
      expect(result.deliveryStats.queued).toBe(500);
    });

    it('should handle no recipients matching criteria', async () => {
      const dto: BroadcastMessageDto = {
        title: 'Test Broadcast',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: { grades: ['nonexistent'] },
        variables: {},
      };
      const error = new Error('Broadcast criteria results in no recipients');

      communicationService.sendBroadcastMessage.mockRejectedValue(error);

      await expect(controller.sendBroadcast(dto)).rejects.toThrow('Broadcast criteria results in no recipients');
    });

    it('should handle opt-out filtering', async () => {
      const dto: BroadcastMessageDto = {
        title: 'General Announcement',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: { recipientTypes: ['parent', 'staff'] },
        variables: {},
      };
      const broadcastResult = {
        id: 'broadcast-123',
        broadcastId: 'BCAST-2024-001237',
        title: 'General Announcement',
        type: 'email',
        targetCriteria: dto.targetCriteria,
        estimatedRecipients: 300,
        actualRecipients: 250,
        scheduledFor: null,
        status: 'completed',
        createdAt: '2025-10-28T10:00:00Z',
        deliveryStats: {
          queued: 0,
          sent: 250,
          delivered: 245,
          failed: 5,
          optedOut: 50,
        },
      };

      communicationService.sendBroadcastMessage.mockResolvedValue(broadcastResult);

      const result = await controller.sendBroadcast(dto);

      expect(result.deliveryStats.optedOut).toBe(50);
      expect(result.actualRecipients).toBeLessThan(result.estimatedRecipients);
    });
  });

  describe('sendEmergencyAlert', () => {
    it('should send emergency alert successfully', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'medical_emergency',
        severity: 'critical',
        title: 'Medical Emergency - Room 205',
        message: 'Student requires immediate medical attention in Room 205',
        affectedAreas: ['Building A', 'Room 205'],
        deliveryChannels: ['sms', 'email', 'push', 'voice_call'],
      };
      const alertResult = {
        id: 'alert-123',
        alertId: 'EMRG-2024-001234',
        alertType: 'medical_emergency',
        severity: 'critical',
        title: dto.title,
        message: dto.message,
        affectedAreas: dto.affectedAreas,
        targetRecipients: {
          parents: 1,
          staff: 25,
          emergencyContacts: 2,
          authorities: 3,
        },
        deliveryChannels: dto.deliveryChannels,
        sentAt: '2025-10-28T10:00:00Z',
        escalationLevel: 5,
        deliveryStatus: {
          immediate: 31,
          delivered: 28,
          failed: 3,
          retrying: 0,
        },
        authoritiesNotified: true,
        followUpRequired: true,
      };

      communicationService.sendEmergencyAlert.mockResolvedValue(alertResult);

      const result = await controller.sendEmergencyAlert(dto);

      expect(result).toEqual(alertResult);
      expect(communicationService.sendEmergencyAlert).toHaveBeenCalledWith(dto);
    });

    it('should handle lockdown alert', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'lockdown',
        severity: 'critical',
        title: 'LOCKDOWN - Secure All Areas',
        message: 'Immediate lockdown in effect. Secure all doors and stay inside.',
        affectedAreas: ['All Buildings'],
        deliveryChannels: ['sms', 'email', 'push', 'pa_system'],
      };
      const lockdownAlert = {
        id: 'alert-124',
        alertId: 'EMRG-2024-001235',
        alertType: 'lockdown',
        severity: 'critical',
        title: dto.title,
        message: dto.message,
        affectedAreas: dto.affectedAreas,
        targetRecipients: {
          parents: 500,
          staff: 100,
          emergencyContacts: 600,
          authorities: 5,
        },
        deliveryChannels: dto.deliveryChannels,
        sentAt: '2025-10-28T10:00:00Z',
        escalationLevel: 5,
        deliveryStatus: {
          immediate: 1205,
          delivered: 1180,
          failed: 25,
          retrying: 0,
        },
        authoritiesNotified: true,
        followUpRequired: true,
      };

      communicationService.sendEmergencyAlert.mockResolvedValue(lockdownAlert);

      const result = await controller.sendEmergencyAlert(dto);

      expect(result.alertType).toBe('lockdown');
      expect(result.authoritiesNotified).toBe(true);
    });

    it('should handle weather emergency', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'weather',
        severity: 'high',
        title: 'Severe Weather Alert',
        message: 'Tornado warning in effect. Move to designated shelter areas.',
        affectedAreas: ['All Buildings'],
        deliveryChannels: ['sms', 'push', 'pa_system'],
      };
      const weatherAlert = {
        id: 'alert-125',
        alertId: 'EMRG-2024-001236',
        alertType: 'weather',
        severity: 'high',
        title: dto.title,
        message: dto.message,
        affectedAreas: dto.affectedAreas,
        targetRecipients: {
          parents: 450,
          staff: 90,
          emergencyContacts: 500,
          authorities: 2,
        },
        deliveryChannels: dto.deliveryChannels,
        sentAt: '2025-10-28T10:00:00Z',
        escalationLevel: 4,
        deliveryStatus: {
          immediate: 1042,
          delivered: 1030,
          failed: 12,
          retrying: 0,
        },
        authoritiesNotified: true,
        followUpRequired: true,
      };

      communicationService.sendEmergencyAlert.mockResolvedValue(weatherAlert);

      const result = await controller.sendEmergencyAlert(dto);

      expect(result.alertType).toBe('weather');
      expect(result.severity).toBe('high');
    });

    it('should handle evacuation alert', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'evacuation',
        severity: 'critical',
        title: 'EVACUATION ORDER',
        message: 'Evacuate all buildings immediately. Proceed to assembly point.',
        affectedAreas: ['Building A', 'Building B', 'Building C'],
        deliveryChannels: ['sms', 'email', 'push', 'voice_call', 'pa_system'],
      };
      const evacuationAlert = {
        id: 'alert-126',
        alertId: 'EMRG-2024-001237',
        alertType: 'evacuation',
        severity: 'critical',
        title: dto.title,
        message: dto.message,
        affectedAreas: dto.affectedAreas,
        targetRecipients: {
          parents: 600,
          staff: 120,
          emergencyContacts: 700,
          authorities: 10,
        },
        deliveryChannels: dto.deliveryChannels,
        sentAt: '2025-10-28T10:00:00Z',
        escalationLevel: 5,
        deliveryStatus: {
          immediate: 1430,
          delivered: 1400,
          failed: 30,
          retrying: 0,
        },
        authoritiesNotified: true,
        followUpRequired: true,
      };

      communicationService.sendEmergencyAlert.mockResolvedValue(evacuationAlert);

      const result = await controller.sendEmergencyAlert(dto);

      expect(result.alertType).toBe('evacuation');
      expect(result.escalationLevel).toBe(5);
    });

    it('should handle security alert', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'security',
        severity: 'medium',
        title: 'Security Incident',
        message: 'Security incident reported. Stay alert and report suspicious activity.',
        affectedAreas: ['Parking Lot'],
        deliveryChannels: ['sms', 'push'],
      };
      const securityAlert = {
        id: 'alert-127',
        alertId: 'EMRG-2024-001238',
        alertType: 'security',
        severity: 'medium',
        title: dto.title,
        message: dto.message,
        affectedAreas: dto.affectedAreas,
        targetRecipients: {
          parents: 0,
          staff: 50,
          emergencyContacts: 0,
          authorities: 2,
        },
        deliveryChannels: dto.deliveryChannels,
        sentAt: '2025-10-28T10:00:00Z',
        escalationLevel: 2,
        deliveryStatus: {
          immediate: 52,
          delivered: 50,
          failed: 2,
          retrying: 0,
        },
        authoritiesNotified: true,
        followUpRequired: false,
      };

      communicationService.sendEmergencyAlert.mockResolvedValue(securityAlert);

      const result = await controller.sendEmergencyAlert(dto);

      expect(result.alertType).toBe('security');
      expect(result.escalationLevel).toBe(2);
    });

    it('should handle critical delivery failure', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'medical_emergency',
        severity: 'critical',
        title: 'Emergency',
        message: 'Emergency situation',
        affectedAreas: ['Room 101'],
        deliveryChannels: ['sms'],
      };
      const error = new Error('CRITICAL ERROR - Emergency alert delivery failed');

      communicationService.sendEmergencyAlert.mockRejectedValue(error);

      await expect(controller.sendEmergencyAlert(dto)).rejects.toThrow(
        'CRITICAL ERROR - Emergency alert delivery failed'
      );
    });

    it('should handle missing critical information', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'medical_emergency',
        severity: 'critical',
        title: '',
        message: '',
        affectedAreas: [],
        deliveryChannels: [],
      };
      const error = new Error('Invalid alert data or missing critical information');

      communicationService.sendEmergencyAlert.mockRejectedValue(error);

      await expect(controller.sendEmergencyAlert(dto)).rejects.toThrow(
        'Invalid alert data or missing critical information'
      );
    });
  });

  describe('getMessages', () => {
    it('should retrieve message history with default pagination', async () => {
      const result = await controller.getMessages(1, 20);

      expect(result).toEqual({
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      });
    });

    it('should handle custom pagination', async () => {
      const result = await controller.getMessages(2, 50);

      expect(result.pagination.page).toBe(2);
      expect(result.pagination.limit).toBe(50);
    });
  });

  describe('getMessage', () => {
    it('should retrieve a specific message', async () => {
      const messageId = 'message-123';

      const result = await controller.getMessage(messageId);

      expect(result).toEqual({});
    });
  });

  describe('getDeliveryStatus', () => {
    it('should retrieve delivery status for a message', async () => {
      const messageId = 'message-123';

      const result = await controller.getDeliveryStatus(messageId);

      expect(result).toEqual({ deliveries: [], summary: {} });
    });
  });

  describe('getStatistics', () => {
    it('should retrieve communication statistics', async () => {
      const result = await controller.getStatistics();

      expect(result).toEqual({});
    });

    it('should retrieve statistics with date range', async () => {
      const from = '2025-10-01';
      const to = '2025-10-31';

      const result = await controller.getStatistics(from, to);

      expect(result).toEqual({});
    });
  });

  describe('error handling', () => {
    it('should handle service unavailable errors', async () => {
      const dto: CreateMessageDto = {
        templateId: 'template-123',
        recipientIds: ['recipient-1'],
        variables: {},
        type: 'email',
      };
      const error = new Error('Internal server error or delivery service failure');

      communicationService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto)).rejects.toThrow(
        'Internal server error or delivery service failure'
      );
    });

    it('should handle network timeout errors', async () => {
      const dto: BroadcastMessageDto = {
        title: 'Test',
        templateId: 'template-123',
        type: 'email',
        targetCriteria: {},
        variables: {},
      };
      const error = new Error('Network timeout');

      communicationService.sendBroadcastMessage.mockRejectedValue(error);

      await expect(controller.sendBroadcast(dto)).rejects.toThrow('Network timeout');
    });

    it('should handle unauthorized access', async () => {
      const dto: EmergencyAlertDto = {
        alertType: 'medical_emergency',
        severity: 'critical',
        title: 'Test',
        message: 'Test',
        affectedAreas: [],
        deliveryChannels: ['sms'],
      };
      const error = new Error('Forbidden - Admin or authorized emergency personnel only');

      communicationService.sendEmergencyAlert.mockRejectedValue(error);

      await expect(controller.sendEmergencyAlert(dto)).rejects.toThrow(
        'Forbidden - Admin or authorized emergency personnel only'
      );
    });
  });
});
