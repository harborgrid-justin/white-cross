import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { MessageController } from '../controllers/message.controller';
import { MessageService } from '../services/message.service';
import { MessageCategory, MessagePriority, MessageType, RecipientType } from '../dto/send-message.dto';
import { DeliveryChannelType, DeliveryStatus } from '../../database/models/message-delivery.model';

describe('MessageController Integration Tests (e2e)', () => {
  let app: INestApplication;
  let messageService: MessageService;

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockRecipientId = '987e6543-e21b-12d3-a456-426614174000';
  const mockMessageId = 'msg-123e4567-e89b-12d3-a456-426614174000';

  const mockUser = {
    id: mockUserId,
    email: 'nurse@example.com',
    role: 'NURSE',
  };

  const mockMessage = {
    id: mockMessageId,
    subject: 'Test Message',
    content: 'This is a test message',
    priority: MessagePriority.MEDIUM,
    category: MessageCategory.GENERAL,
    recipientCount: 1,
    senderId: mockUserId,
    createdAt: new Date(),
    isEncrypted: false,
    attachments: [],
    isEdited: false,
  };

  const mockDeliveryStatus = {
    id: 'delivery-123',
    messageId: mockMessageId,
    recipientId: mockRecipientId,
    recipientType: RecipientType.PARENT,
    channel: DeliveryChannelType.EMAIL,
    status: DeliveryStatus.SENT,
    sentAt: new Date(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: {
            sendMessage: jest.fn(),
            getMessages: jest.fn(),
            getInbox: jest.fn(),
            getSentMessages: jest.fn(),
            getMessageById: jest.fn(),
            getMessageDeliveryStatus: jest.fn(),
            replyToMessage: jest.fn(),
            deleteScheduledMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    messageService = moduleFixture.get<MessageService>(MessageService);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/messages', () => {
    it('should send a message successfully', async () => {
      const sendMessageDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        channels: [MessageType.EMAIL],
        subject: 'Test Message',
        content: 'This is a test message',
        priority: MessagePriority.MEDIUM,
        category: MessageCategory.GENERAL,
      };

      const mockResponse = {
        message: mockMessage,
        deliveryStatuses: [mockDeliveryStatus],
      };

      jest.spyOn(messageService, 'sendMessage').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(sendMessageDto)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('deliveryStatuses');
      expect(messageService.sendMessage).toHaveBeenCalled();
    });

    it('should validate required fields', async () => {
      const invalidDto = {
        recipients: [],
        content: '', // Empty content
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate recipient structure', async () => {
      const invalidDto = {
        recipients: [
          {
            // Missing type and id
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: MessageCategory.GENERAL,
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate message priority enum', async () => {
      const invalidDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: MessageCategory.GENERAL,
        priority: 'INVALID_PRIORITY', // Invalid enum value
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate message category enum', async () => {
      const invalidDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: 'INVALID_CATEGORY', // Invalid enum value
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate attachment URLs', async () => {
      const invalidDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: MessageCategory.GENERAL,
        attachments: ['not-a-valid-url'], // Invalid URL
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate scheduled date format', async () => {
      const invalidDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: MessageCategory.GENERAL,
        scheduledAt: 'invalid-date', // Invalid date format
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });

    it('should validate content length', async () => {
      const invalidDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'a'.repeat(50001), // Exceeds max length
        category: MessageCategory.GENERAL,
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/messages', () => {
    it('should list messages with pagination', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1,
        },
      };

      jest.spyOn(messageService, 'getMessages').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/api/v1/messages')
        .query({ page: 1, limit: 20 })
        .expect(200);

      expect(response.body).toHaveProperty('messages');
      expect(response.body).toHaveProperty('pagination');
      expect(messageService.getMessages).toHaveBeenCalledWith(1, 20, expect.any(Object));
    });

    it('should filter messages by senderId', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      jest.spyOn(messageService, 'getMessages').mockResolvedValue(mockResponse);

      await request(app.getHttpServer())
        .get('/api/v1/messages')
        .query({ senderId: mockUserId })
        .expect(200);

      expect(messageService.getMessages).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({ senderId: mockUserId })
      );
    });

    it('should filter messages by category', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      jest.spyOn(messageService, 'getMessages').mockResolvedValue(mockResponse);

      await request(app.getHttpServer())
        .get('/api/v1/messages')
        .query({ category: MessageCategory.HEALTH_UPDATE })
        .expect(200);

      expect(messageService.getMessages).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({ category: MessageCategory.HEALTH_UPDATE })
      );
    });

    it('should filter messages by priority', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      jest.spyOn(messageService, 'getMessages').mockResolvedValue(mockResponse);

      await request(app.getHttpServer())
        .get('/api/v1/messages')
        .query({ priority: MessagePriority.URGENT })
        .expect(200);

      expect(messageService.getMessages).toHaveBeenCalledWith(
        1,
        20,
        expect.objectContaining({ priority: MessagePriority.URGENT })
      );
    });
  });

  describe('GET /api/v1/messages/inbox', () => {
    it('should get inbox messages', async () => {
      const mockResponse = {
        messages: [mockMessage],
        total: 1,
        page: 1,
        limit: 20,
      };

      jest.spyOn(messageService, 'getInbox').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/api/v1/messages/inbox')
        .expect(200);

      expect(response.body).toHaveProperty('messages');
      expect(messageService.getInbox).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/messages/sent', () => {
    it('should get sent messages', async () => {
      const mockResponse = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      jest.spyOn(messageService, 'getSentMessages').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get('/api/v1/messages/sent')
        .expect(200);

      expect(response.body).toHaveProperty('messages');
      expect(messageService.getSentMessages).toHaveBeenCalled();
    });
  });

  describe('GET /api/v1/messages/:id', () => {
    it('should get a message by ID', async () => {
      const mockResponse = { message: mockMessage };

      jest.spyOn(messageService, 'getMessageById').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/messages/${mockMessageId}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(messageService.getMessageById).toHaveBeenCalledWith(mockMessageId);
    });

    it('should return 404 when message not found', async () => {
      jest.spyOn(messageService, 'getMessageById').mockRejectedValue({
        name: 'NotFoundException',
        message: 'Message not found',
      });

      await request(app.getHttpServer())
        .get('/api/v1/messages/nonexistent-id')
        .expect(404);
    });
  });

  describe('GET /api/v1/messages/:id/delivery', () => {
    it('should get delivery status for a message', async () => {
      const mockResponse = {
        deliveries: [mockDeliveryStatus],
        summary: {
          total: 1,
          pending: 0,
          sent: 1,
          delivered: 0,
          failed: 0,
          bounced: 0,
        },
      };

      jest.spyOn(messageService, 'getMessageDeliveryStatus').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .get(`/api/v1/messages/${mockMessageId}/delivery`)
        .expect(200);

      expect(response.body).toHaveProperty('deliveries');
      expect(response.body).toHaveProperty('summary');
      expect(messageService.getMessageDeliveryStatus).toHaveBeenCalledWith(mockMessageId);
    });
  });

  describe('POST /api/v1/messages/:id/reply', () => {
    it('should reply to a message', async () => {
      const replyDto = {
        content: 'This is a reply',
        channels: [MessageType.EMAIL],
      };

      const mockResponse = {
        message: { ...mockMessage, subject: 'Re: Test Message' },
        deliveryStatuses: [mockDeliveryStatus],
      };

      jest.spyOn(messageService, 'replyToMessage').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post(`/api/v1/messages/${mockMessageId}/reply`)
        .send(replyDto)
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(messageService.replyToMessage).toHaveBeenCalledWith(
        mockMessageId,
        undefined, // user id from req
        replyDto
      );
    });

    it('should validate reply content is required', async () => {
      const invalidDto = {
        channels: [MessageType.EMAIL],
        // Missing content
      };

      await request(app.getHttpServer())
        .post(`/api/v1/messages/${mockMessageId}/reply`)
        .send(invalidDto)
        .expect(400);
    });
  });

  describe('DELETE /api/v1/messages/:id', () => {
    it('should delete a scheduled message', async () => {
      jest.spyOn(messageService, 'deleteScheduledMessage').mockResolvedValue(undefined);

      await request(app.getHttpServer())
        .delete(`/api/v1/messages/${mockMessageId}`)
        .expect(204);

      expect(messageService.deleteScheduledMessage).toHaveBeenCalledWith(
        mockMessageId,
        undefined // user id from req
      );
    });

    it('should return 404 when message not found', async () => {
      jest.spyOn(messageService, 'deleteScheduledMessage').mockRejectedValue({
        name: 'NotFoundException',
        message: 'Message not found',
      });

      await request(app.getHttpServer())
        .delete('/api/v1/messages/nonexistent-id')
        .expect(404);
    });

    it('should return 403 when user is not authorized', async () => {
      jest.spyOn(messageService, 'deleteScheduledMessage').mockRejectedValue({
        name: 'ForbiddenException',
        message: 'Not authorized to delete this message',
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/messages/${mockMessageId}`)
        .expect(403);
    });

    it('should return 400 when trying to delete sent message', async () => {
      jest.spyOn(messageService, 'deleteScheduledMessage').mockRejectedValue({
        name: 'BadRequestException',
        message: 'Cannot delete messages that have already been sent',
      });

      await request(app.getHttpServer())
        .delete(`/api/v1/messages/${mockMessageId}`)
        .expect(400);
    });
  });

  describe('Rate limiting and security', () => {
    it('should handle bulk message sending', async () => {
      const largeRecipientList = Array.from({ length: 100 }, (_, i) => ({
        type: RecipientType.PARENT,
        id: `recipient-${i}`,
        email: `parent${i}@example.com`,
      }));

      const sendMessageDto = {
        recipients: largeRecipientList,
        channels: [MessageType.EMAIL],
        content: 'Bulk message',
        category: MessageCategory.GENERAL,
      };

      const mockResponse = {
        message: mockMessage,
        deliveryStatuses: largeRecipientList.map((r) => ({ ...mockDeliveryStatus, recipientId: r.id })),
      };

      jest.spyOn(messageService, 'sendMessage').mockResolvedValue(mockResponse);

      const response = await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(sendMessageDto)
        .expect(201);

      expect(response.body.deliveryStatuses).toHaveLength(100);
    });
  });

  describe('Error handling', () => {
    it('should handle service errors gracefully', async () => {
      jest.spyOn(messageService, 'sendMessage').mockRejectedValue(new Error('Service error'));

      const sendMessageDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        content: 'Test message',
        category: MessageCategory.GENERAL,
      };

      await request(app.getHttpServer())
        .post('/api/v1/messages')
        .send(sendMessageDto)
        .expect(500);
    });
  });
});
