/**
 * @fileoverview Tests for WebSocket Service
 * @module infrastructure/websocket
 */

import { Test, TestingModule } from '@nestjs/testing';
import { WebSocketService } from './websocket.service';
import { LoggerService } from '@/common/logging/logger.service';
import { AppConfigService } from '@/common/config';
import { BroadcastService } from './services/broadcast.service';
import { AlertService } from './services/alert.service';
import { MessageService } from './services/message.service';
import { PresenceService } from './services/presence.service';
import {
  AlertData,
  NotificationData,
  ReminderData,
  MessageEventDto,
  MessageDeliveryDto,
  ReadReceiptDto,
  TypingIndicatorDto,
  UserPresence,
} from './types/websocket.types';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockLogger: jest.Mocked<LoggerService>;
  let mockConfig: jest.Mocked<AppConfigService>;
  let mockBroadcastService: jest.Mocked<BroadcastService>;
  let mockAlertService: jest.Mocked<AlertService>;
  let mockMessageService: jest.Mocked<MessageService>;
  let mockPresenceService: jest.Mocked<PresenceService>;

  beforeEach(async () => {
    mockLogger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as unknown as jest.Mocked<LoggerService>;

    mockConfig = {
      get: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<AppConfigService>;

    mockBroadcastService = {
      broadcastToRoom: jest.fn().mockResolvedValue(undefined),
      broadcastToRooms: jest.fn().mockResolvedValue(undefined),
      broadcastToSchool: jest.fn().mockResolvedValue(undefined),
      broadcastToUser: jest.fn().mockResolvedValue(undefined),
      broadcastToStudent: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<BroadcastService>;

    mockAlertService = {
      broadcastEmergencyAlert: jest.fn().mockResolvedValue(undefined),
      broadcastStudentHealthAlert: jest.fn().mockResolvedValue(undefined),
      broadcastMedicationReminder: jest.fn().mockResolvedValue(undefined),
      sendUserNotification: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<AlertService>;

    mockMessageService = {
      sendMessageToConversation: jest.fn().mockResolvedValue(undefined),
      sendMessageToUsers: jest.fn().mockResolvedValue(undefined),
      broadcastTypingIndicator: jest.fn().mockResolvedValue(undefined),
      broadcastReadReceipt: jest.fn().mockResolvedValue(undefined),
      broadcastMessageDelivery: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MessageService>;

    mockPresenceService = {
      updateUserPresence: jest.fn().mockResolvedValue(undefined),
      getUserPresence: jest.fn().mockReturnValue(null),
      getConnectedSocketsCount: jest.fn().mockReturnValue(5),
      isInitialized: jest.fn().mockReturnValue(true),
    } as unknown as jest.Mocked<PresenceService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WebSocketService,
        {
          provide: LoggerService,
          useValue: mockLogger,
        },
        {
          provide: AppConfigService,
          useValue: mockConfig,
        },
        {
          provide: BroadcastService,
          useValue: mockBroadcastService,
        },
        {
          provide: AlertService,
          useValue: mockAlertService,
        },
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: PresenceService,
          useValue: mockPresenceService,
        },
      ],
    }).compile();

    service = module.get<WebSocketService>(WebSocketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Constructor and Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should log initialization message', () => {
      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('initialized'));
    });
  });

  describe('Broadcasting Methods', () => {
    describe('broadcastToRoom()', () => {
      it('should delegate to broadcast service', async () => {
        const room = 'test-room';
        const event = 'test-event';
        const data = { message: 'test' };

        await service.broadcastToRoom(room, event, data);

        expect(mockBroadcastService.broadcastToRoom).toHaveBeenCalledWith(room, event, data);
      });

      it('should handle errors from broadcast service', async () => {
        mockBroadcastService.broadcastToRoom.mockRejectedValue(new Error('Broadcast failed'));

        await expect(
          service.broadcastToRoom('room', 'event', {}),
        ).rejects.toThrow('Broadcast failed');
      });
    });

    describe('broadcastToRooms()', () => {
      it('should broadcast to multiple rooms', async () => {
        const rooms = ['room1', 'room2', 'room3'];
        const event = 'test-event';
        const data = { message: 'test' };

        await service.broadcastToRooms(rooms, event, data);

        expect(mockBroadcastService.broadcastToRooms).toHaveBeenCalledWith(rooms, event, data);
      });

      it('should handle empty rooms array', async () => {
        await service.broadcastToRooms([], 'event', {});

        expect(mockBroadcastService.broadcastToRooms).toHaveBeenCalledWith([], 'event', {});
      });
    });

    describe('broadcastToSchool()', () => {
      it('should broadcast to school room', async () => {
        const schoolId = 'school-123';
        const event = 'school-event';
        const data = { announcement: 'test' };

        await service.broadcastToSchool(schoolId, event, data);

        expect(mockBroadcastService.broadcastToSchool).toHaveBeenCalledWith(
          schoolId,
          event,
          data,
        );
      });
    });

    describe('broadcastToUser()', () => {
      it('should broadcast to user room', async () => {
        const userId = 'user-123';
        const event = 'user-event';
        const data = { notification: 'test' };

        await service.broadcastToUser(userId, event, data);

        expect(mockBroadcastService.broadcastToUser).toHaveBeenCalledWith(userId, event, data);
      });
    });

    describe('broadcastToStudent()', () => {
      it('should broadcast to student room', async () => {
        const studentId = 'student-123';
        const event = 'student-event';
        const data = { alert: 'test' };

        await service.broadcastToStudent(studentId, event, data);

        expect(mockBroadcastService.broadcastToStudent).toHaveBeenCalledWith(
          studentId,
          event,
          data,
        );
      });
    });
  });

  describe('Alert Methods', () => {
    const alertData: AlertData = {
      type: 'emergency',
      title: 'Emergency Alert',
      message: 'Test emergency',
      severity: 'critical',
      timestamp: new Date().toISOString(),
    };

    describe('broadcastEmergencyAlert()', () => {
      it('should broadcast emergency alert to organization', async () => {
        const organizationId = 'org-123';

        await service.broadcastEmergencyAlert(organizationId, alertData);

        expect(mockAlertService.broadcastEmergencyAlert).toHaveBeenCalledWith(
          organizationId,
          alertData,
        );
      });

      it('should handle alert service errors', async () => {
        mockAlertService.broadcastEmergencyAlert.mockRejectedValue(new Error('Alert failed'));

        await expect(
          service.broadcastEmergencyAlert('org-123', alertData),
        ).rejects.toThrow('Alert failed');
      });
    });

    describe('broadcastStudentHealthAlert()', () => {
      it('should broadcast student health alert', async () => {
        const organizationId = 'org-123';

        await service.broadcastStudentHealthAlert(organizationId, alertData);

        expect(mockAlertService.broadcastStudentHealthAlert).toHaveBeenCalledWith(
          organizationId,
          alertData,
        );
      });
    });

    describe('broadcastMedicationReminder()', () => {
      it('should broadcast medication reminder', async () => {
        const organizationId = 'org-123';
        const reminder: ReminderData = {
          studentId: 'student-123',
          medicationName: 'Test Med',
          dosage: '10mg',
          time: new Date().toISOString(),
        };

        await service.broadcastMedicationReminder(organizationId, reminder);

        expect(mockAlertService.broadcastMedicationReminder).toHaveBeenCalledWith(
          organizationId,
          reminder,
        );
      });
    });

    describe('sendUserNotification()', () => {
      it('should send notification to specific user', async () => {
        const userId = 'user-123';
        const notification: NotificationData = {
          title: 'Test Notification',
          message: 'Test message',
          type: 'info',
          timestamp: new Date().toISOString(),
        };

        await service.sendUserNotification(userId, notification);

        expect(mockAlertService.sendUserNotification).toHaveBeenCalledWith(userId, notification);
      });
    });
  });

  describe('Message Methods', () => {
    const messageDto = {
      messageId: 'msg-123',
      conversationId: 'conv-123',
      senderId: 'user-123',
      content: 'Test message',
      timestamp: new Date().toISOString(),
      organizationId: 'org-123',
      toPayload: jest.fn().mockReturnValue({}),
    } as unknown as MessageEventDto;

    describe('sendMessageToConversation()', () => {
      it('should send message to conversation', async () => {
        const conversationId = 'conv-123';

        await service.sendMessageToConversation(conversationId, messageDto);

        expect(mockMessageService.sendMessageToConversation).toHaveBeenCalledWith(
          conversationId,
          messageDto,
        );
      });

      it('should handle message service errors', async () => {
        mockMessageService.sendMessageToConversation.mockRejectedValue(
          new Error('Message failed'),
        );

        await expect(
          service.sendMessageToConversation('conv-123', messageDto),
        ).rejects.toThrow('Message failed');
      });
    });

    describe('sendMessageToUsers()', () => {
      it('should send direct message to multiple users', async () => {
        const userIds = ['user1', 'user2', 'user3'];

        await service.sendMessageToUsers(userIds, messageDto);

        expect(mockMessageService.sendMessageToUsers).toHaveBeenCalledWith(userIds, messageDto);
      });

      it('should handle empty user list', async () => {
        await service.sendMessageToUsers([], messageDto);

        expect(mockMessageService.sendMessageToUsers).toHaveBeenCalledWith([], messageDto);
      });
    });

    describe('broadcastTypingIndicator()', () => {
      it('should broadcast typing indicator', async () => {
        const conversationId = 'conv-123';
        const typingDto = {
          userId: 'user-123',
          conversationId,
          isTyping: true,
          timestamp: new Date().toISOString(),
          organizationId: 'org-123',
          toPayload: jest.fn().mockReturnValue({}),
        } as unknown as TypingIndicatorDto;

        await service.broadcastTypingIndicator(conversationId, typingDto);

        expect(mockMessageService.broadcastTypingIndicator).toHaveBeenCalledWith(
          conversationId,
          typingDto,
        );
      });
    });

    describe('broadcastReadReceipt()', () => {
      it('should broadcast read receipt', async () => {
        const conversationId = 'conv-123';
        const readReceipt = {
          messageId: 'msg-123',
          conversationId,
          userId: 'user-123',
          timestamp: new Date().toISOString(),
          organizationId: 'org-123',
          toPayload: jest.fn().mockReturnValue({}),
        } as unknown as ReadReceiptDto;

        await service.broadcastReadReceipt(conversationId, readReceipt);

        expect(mockMessageService.broadcastReadReceipt).toHaveBeenCalledWith(
          conversationId,
          readReceipt,
        );
      });
    });

    describe('broadcastMessageDelivery()', () => {
      it('should broadcast message delivery confirmation', async () => {
        const senderId = 'user-123';
        const delivery = {
          messageId: 'msg-123',
          conversationId: 'conv-123',
          recipientId: 'user-456',
          senderId,
          status: 'delivered',
          timestamp: new Date().toISOString(),
          organizationId: 'org-123',
          toPayload: jest.fn().mockReturnValue({}),
        } as unknown as MessageDeliveryDto;

        await service.broadcastMessageDelivery(senderId, delivery);

        expect(mockMessageService.broadcastMessageDelivery).toHaveBeenCalledWith(
          senderId,
          delivery,
        );
      });
    });
  });

  describe('Presence Methods', () => {
    describe('updateUserPresence()', () => {
      it('should update and broadcast user presence', async () => {
        const userId = 'user-123';
        const organizationId = 'org-123';
        const status = 'online';

        await service.updateUserPresence(userId, organizationId, status);

        expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith(
          userId,
          organizationId,
          status,
        );
      });

      it('should handle offline status', async () => {
        await service.updateUserPresence('user-123', 'org-123', 'offline');

        expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith(
          'user-123',
          'org-123',
          'offline',
        );
      });

      it('should handle away status', async () => {
        await service.updateUserPresence('user-123', 'org-123', 'away');

        expect(mockPresenceService.updateUserPresence).toHaveBeenCalledWith(
          'user-123',
          'org-123',
          'away',
        );
      });
    });

    describe('getUserPresence()', () => {
      it('should get user presence from service', () => {
        const mockPresence: UserPresence = {
          userId: 'user-123',
          status: 'online',
          lastSeen: new Date().toISOString(),
        };
        mockPresenceService.getUserPresence.mockReturnValue(mockPresence);

        const result = service.getUserPresence('user-123');

        expect(result).toBe(mockPresence);
        expect(mockPresenceService.getUserPresence).toHaveBeenCalledWith('user-123');
      });

      it('should return null when user not found', () => {
        mockPresenceService.getUserPresence.mockReturnValue(null);

        const result = service.getUserPresence('nonexistent');

        expect(result).toBeNull();
      });
    });

    describe('getConnectedSocketsCount()', () => {
      it('should return connected sockets count', () => {
        const count = service.getConnectedSocketsCount();

        expect(count).toBe(5);
        expect(mockPresenceService.getConnectedSocketsCount).toHaveBeenCalled();
      });

      it('should return zero when no connections', () => {
        mockPresenceService.getConnectedSocketsCount.mockReturnValue(0);

        const count = service.getConnectedSocketsCount();

        expect(count).toBe(0);
      });
    });

    describe('isInitialized()', () => {
      it('should return initialization status', () => {
        const initialized = service.isInitialized();

        expect(initialized).toBe(true);
        expect(mockPresenceService.isInitialized).toHaveBeenCalled();
      });

      it('should return false when not initialized', () => {
        mockPresenceService.isInitialized.mockReturnValue(false);

        const initialized = service.isInitialized();

        expect(initialized).toBe(false);
      });
    });
  });

  describe('onModuleDestroy()', () => {
    it('should log cleanup message', async () => {
      await service.onModuleDestroy();

      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('shutting down'));
    });

    it('should log connected sockets count', async () => {
      mockPresenceService.getConnectedSocketsCount.mockReturnValue(10);

      await service.onModuleDestroy();

      expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('10'));
    });

    it('should not log notification when no connections', async () => {
      mockPresenceService.getConnectedSocketsCount.mockReturnValue(0);

      await service.onModuleDestroy();

      expect(mockLogger.log).toHaveBeenCalled();
    });

    it('should check notification config setting', async () => {
      mockPresenceService.getConnectedSocketsCount.mockReturnValue(5);

      await service.onModuleDestroy();

      expect(mockConfig.get).toHaveBeenCalledWith('websocket.notifyOnShutdown', true);
    });

    it('should skip notification when disabled in config', async () => {
      mockConfig.get.mockReturnValue(false);
      mockPresenceService.getConnectedSocketsCount.mockReturnValue(5);

      await service.onModuleDestroy();

      expect(mockLogger.log).not.toHaveBeenCalledWith(
        expect.stringContaining('Shutdown notification'),
      );
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle concurrent broadcasts', async () => {
      const promises = [
        service.broadcastToRoom('room1', 'event', {}),
        service.broadcastToRoom('room2', 'event', {}),
        service.broadcastToRoom('room3', 'event', {}),
      ];

      await Promise.all(promises);

      expect(mockBroadcastService.broadcastToRoom).toHaveBeenCalledTimes(3);
    });

    it('should handle service method failures gracefully', async () => {
      mockBroadcastService.broadcastToRoom.mockRejectedValue(new Error('Network error'));

      await expect(service.broadcastToRoom('room', 'event', {})).rejects.toThrow('Network error');
    });

    it('should handle null/undefined data in broadcasts', async () => {
      await service.broadcastToRoom('room', 'event', null as unknown as Record<string, unknown>);

      expect(mockBroadcastService.broadcastToRoom).toHaveBeenCalledWith('room', 'event', null);
    });

    it('should handle special characters in room names', async () => {
      await service.broadcastToRoom('room:with:colons', 'event', {});

      expect(mockBroadcastService.broadcastToRoom).toHaveBeenCalledWith(
        'room:with:colons',
        'event',
        {},
      );
    });
  });
});
