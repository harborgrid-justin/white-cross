import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req, UploadedFiles, UseInterceptors, Version } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/index';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { EnhancedMessageService } from '../services/enhanced-message.service';
import { ConversationService } from '../services/conversation.service';
import { MessageQueueService } from '@/infrastructure/queue/message-queue.service';
import { SendDirectMessageDto } from '../dto/send-direct-message.dto';
import { SendGroupMessageDto } from '../dto/send-group-message.dto';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { UpdateConversationDto } from '../dto/update-conversation.dto';
import { ConversationType } from '@/database/models';
import { EditMessageDto } from '../dto/edit-message.dto';
import { MessagePaginationDto } from '../dto/message-pagination.dto';
import { SearchMessagesDto } from '../dto/search-messages.dto';
import { MarkAsReadDto, MarkConversationAsReadDto } from '../dto/mark-as-read.dto';
import { AddParticipantDto, UpdateParticipantDto } from '../dto/conversation-participant.dto';

import { BaseController } from '@/common/base';
/**
 * EnhancedMessageController
 *
 * Comprehensive REST API for messaging and conversation management.
 *
 * Endpoints:
 * - Direct and group messaging
 * - Message CRUD operations
 * - Conversation management
 * - Participant management
 * - Message search and history
 * - Read tracking
 * - File attachments
 */
@ApiTags('Enhanced Messaging')
@ApiBearerAuth()

@Controller('enhanced-messages')
export class EnhancedMessageController extends BaseController {
  constructor(
    private readonly messageService: EnhancedMessageService,
    private readonly conversationService: ConversationService,
    private readonly queueService: MessageQueueService,
  ) {}

  // ===== Message Endpoints =====

