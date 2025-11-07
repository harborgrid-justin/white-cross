import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../types';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageService } from '../services/message.service';
import { SendMessageDto } from '../dto/send-message.dto';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @ApiOperation({
    summary: 'Send a new message',
    description: 'Send a message to specific recipients via selected channels',
  })
  @ApiBody({ type: SendMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      example: {
        message: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          subject: 'Important Health Update',
          content: 'Your child has a scheduled appointment...',
          priority: 'MEDIUM',
          category: 'HEALTH_UPDATE',
          senderId: '456e7890-e89b-12d3-a456-426614174000',
          createdAt: '2025-10-28T10:00:00Z',
        },
        deliveryStatuses: [
          {
            recipientId: '789e0123-e89b-12d3-a456-426614174000',
            channel: 'EMAIL',
            status: 'DELIVERED',
            sentAt: '2025-10-28T10:00:05Z',
            deliveredAt: '2025-10-28T10:00:10Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: AuthenticatedRequest) {
    const senderId = req.user?.id;
    return this.messageService.sendMessage({ ...dto, senderId });
  }

  @Get()
  @ApiOperation({
    summary: 'List messages',
    description: 'Get paginated list of messages with optional filters',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'senderId', required: false, type: String })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: [
      'EMERGENCY',
      'HEALTH_UPDATE',
      'APPOINTMENT_REMINDER',
      'MEDICATION_REMINDER',
      'GENERAL',
      'INCIDENT_NOTIFICATION',
      'COMPLIANCE',
    ],
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    type: String,
    example: '2025-10-01',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    type: String,
    example: '2025-10-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Messages retrieved successfully',
    schema: {
      example: {
        messages: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            subject: 'Health Update',
            content: 'Message content...',
            priority: 'MEDIUM',
            category: 'HEALTH_UPDATE',
            recipientCount: 5,
            createdAt: '2025-10-28T10:00:00Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          pages: 5,
        },
      },
    },
  })
  async listMessages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('senderId') senderId?: string,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.messageService.getMessages(page, limit, {
      senderId,
      category,
      priority,
      dateFrom,
      dateTo,
    });
  }

  @Get('inbox')
  @ApiOperation({
    summary: 'Get inbox messages',
    description: 'Get messages received by the current user',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Inbox messages retrieved successfully',
  })
  async getInbox(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.messageService.getInbox(userId, page, limit);
  }

  @Get('sent')
  @ApiOperation({
    summary: 'Get sent messages',
    description: 'Get messages sent by the current user',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiResponse({
    status: 200,
    description: 'Sent messages retrieved successfully',
  })
  async getSentMessages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.messageService.getSentMessages(userId, page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get message by ID',
    description: 'Retrieve detailed information about a specific message',
  })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Message retrieved successfully',
    schema: {
      example: {
        message: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          subject: 'Health Update',
          content: 'Message content...',
          priority: 'MEDIUM',
          category: 'HEALTH_UPDATE',
          recipientCount: 5,
          sender: {
            id: '456e7890-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
          },
          createdAt: '2025-10-28T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async getMessageById(@Param('id') id: string) {
    return this.messageService.getMessageById(id);
  }

  @Get(':id/delivery')
  @ApiOperation({
    summary: 'Get message delivery status',
    description: 'Get detailed delivery status for all recipients of a message',
  })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Delivery status retrieved successfully',
    schema: {
      example: {
        deliveries: [
          {
            id: '789e0123-e89b-12d3-a456-426614174000',
            recipientId: '012e3456-e89b-12d3-a456-426614174000',
            channel: 'EMAIL',
            status: 'DELIVERED',
            sentAt: '2025-10-28T10:00:05Z',
            deliveredAt: '2025-10-28T10:00:10Z',
          },
        ],
        summary: {
          total: 10,
          pending: 0,
          sent: 2,
          delivered: 8,
          failed: 0,
          bounced: 0,
        },
      },
    },
  })
  async getDeliveryStatus(@Param('id') id: string) {
    return this.messageService.getMessageDeliveryStatus(id);
  }

  @Post(':id/reply')
  @ApiOperation({
    summary: 'Reply to a message',
    description: 'Send a reply to an existing message',
  })
  @ApiParam({ name: 'id', description: 'Original message ID (UUID)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Reply message content',
          example: 'Thank you for the update.',
        },
        channels: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'],
          },
          example: ['EMAIL'],
        },
      },
      required: ['content'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Reply sent successfully',
  })
  @ApiResponse({ status: 404, description: 'Original message not found' })
  async replyToMessage(
    @Param('id') id: string,
    @Body() replyDto: { content: string; channels?: string[] },
    @Req() req: AuthenticatedRequest,
  ) {
    const senderId = req.user?.id;
    return this.messageService.replyToMessage(id, senderId, replyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete scheduled message',
    description: 'Cancel and delete a scheduled message (only if not yet sent)',
  })
  @ApiParam({ name: 'id', description: 'Message ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Message deleted successfully',
  })
  @ApiResponse({ status: 400, description: 'Cannot delete sent messages' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to delete this message',
  })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    await this.messageService.deleteScheduledMessage(id, userId);
  }
}
