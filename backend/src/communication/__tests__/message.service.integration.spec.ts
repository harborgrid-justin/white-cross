import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { MessageService } from '../services/message.service';
import { Message } from '../../database/models/message.model';
import { MessageDelivery } from '../../database/models/message-delivery.model';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { MessagePriority, MessageCategory, MessageType, RecipientType } from '../dto/send-message.dto';

describe('MessageService Integration Tests', () => {
  let service: MessageService;
  let messageModel: typeof Message;
  let deliveryModel: typeof MessageDelivery;

  // Mock data
  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
  const mockRecipientId = '987e6543-e21b-12d3-a456-426614174000';
  const mockMessageId = 'msg-123e4567-e89b-12d3-a456-426614174000';

  const mockMessage = {
    id: mockMessageId,
    subject: 'Test Message',
    content: 'This is a test message',
    priority: MessagePriority.MEDIUM,
    category: MessageCategory.GENERAL,
    recipientCount: 1,
    senderId: mockUserId,
    scheduledAt: null,
    attachments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    toJSON: jest.fn().mockReturnThis(),
    destroy: jest.fn(),
  };

  const mockDelivery = {
    id: 'delivery-123',
    messageId: mockMessageId,
    recipientType: RecipientType.PARENT,
    recipientId: mockRecipientId,
    channel: MessageType.EMAIL,
    status: 'SENT',
    contactInfo: 'test@example.com',
    sentAt: new Date(),
    toJSON: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: getModelToken(Message),
          useValue: {
            create: jest.fn(),
            findAndCountAll: jest.fn(),
            findByPk: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: getModelToken(MessageDelivery),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    messageModel = module.get(getModelToken(Message));
    deliveryModel = module.get(getModelToken(MessageDelivery));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should successfully send a message to single recipient', async () => {
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
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'create').mockResolvedValue(mockMessage as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue(mockDelivery as any);

      const result = await service.sendMessage(sendMessageDto);

      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('deliveryStatuses');
      expect(result.deliveryStatuses).toHaveLength(1);
      expect(messageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: sendMessageDto.subject,
          content: sendMessageDto.content,
          priority: sendMessageDto.priority,
          category: sendMessageDto.category,
          recipientCount: 1,
          senderId: mockUserId,
        })
      );
    });

    it('should send message to multiple recipients', async () => {
      const recipients = [
        { type: RecipientType.PARENT, id: 'recipient-1', email: 'parent1@example.com' },
        { type: RecipientType.PARENT, id: 'recipient-2', email: 'parent2@example.com' },
        { type: RecipientType.GUARDIAN, id: 'recipient-3', email: 'guardian@example.com' },
      ];

      const sendMessageDto = {
        recipients,
        channels: [MessageType.EMAIL],
        subject: 'Test Message',
        content: 'This is a test message',
        priority: MessagePriority.HIGH,
        category: MessageCategory.HEALTH_UPDATE,
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'create').mockResolvedValue({
        ...mockMessage,
        recipientCount: 3,
      } as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue(mockDelivery as any);

      const result = await service.sendMessage(sendMessageDto);

      expect(result.deliveryStatuses).toHaveLength(3);
      expect(deliveryModel.create).toHaveBeenCalledTimes(3);
    });

    it('should send message via multiple channels', async () => {
      const sendMessageDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
            phoneNumber: '+1234567890',
          },
        ],
        channels: [MessageType.EMAIL, MessageType.SMS],
        subject: 'Test Message',
        content: 'This is a test message',
        priority: MessagePriority.URGENT,
        category: MessageCategory.EMERGENCY,
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'create').mockResolvedValue(mockMessage as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue(mockDelivery as any);

      const result = await service.sendMessage(sendMessageDto);

      expect(result.deliveryStatuses).toHaveLength(2); // 1 recipient × 2 channels
      expect(deliveryModel.create).toHaveBeenCalledTimes(2);
    });

    it('should schedule a message for future delivery', async () => {
      const futureDate = new Date(Date.now() + 86400000); // Tomorrow
      const sendMessageDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        channels: [MessageType.EMAIL],
        subject: 'Scheduled Message',
        content: 'This message will be sent tomorrow',
        priority: MessagePriority.MEDIUM,
        category: MessageCategory.APPOINTMENT_REMINDER,
        scheduledAt: futureDate.toISOString(),
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'create').mockResolvedValue({
        ...mockMessage,
        scheduledAt: futureDate,
      } as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue({
        ...mockDelivery,
        status: 'PENDING',
        sentAt: null,
      } as any);

      const result = await service.sendMessage(sendMessageDto);

      expect(result.deliveryStatuses[0].status).toBe('PENDING');
    });

    it('should handle message with attachments', async () => {
      const sendMessageDto = {
        recipients: [
          {
            type: RecipientType.PARENT,
            id: mockRecipientId,
            email: 'parent@example.com',
          },
        ],
        channels: [MessageType.EMAIL],
        subject: 'Message with Attachments',
        content: 'Please review the attached document',
        priority: MessagePriority.MEDIUM,
        category: MessageCategory.GENERAL,
        attachments: ['https://example.com/document.pdf'],
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'create').mockResolvedValue({
        ...mockMessage,
        attachments: sendMessageDto.attachments,
      } as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue(mockDelivery as any);

      const result = await service.sendMessage(sendMessageDto);

      expect(messageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: sendMessageDto.attachments,
        })
      );
    });
  });

  describe('getMessages', () => {
    it('should retrieve paginated messages', async () => {
      const mockMessages = [mockMessage, { ...mockMessage, id: 'msg-2' }];
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: mockMessages as any,
        count: 2,
      });

      const result = await service.getMessages(1, 20, {});

      expect(result.messages).toHaveLength(2);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 2,
        pages: 1,
      });
    });

    it('should filter messages by senderId', async () => {
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: [mockMessage] as any,
        count: 1,
      });

      await service.getMessages(1, 20, { senderId: mockUserId });

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ senderId: mockUserId }),
        })
      );
    });

    it('should filter messages by category', async () => {
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: [mockMessage] as any,
        count: 1,
      });

      await service.getMessages(1, 20, { category: MessageCategory.HEALTH_UPDATE });

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ category: MessageCategory.HEALTH_UPDATE }),
        })
      );
    });

    it('should filter messages by priority', async () => {
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: [mockMessage] as any,
        count: 1,
      });

      await service.getMessages(1, 20, { priority: MessagePriority.URGENT });

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ priority: MessagePriority.URGENT }),
        })
      );
    });
  });

  describe('getInbox', () => {
    it('should retrieve inbox messages for a user', async () => {
      const mockDeliveries = [
        { ...mockDelivery, message: mockMessage },
      ];

      jest.spyOn(deliveryModel, 'findAll').mockResolvedValue(mockDeliveries as any);

      const result = await service.getInbox(mockRecipientId, 1, 20);

      expect(deliveryModel.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { recipientId: mockRecipientId },
        })
      );
      expect(result.messages).toHaveLength(1);
    });
  });

  describe('getSentMessages', () => {
    it('should retrieve sent messages for a user', async () => {
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: [mockMessage] as any,
        count: 1,
      });

      const result = await service.getSentMessages(mockUserId, 1, 20);

      expect(result.messages).toHaveLength(1);
    });
  });

  describe('getMessageById', () => {
    it('should retrieve a message by ID', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(mockMessage as any);

      const result = await service.getMessageById(mockMessageId);

      expect(result.message).toBeDefined();
      expect(messageModel.findByPk).toHaveBeenCalledWith(mockMessageId, expect.any(Object));
    });

    it('should throw NotFoundException when message not found', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(null);

      await expect(service.getMessageById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMessageDeliveryStatus', () => {
    it('should retrieve delivery status for a message', async () => {
      const mockDeliveries = [
        { ...mockDelivery, status: 'DELIVERED' },
        { ...mockDelivery, id: 'delivery-2', status: 'PENDING' },
        { ...mockDelivery, id: 'delivery-3', status: 'FAILED' },
      ];

      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(mockMessage as any);
      jest.spyOn(deliveryModel, 'findAll').mockResolvedValue(mockDeliveries as any);

      const result = await service.getMessageDeliveryStatus(mockMessageId);

      expect(result.summary).toEqual({
        total: 3,
        pending: 1,
        sent: 0,
        delivered: 1,
        failed: 1,
        bounced: 0,
      });
    });

    it('should throw NotFoundException when message not found', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(null);

      await expect(service.getMessageDeliveryStatus('nonexistent-id')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('replyToMessage', () => {
    it('should create a reply to an existing message', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(mockMessage as any);
      jest.spyOn(messageModel, 'create').mockResolvedValue({
        ...mockMessage,
        subject: 'Re: Test Message',
      } as any);
      jest.spyOn(deliveryModel, 'create').mockResolvedValue(mockDelivery as any);

      const replyData = {
        content: 'This is a reply',
        channels: [MessageType.EMAIL],
      };

      const result = await service.replyToMessage(mockMessageId, mockRecipientId, replyData);

      expect(result).toHaveProperty('message');
      expect(messageModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Re:'),
        })
      );
    });

    it('should throw NotFoundException when original message not found', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(null);

      await expect(
        service.replyToMessage('nonexistent-id', mockUserId, { content: 'Reply' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteScheduledMessage', () => {
    it('should delete a scheduled message', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const scheduledMessage = {
        ...mockMessage,
        scheduledAt: futureDate,
        senderId: mockUserId,
        destroy: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(scheduledMessage as any);

      await service.deleteScheduledMessage(mockMessageId, mockUserId);

      expect(scheduledMessage.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException when message not found', async () => {
      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(null);

      await expect(service.deleteScheduledMessage('nonexistent-id', mockUserId)).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ForbiddenException when user is not the sender', async () => {
      const futureDate = new Date(Date.now() + 86400000);
      const scheduledMessage = {
        ...mockMessage,
        scheduledAt: futureDate,
        senderId: 'different-user-id',
      };

      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(scheduledMessage as any);

      await expect(service.deleteScheduledMessage(mockMessageId, mockUserId)).rejects.toThrow(
        ForbiddenException
      );
    });

    it('should throw BadRequestException when trying to delete sent message', async () => {
      const pastDate = new Date(Date.now() - 86400000);
      const sentMessage = {
        ...mockMessage,
        scheduledAt: pastDate,
        senderId: mockUserId,
      };

      jest.spyOn(messageModel, 'findByPk').mockResolvedValue(sentMessage as any);

      await expect(service.deleteScheduledMessage(mockMessageId, mockUserId)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('Multi-tenant isolation', () => {
    it('should only return messages for the requesting user tenant', async () => {
      const tenantMessages = [mockMessage];
      jest.spyOn(messageModel, 'findAndCountAll').mockResolvedValue({
        rows: tenantMessages as any,
        count: 1,
      });

      const result = await service.getMessages(1, 20, { senderId: mockUserId });

      expect(messageModel.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ senderId: mockUserId }),
        })
      );
    });
  });

  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      jest.spyOn(messageModel, 'create').mockRejectedValue(new Error('Database error'));

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
        senderId: mockUserId,
      };

      await expect(service.sendMessage(sendMessageDto)).rejects.toThrow('Database error');
    });
  });
});