  @Post('direct')
  @ApiOperation({
    summary: 'Send a direct message',
    description:
      "Send a 1-to-1 direct message. Automatically creates a conversation if one doesn't exist.",
  })
  @ApiBody({ type: SendDirectMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Direct message sent successfully',
    schema: {
      example: {
        message: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          conversationId: '456e7890-e89b-12d3-a456-426614174000',
          content: 'Hello, how are you?',
          senderId: '789e0123-e89b-12d3-a456-426614174000',
          createdAt: '2025-10-29T12:00:00Z',
        },
        conversation: {
          id: '456e7890-e89b-12d3-a456-426614174000',
          type: 'DIRECT',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Recipient not found' })
  async sendDirectMessage(@Body() dto: SendDirectMessageDto, @Req() req: AuthenticatedRequest) {
    const senderId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.messageService.sendDirectMessage(dto, senderId, tenantId);
  }

  @Post('group')
  @ApiOperation({
    summary: 'Send a group message',
    description: 'Send a message to an existing group conversation.',
  })
  @ApiBody({ type: SendGroupMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Group message sent successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not a participant in the conversation',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async sendGroupMessage(@Body() dto: SendGroupMessageDto, @Req() req: AuthenticatedRequest) {
    const senderId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.messageService.sendGroupMessage(dto, senderId, tenantId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Edit a message',
    description:
      'Edit message content. Only the sender can edit their messages.',
  })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiBody({ type: EditMessageDto })
  @ApiResponse({
    status: 200,
    description: 'Message updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to edit this message',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async editMessage(
    @Param('id') id: string,
    @Body() dto: EditMessageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.messageService.editMessage(id, dto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a message',
    description:
      'Soft delete a message. Only the sender can delete their messages.',
  })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Message deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to delete this message',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    await this.messageService.deleteMessage(id, userId);
  }

  @Post('read')
  @ApiOperation({
    summary: 'Mark messages as read',
    description: 'Mark one or more messages as read for the current user.',
  })
  @ApiBody({ type: MarkAsReadDto })
  @ApiResponse({
    status: 200,
    description: 'Messages marked as read',
    schema: {
      example: {
        markedAsRead: 5,
        total: 5,
      },
    },
  })
  async markMessagesAsRead(@Body() dto: MarkAsReadDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.messageService.markMessagesAsRead(dto, userId);
  }

  @Post('read/conversation')
  @ApiOperation({
    summary: 'Mark all messages in a conversation as read',
    description: 'Mark all unread messages in a conversation as read.',
  })
  @ApiBody({ type: MarkConversationAsReadDto })
  @ApiResponse({
    status: 200,
    description: 'Conversation marked as read',
  })
  async markConversationAsRead(
    @Body() dto: MarkConversationAsReadDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.messageService.markConversationAsRead(dto, userId);
  }

  @Get('history')
  @ApiOperation({
    summary: 'Get message history',
    description: 'Get paginated message history with filtering options.',
  })
  @ApiResponse({
    status: 200,
    description: 'Message history retrieved successfully',
  })
  async getMessageHistory(@Query() dto: MessagePaginationDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.messageService.getMessageHistory(dto, userId, tenantId);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search messages',
    description: 'Search messages with full-text search and filters.',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  async searchMessages(@Query() dto: SearchMessagesDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.messageService.searchMessages(dto, userId, tenantId);
  }

  @Get('unread/count')
  @ApiOperation({
    summary: 'Get unread message count',
    description:
      'Get total unread message count and breakdown by conversation.',
  })
  @ApiQuery({
    name: 'conversationId',
    required: false,
    description: 'Filter by conversation',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread count retrieved successfully',
    schema: {
      example: {
        total: 15,
        byConversation: {
          'conversation-id-1': 5,
          'conversation-id-2': 10,
        },
      },
    },
  })
  async getUnreadCount(
    @Query('conversationId') conversationId: string | undefined,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.messageService.getUnreadCount(userId, conversationId);
  }

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload message attachments',
    description: 'Upload files for message attachments (max 10 files).',
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      example: {
        urls: [
          'https://storage.example.com/files/abc123.pdf',
          'https://storage.example.com/files/def456.jpg',
        ],
      },
    },
  })
  async uploadAttachments(
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    // TODO: Implement file upload to storage service (S3, etc.)
    // For now, return placeholder URLs
    const urls = files.map(
      (file) => `https://storage.example.com/files/${file.originalname}`,
    );
    return { urls };
  }

  // ===== Conversation Endpoints =====

  @Post('conversations')
  @ApiOperation({
    summary: 'Create a new conversation',
    description: 'Create a new conversation (DIRECT, GROUP, or CHANNEL).',
  })
  @ApiBody({ type: CreateConversationDto })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid conversation data' })
  async createConversation(
    @Body() dto: CreateConversationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const creatorId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.conversationService.createConversation(
      dto,
      creatorId,
      tenantId,
    );
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'List conversations',
    description: 'Get list of conversations for the current user.',
  })
  @ApiQuery({ name: 'includeArchived', required: false, type: Boolean })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['DIRECT', 'GROUP', 'CHANNEL'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  async listConversations(
    @Query('includeArchived') includeArchived: boolean,
    @Query('type') type: ConversationType,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.conversationService.listConversations(userId, tenantId, {
      includeArchived,
      type,
      page,
      limit,
    });
  }

  @Get('conversations/:id')
  @ApiOperation({
    summary: 'Get conversation details',
    description: 'Get detailed information about a specific conversation.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not a participant in the conversation',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversation(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.conversationService.getConversation(id, userId, tenantId);
  }

  @Put('conversations/:id')
  @ApiOperation({
    summary: 'Update conversation',
    description: 'Update conversation metadata. Requires OWNER or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiBody({ type: UpdateConversationDto })
  @ApiResponse({
    status: 200,
    description: 'Conversation updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to update conversation',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async updateConversation(
    @Param('id') id: string,
    @Body() dto: UpdateConversationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.conversationService.updateConversation(
      id,
      dto,
      userId,
      tenantId,
    );
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete conversation',
    description: 'Delete a conversation. Requires OWNER role.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Conversation deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Only owner can delete conversation',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async deleteConversation(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    const tenantId = req.user?.tenantId;
    await this.conversationService.deleteConversation(id, userId, tenantId);
  }

  // ===== Participant Endpoints =====

  @Post('conversations/:id/participants')
  @ApiOperation({
    summary: 'Add participant to conversation',
    description:
      'Add a new participant to the conversation. Requires OWNER or ADMIN role.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiBody({ type: AddParticipantDto })
  @ApiResponse({
    status: 201,
    description: 'Participant added successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to add participants',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async addParticipant(
    @Param('id') id: string,
    @Body() dto: AddParticipantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const requesterId = req.user?.id;
    const tenantId = req.user?.tenantId;
    return this.conversationService.addParticipant(
      id,
      dto,
      requesterId,
      tenantId,
    );
  }

  @Delete('conversations/:id/participants/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove participant from conversation',
    description:
      'Remove a participant. OWNER/ADMIN can remove others, users can remove themselves.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiParam({ name: 'userId', description: 'User ID to remove (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Participant removed successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to remove participant',
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation or participant not found',
  })
  async removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const requesterId = req.user?.id;
    const tenantId = req.user?.tenantId;
    await this.conversationService.removeParticipant(
      id,
      userId,
      requesterId,
      tenantId,
    );
  }

  @Get('conversations/:id/participants')
  @ApiOperation({
    summary: 'Get conversation participants',
    description: 'Get list of all participants in the conversation.',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Participants retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Not a participant in the conversation',
  })
  async getParticipants(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.conversationService.getParticipants(id, userId);
  }

  @Put('conversations/:id/settings')
  @ApiOperation({
    summary: 'Update participant settings',
    description:
      'Update settings for current user in the conversation (mute, pin, etc.).',
  })
  @ApiParam({ name: 'id', description: 'Conversation ID (UUID)' })
  @ApiBody({ type: UpdateParticipantDto })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
  })
  async updateParticipantSettings(
    @Param('id') id: string,
    @Body() dto: UpdateParticipantDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.conversationService.updateParticipantSettings(id, dto, userId);
  }

  // ===== Queue Status Endpoints =====

  @Get('queue/metrics')
  @ApiOperation({
    summary: 'Get queue metrics',
    description:
      'Retrieve metrics for all message queues (waiting, active, completed, failed).',
  })
  @ApiResponse({
    status: 200,
    description: 'Queue metrics retrieved successfully',
    schema: {
      example: {
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
      },
    },
  })
  async getQueueMetrics() {
    return this.queueService.getQueueMetrics();
  }

  @Get('queue/:queueName/health')
  @ApiOperation({
    summary: 'Check queue health',
    description: 'Get health status for a specific queue.',
  })
  @ApiParam({
    name: 'queueName',
    description: 'Queue name (e.g., message-delivery, message-notification)',
    enum: [
      'message-delivery',
      'message-notification',
      'message-encryption',
      'message-indexing',
      'batch-message-sending',
      'message-cleanup',
    ],
  })
  @ApiResponse({
    status: 200,
    description: 'Queue health status',
    schema: {
      example: {
        status: 'healthy',
        failureRate: 0.02,
        checks: {
          hasJobs: true,
          isProcessing: true,
          failureRate: 'normal',
        },
      },
    },
  })
  async getQueueHealth(@Param('queueName') queueName: string) {
    return this.queueService.getQueueHealth(queueName as any);
  }

  @Get('queue/:queueName/failed')
  @ApiOperation({
    summary: 'Get failed jobs',
    description:
      'Retrieve list of failed jobs from a specific queue for debugging.',
  })
  @ApiParam({ name: 'queueName', description: 'Queue name' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of failed jobs to return (default: 50)',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'List of failed jobs',
    schema: {
      example: [
        {
          id: 'job-123',
          data: { messageId: 'msg-456' },
          failedReason: 'Recipient not found',
          attemptsMade: 5,
          timestamp: '2025-10-29T12:00:00Z',
        },
      ],
    },
  })
  async getFailedJobs(
    @Param('queueName') queueName: string,
    @Query('limit') limit?: number,
  ) {
    const maxJobs = limit || 50;
    return this.queueService.getFailedJobs(queueName as any, maxJobs);
  }

  @Post('queue/:queueName/failed/:jobId/retry')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retry a failed job',
    description: 'Manually retry a specific failed job.',
  })
  @ApiParam({ name: 'queueName', description: 'Queue name' })
  @ApiParam({ name: 'jobId', description: 'Job ID to retry' })
  @ApiResponse({
    status: 200,
    description: 'Job queued for retry',
  })
  async retryFailedJob(
    @Param('queueName') queueName: string,
    @Param('jobId') jobId: string,
  ) {
    await this.queueService.retryFailedJob(queueName as any, jobId);
    return {
      success: true,
      message: `Job ${jobId} queued for retry in ${queueName}`,
    };
  }
}
