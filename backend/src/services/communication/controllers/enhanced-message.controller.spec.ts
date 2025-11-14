import { Test, TestingModule } from '@nestjs/testing';
import { EnhancedMessageController } from './enhanced-message.controller';
import { EnhancedMessageService } from '../services/enhanced-message.service';
import { ConversationService } from '../services/conversation.service';
import { MessageQueueService } from '@/infrastructure/queue/message-queue.service';
import { AuthenticatedRequest } from '../types/index';
import { SendDirectMessageDto } from '../dto/send-direct-message.dto';
import { SendGroupMessageDto } from '../dto/send-group-message.dto';
import { EditMessageDto } from '../dto/edit-message.dto';
import { MessagePaginationDto } from '../dto/message-pagination.dto';
import { SearchMessagesDto } from '../dto/search-messages.dto';
import { MarkAsReadDto, MarkConversationAsReadDto } from '../dto/mark-as-read.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { AddParticipantDto, UpdateParticipantDto } from '../dto/conversation-participant.dto';
import { ConversationType } from '@/database/models';
import { HttpStatus } from '@nestjs/common';

describe('EnhancedMessageController', () => {
  let controller: EnhancedMessageController;
  let messageService: jest.Mocked<EnhancedMessageService>;
  let conversationService: jest.Mocked<ConversationService>;
  let queueService: jest.Mocked<MessageQueueService>;

  const mockAuthRequest: AuthenticatedRequest = {
    user: {
      id: 'user-123',
      tenantId: 'tenant-456',
      email: 'test@example.com',
      role: 'user',
    },
  } as AuthenticatedRequest;

  const mockMessage = {
    id: 'message-123',
    conversationId: 'conversation-456',
    content: 'Hello, world!',
    senderId: 'user-123',
    createdAt: new Date().toISOString(),
  };

  const mockConversation = {
    id: 'conversation-456',
    type: ConversationType.DIRECT,
    participants: [],
    createdAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    const mockMessageService: Partial<jest.Mocked<EnhancedMessageService>> = {
      sendDirectMessage: jest.fn(),
      sendGroupMessage: jest.fn(),
      editMessage: jest.fn(),
      deleteMessage: jest.fn(),
      markMessagesAsRead: jest.fn(),
      markConversationAsRead: jest.fn(),
      getMessageHistory: jest.fn(),
      searchMessages: jest.fn(),
      getUnreadCount: jest.fn(),
    };

    const mockConversationService: Partial<jest.Mocked<ConversationService>> = {
      createConversation: jest.fn(),
      listConversations: jest.fn(),
      getConversation: jest.fn(),
      updateConversation: jest.fn(),
      deleteConversation: jest.fn(),
      addParticipant: jest.fn(),
      removeParticipant: jest.fn(),
      getParticipants: jest.fn(),
      updateParticipantSettings: jest.fn(),
    };

    const mockQueueService: Partial<jest.Mocked<MessageQueueService>> = {
      getQueueMetrics: jest.fn(),
      getQueueHealth: jest.fn(),
      getFailedJobs: jest.fn(),
      retryFailedJob: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnhancedMessageController],
      providers: [
        {
          provide: EnhancedMessageService,
          useValue: mockMessageService,
        },
        {
          provide: ConversationService,
          useValue: mockConversationService,
        },
        {
          provide: MessageQueueService,
          useValue: mockQueueService,
        },
      ],
    }).compile();

    controller = module.get<EnhancedMessageController>(EnhancedMessageController);
    messageService = module.get(EnhancedMessageService);
    conversationService = module.get(ConversationService);
    queueService = module.get(MessageQueueService);
  });

  describe('constructor', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });

    it('should inject all required services', () => {
      expect(messageService).toBeDefined();
      expect(conversationService).toBeDefined();
      expect(queueService).toBeDefined();
    });
  });

  describe('sendDirectMessage', () => {
    it('should send a direct message successfully', async () => {
      const dto: SendDirectMessageDto = {
        recipientId: 'recipient-789',
        content: 'Hello!',
      };
      const expectedResult = { message: mockMessage, conversation: mockConversation };

      messageService.sendDirectMessage.mockResolvedValue(expectedResult);

      const result = await controller.sendDirectMessage(dto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.sendDirectMessage).toHaveBeenCalledWith(
        dto,
        'user-123',
        'tenant-456'
      );
      expect(messageService.sendDirectMessage).toHaveBeenCalledTimes(1);
    });

    it('should handle missing user id', async () => {
      const dto: SendDirectMessageDto = {
        recipientId: 'recipient-789',
        content: 'Hello!',
      };
      const requestWithoutUser = { user: undefined } as AuthenticatedRequest;

      messageService.sendDirectMessage.mockResolvedValue({ message: mockMessage, conversation: mockConversation });

      await controller.sendDirectMessage(dto, requestWithoutUser);

      expect(messageService.sendDirectMessage).toHaveBeenCalledWith(dto, undefined, undefined);
    });

    it('should handle service errors', async () => {
      const dto: SendDirectMessageDto = {
        recipientId: 'recipient-789',
        content: 'Hello!',
      };
      const error = new Error('Recipient not found');

      messageService.sendDirectMessage.mockRejectedValue(error);

      await expect(controller.sendDirectMessage(dto, mockAuthRequest)).rejects.toThrow('Recipient not found');
    });
  });

  describe('sendGroupMessage', () => {
    it('should send a group message successfully', async () => {
      const dto: SendGroupMessageDto = {
        conversationId: 'conversation-456',
        content: 'Hello group!',
      };
      const expectedResult = { message: mockMessage };

      messageService.sendGroupMessage.mockResolvedValue(expectedResult);

      const result = await controller.sendGroupMessage(dto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(messageService.sendGroupMessage).toHaveBeenCalledWith(dto, 'user-123', 'tenant-456');
    });

    it('should handle unauthorized user errors', async () => {
      const dto: SendGroupMessageDto = {
        conversationId: 'conversation-456',
        content: 'Hello group!',
      };
      const error = new Error('Not a participant in the conversation');

      messageService.sendGroupMessage.mockRejectedValue(error);

      await expect(controller.sendGroupMessage(dto, mockAuthRequest)).rejects.toThrow(
        'Not a participant in the conversation'
      );
    });
  });

  describe('editMessage', () => {
    it('should edit a message successfully', async () => {
      const messageId = 'message-123';
      const dto: EditMessageDto = {
        content: 'Updated content',
      };
      const updatedMessage = { ...mockMessage, content: 'Updated content', edited: true };

      messageService.editMessage.mockResolvedValue(updatedMessage);

      const result = await controller.editMessage(messageId, dto, mockAuthRequest);

      expect(result).toEqual(updatedMessage);
      expect(messageService.editMessage).toHaveBeenCalledWith(messageId, dto, 'user-123');
    });

    it('should handle unauthorized edit attempts', async () => {
      const messageId = 'message-123';
      const dto: EditMessageDto = {
        content: 'Updated content',
      };
      const error = new Error('Not authorized to edit this message');

      messageService.editMessage.mockRejectedValue(error);

      await expect(controller.editMessage(messageId, dto, mockAuthRequest)).rejects.toThrow(
        'Not authorized to edit this message'
      );
    });

    it('should handle non-existent message', async () => {
      const messageId = 'non-existent';
      const dto: EditMessageDto = {
        content: 'Updated content',
      };
      const error = new Error('Message not found');

      messageService.editMessage.mockRejectedValue(error);

      await expect(controller.editMessage(messageId, dto, mockAuthRequest)).rejects.toThrow('Message not found');
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message successfully', async () => {
      const messageId = 'message-123';

      messageService.deleteMessage.mockResolvedValue(undefined);

      await controller.deleteMessage(messageId, mockAuthRequest);

      expect(messageService.deleteMessage).toHaveBeenCalledWith(messageId, 'user-123');
    });

    it('should handle unauthorized delete attempts', async () => {
      const messageId = 'message-123';
      const error = new Error('Not authorized to delete this message');

      messageService.deleteMessage.mockRejectedValue(error);

      await expect(controller.deleteMessage(messageId, mockAuthRequest)).rejects.toThrow(
        'Not authorized to delete this message'
      );
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read successfully', async () => {
      const dto: MarkAsReadDto = {
        messageIds: ['message-1', 'message-2', 'message-3'],
      };
      const result = { markedAsRead: 3, total: 3 };

      messageService.markMessagesAsRead.mockResolvedValue(result);

      const response = await controller.markMessagesAsRead(dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.markMessagesAsRead).toHaveBeenCalledWith(dto, 'user-123');
    });

    it('should handle empty message list', async () => {
      const dto: MarkAsReadDto = {
        messageIds: [],
      };
      const result = { markedAsRead: 0, total: 0 };

      messageService.markMessagesAsRead.mockResolvedValue(result);

      const response = await controller.markMessagesAsRead(dto, mockAuthRequest);

      expect(response).toEqual(result);
    });
  });

  describe('markConversationAsRead', () => {
    it('should mark all messages in conversation as read', async () => {
      const dto: MarkConversationAsReadDto = {
        conversationId: 'conversation-456',
      };
      const result = { markedAsRead: 5 };

      messageService.markConversationAsRead.mockResolvedValue(result);

      const response = await controller.markConversationAsRead(dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.markConversationAsRead).toHaveBeenCalledWith(dto, 'user-123');
    });
  });

  describe('getMessageHistory', () => {
    it('should retrieve message history with pagination', async () => {
      const dto: MessagePaginationDto = {
        page: 1,
        limit: 20,
      };
      const result = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 100, pages: 5 },
      };

      messageService.getMessageHistory.mockResolvedValue(result);

      const response = await controller.getMessageHistory(dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.getMessageHistory).toHaveBeenCalledWith(dto, 'user-123', 'tenant-456');
    });

    it('should handle filtering by conversation', async () => {
      const dto: MessagePaginationDto = {
        page: 1,
        limit: 20,
        conversationId: 'conversation-456',
      };
      const result = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 10, pages: 1 },
      };

      messageService.getMessageHistory.mockResolvedValue(result);

      const response = await controller.getMessageHistory(dto, mockAuthRequest);

      expect(response).toEqual(result);
    });
  });

  describe('searchMessages', () => {
    it('should search messages with query', async () => {
      const dto: SearchMessagesDto = {
        query: 'hello',
        page: 1,
        limit: 20,
      };
      const result = {
        messages: [mockMessage],
        pagination: { page: 1, limit: 20, total: 5, pages: 1 },
      };

      messageService.searchMessages.mockResolvedValue(result);

      const response = await controller.searchMessages(dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.searchMessages).toHaveBeenCalledWith(dto, 'user-123', 'tenant-456');
    });

    it('should handle empty search results', async () => {
      const dto: SearchMessagesDto = {
        query: 'nonexistent',
        page: 1,
        limit: 20,
      };
      const result = {
        messages: [],
        pagination: { page: 1, limit: 20, total: 0, pages: 0 },
      };

      messageService.searchMessages.mockResolvedValue(result);

      const response = await controller.searchMessages(dto, mockAuthRequest);

      expect(response).toEqual(result);
    });
  });

  describe('getUnreadCount', () => {
    it('should get total unread count', async () => {
      const result = {
        total: 15,
        byConversation: {
          'conversation-1': 5,
          'conversation-2': 10,
        },
      };

      messageService.getUnreadCount.mockResolvedValue(result);

      const response = await controller.getUnreadCount(undefined, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.getUnreadCount).toHaveBeenCalledWith('user-123', undefined);
    });

    it('should get unread count for specific conversation', async () => {
      const conversationId = 'conversation-456';
      const result = {
        total: 5,
        byConversation: {
          'conversation-456': 5,
        },
      };

      messageService.getUnreadCount.mockResolvedValue(result);

      const response = await controller.getUnreadCount(conversationId, mockAuthRequest);

      expect(response).toEqual(result);
      expect(messageService.getUnreadCount).toHaveBeenCalledWith('user-123', conversationId);
    });
  });

  describe('uploadAttachments', () => {
    it('should upload multiple files and return URLs', async () => {
      const mockFiles = [
        { originalname: 'file1.pdf', buffer: Buffer.from('test') },
        { originalname: 'file2.jpg', buffer: Buffer.from('image') },
      ] as Express.Multer.File[];

      const result = await controller.uploadAttachments(mockFiles, mockAuthRequest);

      expect(result.urls).toHaveLength(2);
      expect(result.urls[0]).toContain('file1.pdf');
      expect(result.urls[1]).toContain('file2.jpg');
    });

    it('should handle empty file array', async () => {
      const mockFiles: Express.Multer.File[] = [];

      const result = await controller.uploadAttachments(mockFiles, mockAuthRequest);

      expect(result.urls).toHaveLength(0);
    });

    it('should handle single file upload', async () => {
      const mockFiles = [
        { originalname: 'document.pdf', buffer: Buffer.from('content') },
      ] as Express.Multer.File[];

      const result = await controller.uploadAttachments(mockFiles, mockAuthRequest);

      expect(result.urls).toHaveLength(1);
      expect(result.urls[0]).toContain('document.pdf');
    });
  });

  describe('createConversation', () => {
    it('should create a new conversation', async () => {
      const dto: CreateConversationDto = {
        type: ConversationType.GROUP,
        name: 'Team Chat',
        participantIds: ['user-1', 'user-2', 'user-3'],
      };
      const expectedResult = { ...mockConversation, name: 'Team Chat', type: ConversationType.GROUP };

      conversationService.createConversation.mockResolvedValue(expectedResult);

      const result = await controller.createConversation(dto, mockAuthRequest);

      expect(result).toEqual(expectedResult);
      expect(conversationService.createConversation).toHaveBeenCalledWith(dto, 'user-123', 'tenant-456');
    });

    it('should handle invalid conversation data', async () => {
      const dto: CreateConversationDto = {
        type: ConversationType.DIRECT,
        participantIds: [],
      };
      const error = new Error('Invalid conversation data');

      conversationService.createConversation.mockRejectedValue(error);

      await expect(controller.createConversation(dto, mockAuthRequest)).rejects.toThrow('Invalid conversation data');
    });
  });

  describe('listConversations', () => {
    it('should list conversations with default parameters', async () => {
      const result = {
        conversations: [mockConversation],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      conversationService.listConversations.mockResolvedValue(result);

      const response = await controller.listConversations(false, undefined, 1, 20, mockAuthRequest);

      expect(response).toEqual(result);
      expect(conversationService.listConversations).toHaveBeenCalledWith('user-123', 'tenant-456', {
        includeArchived: false,
        type: undefined,
        page: 1,
        limit: 20,
      });
    });

    it('should filter by conversation type', async () => {
      const result = {
        conversations: [mockConversation],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      conversationService.listConversations.mockResolvedValue(result);

      await controller.listConversations(false, ConversationType.DIRECT, 1, 20, mockAuthRequest);

      expect(conversationService.listConversations).toHaveBeenCalledWith('user-123', 'tenant-456', {
        includeArchived: false,
        type: ConversationType.DIRECT,
        page: 1,
        limit: 20,
      });
    });

    it('should include archived conversations when requested', async () => {
      const result = {
        conversations: [mockConversation],
        pagination: { page: 1, limit: 20, total: 1, pages: 1 },
      };

      conversationService.listConversations.mockResolvedValue(result);

      await controller.listConversations(true, undefined, 1, 20, mockAuthRequest);

      expect(conversationService.listConversations).toHaveBeenCalledWith('user-123', 'tenant-456', {
        includeArchived: true,
        type: undefined,
        page: 1,
        limit: 20,
      });
    });
  });

  describe('getConversation', () => {
    it('should retrieve conversation details', async () => {
      const conversationId = 'conversation-456';

      conversationService.getConversation.mockResolvedValue(mockConversation);

      const result = await controller.getConversation(conversationId, mockAuthRequest);

      expect(result).toEqual(mockConversation);
      expect(conversationService.getConversation).toHaveBeenCalledWith(conversationId, 'user-123', 'tenant-456');
    });

    it('should handle non-participant access', async () => {
      const conversationId = 'conversation-456';
      const error = new Error('Not a participant in the conversation');

      conversationService.getConversation.mockRejectedValue(error);

      await expect(controller.getConversation(conversationId, mockAuthRequest)).rejects.toThrow(
        'Not a participant in the conversation'
      );
    });
  });

  describe('updateConversation', () => {
    it('should update conversation successfully', async () => {
      const conversationId = 'conversation-456';
      const dto: UpdateConversationDto = {
        name: 'Updated Name',
        description: 'New description',
      };
      const updatedConversation = { ...mockConversation, name: 'Updated Name', description: 'New description' };

      conversationService.updateConversation.mockResolvedValue(updatedConversation);

      const result = await controller.updateConversation(conversationId, dto, mockAuthRequest);

      expect(result).toEqual(updatedConversation);
      expect(conversationService.updateConversation).toHaveBeenCalledWith(
        conversationId,
        dto,
        'user-123',
        'tenant-456'
      );
    });

    it('should handle unauthorized update attempts', async () => {
      const conversationId = 'conversation-456';
      const dto: UpdateConversationDto = {
        name: 'Updated Name',
      };
      const error = new Error('Not authorized to update conversation');

      conversationService.updateConversation.mockRejectedValue(error);

      await expect(controller.updateConversation(conversationId, dto, mockAuthRequest)).rejects.toThrow(
        'Not authorized to update conversation'
      );
    });
  });

  describe('deleteConversation', () => {
    it('should delete conversation successfully', async () => {
      const conversationId = 'conversation-456';

      conversationService.deleteConversation.mockResolvedValue(undefined);

      await controller.deleteConversation(conversationId, mockAuthRequest);

      expect(conversationService.deleteConversation).toHaveBeenCalledWith(conversationId, 'user-123', 'tenant-456');
    });

    it('should handle non-owner delete attempts', async () => {
      const conversationId = 'conversation-456';
      const error = new Error('Only owner can delete conversation');

      conversationService.deleteConversation.mockRejectedValue(error);

      await expect(controller.deleteConversation(conversationId, mockAuthRequest)).rejects.toThrow(
        'Only owner can delete conversation'
      );
    });
  });

  describe('addParticipant', () => {
    it('should add participant successfully', async () => {
      const conversationId = 'conversation-456';
      const dto: AddParticipantDto = {
        userId: 'new-user-789',
        role: 'MEMBER',
      };
      const result = { success: true, participant: { userId: 'new-user-789', role: 'MEMBER' } };

      conversationService.addParticipant.mockResolvedValue(result);

      const response = await controller.addParticipant(conversationId, dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(conversationService.addParticipant).toHaveBeenCalledWith(
        conversationId,
        dto,
        'user-123',
        'tenant-456'
      );
    });

    it('should handle unauthorized add participant attempts', async () => {
      const conversationId = 'conversation-456';
      const dto: AddParticipantDto = {
        userId: 'new-user-789',
        role: 'MEMBER',
      };
      const error = new Error('Not authorized to add participants');

      conversationService.addParticipant.mockRejectedValue(error);

      await expect(controller.addParticipant(conversationId, dto, mockAuthRequest)).rejects.toThrow(
        'Not authorized to add participants'
      );
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant successfully', async () => {
      const conversationId = 'conversation-456';
      const userId = 'user-to-remove';

      conversationService.removeParticipant.mockResolvedValue(undefined);

      await controller.removeParticipant(conversationId, userId, mockAuthRequest);

      expect(conversationService.removeParticipant).toHaveBeenCalledWith(
        conversationId,
        userId,
        'user-123',
        'tenant-456'
      );
    });

    it('should allow user to remove themselves', async () => {
      const conversationId = 'conversation-456';
      const userId = 'user-123'; // Same as authenticated user

      conversationService.removeParticipant.mockResolvedValue(undefined);

      await controller.removeParticipant(conversationId, userId, mockAuthRequest);

      expect(conversationService.removeParticipant).toHaveBeenCalledWith(
        conversationId,
        userId,
        'user-123',
        'tenant-456'
      );
    });

    it('should handle unauthorized remove participant attempts', async () => {
      const conversationId = 'conversation-456';
      const userId = 'other-user';
      const error = new Error('Not authorized to remove participant');

      conversationService.removeParticipant.mockRejectedValue(error);

      await expect(controller.removeParticipant(conversationId, userId, mockAuthRequest)).rejects.toThrow(
        'Not authorized to remove participant'
      );
    });
  });

  describe('getParticipants', () => {
    it('should retrieve conversation participants', async () => {
      const conversationId = 'conversation-456';
      const participants = [
        { userId: 'user-1', role: 'OWNER' },
        { userId: 'user-2', role: 'MEMBER' },
      ];

      conversationService.getParticipants.mockResolvedValue({ participants });

      const result = await controller.getParticipants(conversationId, mockAuthRequest);

      expect(result).toEqual({ participants });
      expect(conversationService.getParticipants).toHaveBeenCalledWith(conversationId, 'user-123');
    });

    it('should handle non-participant access', async () => {
      const conversationId = 'conversation-456';
      const error = new Error('Not a participant in the conversation');

      conversationService.getParticipants.mockRejectedValue(error);

      await expect(controller.getParticipants(conversationId, mockAuthRequest)).rejects.toThrow(
        'Not a participant in the conversation'
      );
    });
  });

  describe('updateParticipantSettings', () => {
    it('should update participant settings', async () => {
      const conversationId = 'conversation-456';
      const dto: UpdateParticipantDto = {
        muted: true,
        pinned: true,
      };
      const result = { success: true, settings: dto };

      conversationService.updateParticipantSettings.mockResolvedValue(result);

      const response = await controller.updateParticipantSettings(conversationId, dto, mockAuthRequest);

      expect(response).toEqual(result);
      expect(conversationService.updateParticipantSettings).toHaveBeenCalledWith(conversationId, dto, 'user-123');
    });

    it('should handle mute only', async () => {
      const conversationId = 'conversation-456';
      const dto: UpdateParticipantDto = {
        muted: true,
      };
      const result = { success: true, settings: dto };

      conversationService.updateParticipantSettings.mockResolvedValue(result);

      const response = await controller.updateParticipantSettings(conversationId, dto, mockAuthRequest);

      expect(response).toEqual(result);
    });
  });

  describe('getQueueMetrics', () => {
    it('should retrieve queue metrics for all queues', async () => {
      const metrics = {
        'message-delivery': {
          waiting: 5,
          active: 2,
          completed: 1523,
          failed: 3,
        },
        'message-notification': {
          waiting: 10,
          active: 5,
          completed: 2051,
          failed: 1,
        },
      };

      queueService.getQueueMetrics.mockResolvedValue(metrics);

      const result = await controller.getQueueMetrics();

      expect(result).toEqual(metrics);
      expect(queueService.getQueueMetrics).toHaveBeenCalled();
    });

    it('should handle empty metrics', async () => {
      queueService.getQueueMetrics.mockResolvedValue({});

      const result = await controller.getQueueMetrics();

      expect(result).toEqual({});
    });
  });

  describe('getQueueHealth', () => {
    it('should retrieve health status for a queue', async () => {
      const queueName = 'message-delivery';
      const health = {
        status: 'healthy',
        failureRate: 0.02,
        checks: {
          hasJobs: true,
          isProcessing: true,
          failureRate: 'normal',
        },
      };

      queueService.getQueueHealth.mockResolvedValue(health);

      const result = await controller.getQueueHealth(queueName);

      expect(result).toEqual(health);
      expect(queueService.getQueueHealth).toHaveBeenCalledWith(queueName);
    });

    it('should handle unhealthy queue status', async () => {
      const queueName = 'message-delivery';
      const health = {
        status: 'unhealthy',
        failureRate: 0.25,
        checks: {
          hasJobs: true,
          isProcessing: false,
          failureRate: 'high',
        },
      };

      queueService.getQueueHealth.mockResolvedValue(health);

      const result = await controller.getQueueHealth(queueName);

      expect(result).toEqual(health);
      expect(result.status).toBe('unhealthy');
    });
  });

  describe('getFailedJobs', () => {
    it('should retrieve failed jobs with default limit', async () => {
      const queueName = 'message-delivery';
      const failedJobs = [
        {
          id: 'job-123',
          data: { messageId: 'msg-456' },
          failedReason: 'Recipient not found',
          attemptsMade: 5,
          timestamp: '2025-10-29T12:00:00Z',
        },
      ];

      queueService.getFailedJobs.mockResolvedValue(failedJobs);

      const result = await controller.getFailedJobs(queueName, undefined);

      expect(result).toEqual(failedJobs);
      expect(queueService.getFailedJobs).toHaveBeenCalledWith(queueName, 50);
    });

    it('should retrieve failed jobs with custom limit', async () => {
      const queueName = 'message-delivery';
      const limit = 10;
      const failedJobs = [
        {
          id: 'job-123',
          data: { messageId: 'msg-456' },
          failedReason: 'Network timeout',
          attemptsMade: 3,
          timestamp: '2025-10-29T12:00:00Z',
        },
      ];

      queueService.getFailedJobs.mockResolvedValue(failedJobs);

      const result = await controller.getFailedJobs(queueName, limit);

      expect(result).toEqual(failedJobs);
      expect(queueService.getFailedJobs).toHaveBeenCalledWith(queueName, limit);
    });

    it('should handle no failed jobs', async () => {
      const queueName = 'message-delivery';

      queueService.getFailedJobs.mockResolvedValue([]);

      const result = await controller.getFailedJobs(queueName, 50);

      expect(result).toEqual([]);
    });
  });

  describe('retryFailedJob', () => {
    it('should retry a failed job successfully', async () => {
      const queueName = 'message-delivery';
      const jobId = 'job-123';

      queueService.retryFailedJob.mockResolvedValue(undefined);

      const result = await controller.retryFailedJob(queueName, jobId);

      expect(result).toEqual({
        success: true,
        message: `Job ${jobId} queued for retry in ${queueName}`,
      });
      expect(queueService.retryFailedJob).toHaveBeenCalledWith(queueName, jobId);
    });

    it('should handle retry errors', async () => {
      const queueName = 'message-delivery';
      const jobId = 'non-existent-job';
      const error = new Error('Job not found');

      queueService.retryFailedJob.mockRejectedValue(error);

      await expect(controller.retryFailedJob(queueName, jobId)).rejects.toThrow('Job not found');
    });
  });
});
