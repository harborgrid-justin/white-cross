import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from '../services/message.service';
import { AuthenticatedRequest } from '../types/index';
import { SendMessageDto } from '../dto/send-message.dto';
import { HttpStatus } from '@nestjs/common';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: jest.Mocked<MessageService>;

  const mockAuthRequest: AuthenticatedRequest = {
    user: {
      id: 'user-123',
      tenantId: 'tenant-456',
      email: 'test@example.com',
      role: 'user',
    },
  } as AuthenticatedRequest;

  const mockMessage = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    subject: 'Health Update',
    content: 'Your child has a scheduled appointment...',
    priority: 'MEDIUM',
    category: 'HEALTH_UPDATE',
    senderId: 'user-123',
    createdAt: '2025-10-28T10:00:00Z',
  };

  const mockDeliveryStatus = {
    recipientId: '789e0123-e89b-12d3-a456-426614174000',
    channel: 'EMAIL',
    status: 'DELIVERED',
    sentAt: '2025-10-28T10:00:05Z',
    deliveredAt: '2025-10-28T10:00:10Z',
  };

  beforeEach(async () => {
    const mockMessageService: Partial<jest.Mocked<MessageService>> = {
      sendMessage: jest.fn(),
      getMessages: jest.fn(),
      getInbox: jest.fn(),
      getSentMessages: jest.fn(),
      getMessageById: jest.fn(),
      getMessageDeliveryStatus: jest.fn(),
      replyToMessage: jest.fn(),
      deleteScheduledMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get(MessageService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should inject MessageService', () => {
      expect(messageService).toBeDefined();
    });
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const dto: SendMessageDto = {
        subject: 'Important Health Update',
        content: 'Your child has a scheduled appointment...',
        recipientIds: ['recipient-1', 'recipient-2'],
        channels: ['EMAIL'],
        priority: 'MEDIUM',
        category: 'HEALTH_UPDATE',
      };
      const expectedResult = {
        message: mockMessage,
        deliveryStatuses: [mockDeliveryStatus],
      };

      messageService.sendMessage.mockResolvedValue(expectedResult);

      const result = await controller.sendMessage(dto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.sendMessage).toHaveBeenCalledWith({
        ...dto,
        senderId: 'user-123',
      });
      expect(messageService.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle missing user id gracefully', async () => {
      const dto: SendMessageDto = {
        subject: 'Test Message',
        content: 'Test content',
        recipientIds: ['recipient-1'],
        channels: ['EMAIL'],
      };
      const requestWithoutUser = { user: undefined } as AuthenticatedRequest;
      const expectedResult = {
        message: mockMessage,
        deliveryStatuses: [],
      };

      messageService.sendMessage.mockResolvedValue(expectedResult);

      await controller.sendMessage(dto, requestWithoutUser);

      expect(messageService.sendMessage).toHaveBeenCalledWith({
        ...dto,
        senderId: undefined,
      });
    });

    it('should handle multiple channels', async () => {
      const dto: SendMessageDto = {
        subject: 'Emergency Alert',
        content: 'Immediate attention required',
        recipientIds: ['recipient-1'],
        channels: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION'],
        priority: 'URGENT',
        category: 'EMERGENCY',
      };
      const expectedResult = {
        message: { ...mockMessage, priority: 'URGENT', category: 'EMERGENCY' },
        deliveryStatuses: [
          { ...mockDeliveryStatus, channel: 'EMAIL' },
          { ...mockDeliveryStatus, channel: 'SMS' },
          { ...mockDeliveryStatus, channel: 'PUSH_NOTIFICATION' },
        ],
      };

      messageService.sendMessage.mockResolvedValue(expectedResult);

      const result = await controller.sendMessage(dto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(result.deliveryStatuses).toHaveLength(3);
    });

    it('should handle service errors', async () => {
      const dto: SendMessageDto = {
        subject: 'Test',
        content: 'Test',
        recipientIds: ['invalid-recipient'],
        channels: ['EMAIL'],
      };
      const error = new Error('Invalid recipient');

      messageService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto, mockAuthRequest)).rejects.toThrow('Invalid recipient');
    });

    it('should handle validation errors', async () => {
      const dto: SendMessageDto = {
        subject: '',
        content: '',
        recipientIds: [],
        channels: [],
      };
      const error = new Error('Invalid input data');

      messageService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto, mockAuthRequest)).rejects.toThrow('Invalid input data');
    });
  });

  describe('listMessages', () => {
    it('should list messages with default pagination', async () => {
      const expectedResult = {
        messages: [mockMessage],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId: undefined,
        category: undefined,
        priority: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });

    it('should filter by sender', async () => {
      const senderId = 'sender-123';
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 10, pages: 1 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20, senderId);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId,
        category: undefined,
        priority: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });

    it('should filter by category', async () => {
      const category = 'HEALTH_UPDATE';
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 15, pages: 1 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20, undefined, category);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId: undefined,
        category,
        priority: undefined,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });

    it('should filter by priority', async () => {
      const priority = 'URGENT';
      const expectedResult = {
        messages: [{ ...mockMessage, priority: 'URGENT' }],
        pagination: { page: 1, limit: 20, total: 5, pages: 1 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20, undefined, undefined, priority);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId: undefined,
        category: undefined,
        priority,
        dateFrom: undefined,
        dateTo: undefined,
      });
    });

    it('should filter by date range', async () => {
      const dateFrom = '2025-10-01';
      const dateTo = '2025-10-31';
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 25, pages: 2 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20, undefined, undefined, undefined, dateFrom, dateTo);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId: undefined,
        category: undefined,
        priority: undefined,
        dateFrom,
        dateTo,
      });
    });

    it('should handle multiple filters', async () => {
      const senderId = 'sender-123';
      const category = 'EMERGENCY';
      const priority = 'URGENT';
      const dateFrom = '2025-10-01';
      const dateTo = '2025-10-31';
      const expectedResult = {
        messages: [{ ...mockMessage, category: 'EMERGENCY', priority: 'URGENT' }],
        pagination: { page: 1, limit: 20, total: 2, pages: 1 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20, senderId, category, priority, dateFrom, dateTo);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, {
        senderId,
        category,
        priority,
        dateFrom,
        dateTo,
      });
    });

    it('should handle empty results', async () => {
      const expectedResult = {
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1, 20);

      expect(result).toEqual(expectedResult);
      expect(result.messages).toHaveLength(0);
    });
  });

  describe('getInbox', () => {
    it('should retrieve inbox messages', async () => {
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 50, pages: 3 },
      };

      messageService.getInbox.mockResolvedValue(expectedResult);

      const result = await controller.getInbox(1, 20, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.getInbox).toHaveBeenCalledWith('user-123', 1, 20);
    });

    it('should handle custom pagination', async () => {
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 2, limit: 10, total: 50, pages: 5 },
      };

      messageService.getInbox.mockResolvedValue(expectedResult);

      const result = await controller.getInbox(2, 10, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.getInbox).toHaveBeenCalledWith('user-123', 2, 10);
    });

    it('should handle empty inbox', async () => {
      const expectedResult = {
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      messageService.getInbox.mockResolvedValue(expectedResult);

      const result = await controller.getInbox(1, 20, mockAuthRequest);

      expect(result.messages).toHaveLength(0);
    });

    it('should handle missing user id', async () => {
      const requestWithoutUser = { user: undefined } as AuthenticatedRequest;
      const expectedResult = {
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      messageService.getInbox.mockResolvedValue(expectedResult);

      await controller.getInbox(1, 20, requestWithoutUser);

      expect(messageService.getInbox).toHaveBeenCalledWith(undefined, 1, 20);
    });
  });

  describe('getSentMessages', () => {
    it('should retrieve sent messages', async () => {
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 30, pages: 2 },
      };

      messageService.getSentMessages.mockResolvedValue(expectedResult);

      const result = await controller.getSentMessages(1, 20, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.getSentMessages).toHaveBeenCalledWith('user-123', 1, 20);
    });

    it('should handle custom pagination', async () => {
      const expectedResult = {
        messages: [mockMessage],
        pagination: { page: 3, limit: 5, total: 30, pages: 6 },
      };

      messageService.getSentMessages.mockResolvedValue(expectedResult);

      const result = await controller.getSentMessages(3, 5, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.getSentMessages).toHaveBeenCalledWith('user-123', 3, 5);
    });

    it('should handle no sent messages', async () => {
      const expectedResult = {
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      messageService.getSentMessages.mockResolvedValue(expectedResult);

      const result = await controller.getSentMessages(1, 20, mockAuthRequest);

      expect(result.messages).toHaveLength(0);
    });
  });

  describe('getMessageById', () => {
    it('should retrieve message by id', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        message: {
          ...mockMessage,
          sender: {
            id: '456e7890-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
          },
        },
      };

      messageService.getMessageById.mockResolvedValue(expectedResult);

      const result = await controller.getMessageById(messageId);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessageById).toHaveBeenCalledWith(messageId);
    });

    it('should handle non-existent message', async () => {
      const messageId = 'non-existent-id';
      const error = new Error('Message not found');

      messageService.getMessageById.mockRejectedValue(error);

      await expect(controller.getMessageById(messageId)).rejects.toThrow('Message not found');
    });

    it('should handle invalid message id format', async () => {
      const messageId = 'invalid-uuid';
      const error = new Error('Invalid message id format');

      messageService.getMessageById.mockRejectedValue(error);

      await expect(controller.getMessageById(messageId)).rejects.toThrow('Invalid message id format');
    });
  });

  describe('getDeliveryStatus', () => {
    it('should retrieve delivery status for a message', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        deliveries: [mockDeliveryStatus],
        summary: {
          total: 10,
          pending: 0,
          sent: 2,
          delivered: 8,
          failed: 0,
          bounced: 0,
        },
      };

      messageService.getMessageDeliveryStatus.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveryStatus(messageId);

      expect(result).toEqual(expectedResult);
      expect(messageService.getMessageDeliveryStatus).toHaveBeenCalledWith(messageId);
    });

    it('should handle message with failed deliveries', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        deliveries: [
          mockDeliveryStatus,
          { ...mockDeliveryStatus, status: 'FAILED', recipientId: 'recipient-2' },
        ],
        summary: {
          total: 10,
          pending: 0,
          sent: 0,
          delivered: 8,
          failed: 2,
          bounced: 0,
        },
      };

      messageService.getMessageDeliveryStatus.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveryStatus(messageId);

      expect(result).toEqual(expectedResult);
      expect(result.summary.failed).toBe(2);
    });

    it('should handle message with pending deliveries', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const expectedResult = {
        deliveries: [
          { ...mockDeliveryStatus, status: 'PENDING' },
        ],
        summary: {
          total: 5,
          pending: 5,
          sent: 0,
          delivered: 0,
          failed: 0,
          bounced: 0,
        },
      };

      messageService.getMessageDeliveryStatus.mockResolvedValue(expectedResult);

      const result = await controller.getDeliveryStatus(messageId);

      expect(result.summary.pending).toBe(5);
    });
  });

  describe('replyToMessage', () => {
    it('should reply to a message successfully', async () => {
      const originalMessageId = '123e4567-e89b-12d3-a456-426614174000';
      const replyDto = {
        content: 'Thank you for the update.',
        channels: ['EMAIL'],
      };
      const expectedResult = {
        message: {
          ...mockMessage,
          content: 'Thank you for the update.',
          parentMessageId: originalMessageId,
        },
        deliveryStatuses: [mockDeliveryStatus],
      };

      messageService.replyToMessage.mockResolvedValue(expectedResult);

      const result = await controller.replyToMessage(originalMessageId, replyDto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.replyToMessage).toHaveBeenCalledWith(originalMessageId, 'user-123', replyDto);
    });

    it('should reply without specifying channels', async () => {
      const originalMessageId = '123e4567-e89b-12d3-a456-426614174000';
      const replyDto = {
        content: 'Acknowledged.',
      };
      const expectedResult = {
        message: {
          ...mockMessage,
          content: 'Acknowledged.',
          parentMessageId: originalMessageId,
        },
        deliveryStatuses: [mockDeliveryStatus],
      };

      messageService.replyToMessage.mockResolvedValue(expectedResult);

      const result = await controller.replyToMessage(originalMessageId, replyDto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.replyToMessage).toHaveBeenCalledWith(originalMessageId, 'user-123', replyDto);
    });

    it('should handle non-existent original message', async () => {
      const originalMessageId = 'non-existent-id';
      const replyDto = {
        content: 'Reply content',
      };
      const error = new Error('Original message not found');

      messageService.replyToMessage.mockRejectedValue(error);

      await expect(controller.replyToMessage(originalMessageId, replyDto, mockAuthRequest)).rejects.toThrow(
        'Original message not found'
      );
    });

    it('should handle empty reply content', async () => {
      const originalMessageId = '123e4567-e89b-12d3-a456-426614174000';
      const replyDto = {
        content: '',
      };
      const error = new Error('Reply content cannot be empty');

      messageService.replyToMessage.mockRejectedValue(error);

      await expect(controller.replyToMessage(originalMessageId, replyDto, mockAuthRequest)).rejects.toThrow(
        'Reply content cannot be empty'
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete a scheduled message successfully', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';

      messageService.deleteScheduledMessage.mockResolvedValue(undefined);

      await controller.deleteMessage(messageId, mockAuthRequest);

      expect(messageService.deleteScheduledMessage).toHaveBeenCalledWith(messageId, 'user-123');
    });

    it('should handle unauthorized delete attempts', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Not authorized to delete this message');

      messageService.deleteScheduledMessage.mockRejectedValue(error);

      await expect(controller.deleteMessage(messageId, mockAuthRequest)).rejects.toThrow(
        'Not authorized to delete this message'
      );
    });

    it('should handle deletion of already sent message', async () => {
      const messageId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new Error('Cannot delete sent messages');

      messageService.deleteScheduledMessage.mockRejectedValue(error);

      await expect(controller.deleteMessage(messageId, mockAuthRequest)).rejects.toThrow(
        'Cannot delete sent messages'
      );
    });

    it('should handle non-existent message', async () => {
      const messageId = 'non-existent-id';
      const error = new Error('Message not found');

      messageService.deleteScheduledMessage.mockRejectedValue(error);

      await expect(controller.deleteMessage(messageId, mockAuthRequest)).rejects.toThrow('Message not found');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle network timeouts', async () => {
      const dto: SendMessageDto = {
        subject: 'Test',
        content: 'Test',
        recipientIds: ['recipient-1'],
        channels: ['EMAIL'],
      };
      const error = new Error('Network timeout');

      messageService.sendMessage.mockRejectedValue(error);

      await expect(controller.sendMessage(dto, mockAuthRequest)).rejects.toThrow('Network timeout');
    });

    it('should handle database connection errors', async () => {
      const error = new Error('Database connection failed');

      messageService.getMessages.mockRejectedValue(error);

      await expect(controller.listMessages(1, 20)).rejects.toThrow('Database connection failed');
    });

    it('should handle large pagination values', async () => {
      const expectedResult = {
        messages: [],
        pagination: { page: 1000, limit: 100, total: 50, pages: 1 },
      };

      messageService.getMessages.mockResolvedValue(expectedResult);

      const result = await controller.listMessages(1000, 100);

      expect(result.messages).toHaveLength(0);
      expect(result.pagination.page).toBe(1000);
    });

    it('should handle concurrent requests', async () => {
      const dto: SendMessageDto = {
        subject: 'Test',
        content: 'Test',
        recipientIds: ['recipient-1'],
        channels: ['EMAIL'],
      };
      const expectedResult = {
        message: mockMessage,
        deliveryStatuses: [mockDeliveryStatus],
      };

      messageService.sendMessage.mockResolvedValue(expectedResult);

      const promises = [
        controller.sendMessage(dto, mockAuthRequest),
        controller.sendMessage(dto, mockAuthRequest),
        controller.sendMessage(dto, mockAuthRequest),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(messageService.sendMessage).toHaveBeenCalledTimes(3);
    });
  });
});
