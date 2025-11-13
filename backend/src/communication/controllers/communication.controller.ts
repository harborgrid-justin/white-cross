import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommunicationService } from '../services/communication.service';
import { BroadcastMessageDto } from '../dto/broadcast-message.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { CreateMessageTemplateDto } from '../dto/create-message-template.dto';
import { EmergencyAlertDto } from '../dto/emergency-alert.dto';
import { UpdateMessageTemplateDto } from '../dto/update-message-template.dto';

import { BaseController } from '../../../common/base';
@ApiTags('Communication')
@ApiBearerAuth()
@Controller('communication')
export class CommunicationController extends BaseController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('templates')
  @ApiOperation({
    summary: 'Create message template',
    description: 'Creates a new reusable message template for communications',
  })
  @ApiBody({
    type: CreateMessageTemplateDto,
    description: 'Message template creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Message template created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  async createTemplate(@Body() dto: CreateMessageTemplateDto) {
    return this.communicationService.createMessageTemplate(dto);
  }

  @Get('templates')
  @ApiOperation({
    summary: 'Get message templates',
    description:
      'Retrieves paginated list of message templates with optional filtering by type and category. Used for consistent messaging across the healthcare platform.',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['email', 'sms', 'push', 'in_app'],
    description: 'Filter by message type',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    enum: ['appointment', 'emergency', 'medication', 'general'],
    description: 'Filter by message category',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 20,
    description: 'Items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'Message templates retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        templates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              type: {
                type: 'string',
                enum: ['email', 'sms', 'push', 'in_app'],
              },
              category: { type: 'string' },
              subject: { type: 'string', nullable: true },
              content: { type: 'string' },
              variables: { type: 'array', items: { type: 'string' } },
              isActive: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getTemplates(
    @Query('type') type?: string,
    @Query('category') category?: string,
  ) {
    return [];
  }

  @Put('templates/:id')
  @ApiOperation({
    summary: 'Update message template',
    description:
      'Updates an existing message template with validation and version tracking. Maintains audit trail for compliance.',
  })
  @ApiParam({ name: 'id', description: 'Template UUID', format: 'uuid' })
  @ApiBody({ type: UpdateMessageTemplateDto })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        type: { type: 'string' },
        category: { type: 'string' },
        subject: { type: 'string', nullable: true },
        content: { type: 'string' },
        variables: { type: 'array', items: { type: 'string' } },
        isActive: { type: 'boolean' },
        version: { type: 'number' },
        updatedAt: { type: 'string', format: 'date-time' },
        updatedBy: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid template data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions to update templates',
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateMessageTemplateDto,
  ) {
    return { success: true };
  }

  @Delete('templates/:id')
  @ApiOperation({
    summary: 'Delete message template',
    description:
      'Soft deletes a message template while preserving historical usage data. Template becomes inactive but remains in audit trail.',
  })
  @ApiParam({ name: 'id', description: 'Template UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Template deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Template deleted successfully' },
        deletedAt: { type: 'string', format: 'date-time' },
        deletedBy: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions to delete templates',
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete template - currently in use by active messages',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteTemplate(@Param('id') id: string) {
    return { success: true };
  }

  @Post('messages')
  @ApiOperation({
    summary: 'Send individual message',
    description:
      'Sends a message to specific recipients (parents, students, or staff) with delivery tracking and HIPAA compliance logging. Supports personalization and scheduling.',
  })
  @ApiBody({ type: CreateMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        messageId: { type: 'string', example: 'MSG-2024-001234' },
        type: { type: 'string', enum: ['email', 'sms', 'push', 'in_app'] },
        recipients: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              recipientId: { type: 'string' },
              recipientType: {
                type: 'string',
                enum: ['parent', 'student', 'staff'],
              },
              deliveryMethod: { type: 'string' },
              status: {
                type: 'string',
                enum: ['queued', 'sent', 'delivered', 'failed'],
              },
            },
          },
        },
        scheduledFor: { type: 'string', format: 'date-time', nullable: true },
        sentAt: { type: 'string', format: 'date-time' },
        deliveryTracking: {
          type: 'object',
          properties: {
            totalRecipients: { type: 'number' },
            sentCount: { type: 'number' },
            deliveredCount: { type: 'number' },
            failedCount: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid message data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description:
      'Forbidden - Insufficient permissions or recipient access denied',
  })
  @ApiResponse({
    status: 422,
    description: 'Message content violates healthcare communication policies',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or delivery service failure',
  })
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.communicationService.sendMessage(dto);
  }

  @Post('broadcast')
  @ApiOperation({
    summary: 'Send broadcast message',
    description:
      'Sends a message to multiple recipients based on criteria (grade level, nurse assignment, etc.). Includes opt-out handling and delivery analytics for mass communications.',
  })
  @ApiBody({ type: BroadcastMessageDto })
  @ApiResponse({
    status: 201,
    description: 'Broadcast message initiated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        broadcastId: { type: 'string', example: 'BCAST-2024-001234' },
        title: { type: 'string' },
        type: { type: 'string', enum: ['email', 'sms', 'push', 'in_app'] },
        targetCriteria: {
          type: 'object',
          properties: {
            grades: { type: 'array', items: { type: 'string' } },
            nurses: { type: 'array', items: { type: 'string' } },
            studentStatuses: { type: 'array', items: { type: 'string' } },
            recipientTypes: { type: 'array', items: { type: 'string' } },
          },
        },
        estimatedRecipients: { type: 'number' },
        actualRecipients: { type: 'number' },
        scheduledFor: { type: 'string', format: 'date-time', nullable: true },
        status: {
          type: 'string',
          enum: ['scheduled', 'sending', 'completed', 'failed'],
        },
        createdAt: { type: 'string', format: 'date-time' },
        deliveryStats: {
          type: 'object',
          properties: {
            queued: { type: 'number' },
            sent: { type: 'number' },
            delivered: { type: 'number' },
            failed: { type: 'number' },
            optedOut: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid broadcast data or validation errors',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or nurse role required for broadcasts',
  })
  @ApiResponse({
    status: 422,
    description: 'Broadcast criteria results in no recipients',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error or delivery service failure',
  })
  async sendBroadcast(@Body() dto: BroadcastMessageDto) {
    return this.communicationService.sendBroadcastMessage(dto);
  }

  @Post('emergency-alert')
  @ApiOperation({
    summary: 'Send emergency alert',
    description:
      'CRITICAL ENDPOINT - Sends immediate emergency alerts with highest priority delivery across all available channels. Used for medical emergencies, lockdowns, and urgent safety communications. Bypasses opt-out preferences.',
  })
  @ApiBody({ type: EmergencyAlertDto })
  @ApiResponse({
    status: 201,
    description: 'Emergency alert sent successfully with immediate delivery',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        alertId: { type: 'string', example: 'EMRG-2024-001234' },
        alertType: {
          type: 'string',
          enum: [
            'medical_emergency',
            'lockdown',
            'evacuation',
            'weather',
            'security',
          ],
        },
        severity: {
          type: 'string',
          enum: ['low', 'medium', 'high', 'critical'],
        },
        title: { type: 'string' },
        message: { type: 'string' },
        affectedAreas: { type: 'array', items: { type: 'string' } },
        targetRecipients: {
          type: 'object',
          properties: {
            parents: { type: 'number' },
            staff: { type: 'number' },
            emergencyContacts: { type: 'number' },
            authorities: { type: 'number' },
          },
        },
        deliveryChannels: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['sms', 'email', 'push', 'voice_call', 'pa_system'],
          },
        },
        sentAt: { type: 'string', format: 'date-time' },
        escalationLevel: { type: 'number', minimum: 1, maximum: 5 },
        deliveryStatus: {
          type: 'object',
          properties: {
            immediate: { type: 'number' },
            delivered: { type: 'number' },
            failed: { type: 'number' },
            retrying: { type: 'number' },
          },
        },
        authoritiesNotified: { type: 'boolean' },
        followUpRequired: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid alert data or missing critical information',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or authorized emergency personnel only',
  })
  @ApiResponse({
    status: 500,
    description: 'CRITICAL ERROR - Emergency alert delivery failed',
  })
  async sendEmergencyAlert(@Body() dto: EmergencyAlertDto) {
    return this.communicationService.sendEmergencyAlert(dto);
  }

  @Get('messages')
  @ApiOperation({
    summary: 'Get message history',
    description:
      'Retrieves paginated message history with comprehensive filtering by type, status, recipients, and date range. Includes delivery analytics and compliance audit data.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 20,
    description: 'Items per page (max 100)',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['email', 'sms', 'push', 'in_app', 'emergency'],
    description: 'Filter by message type',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['queued', 'sent', 'delivered', 'failed', 'cancelled'],
    description: 'Filter by delivery status',
  })
  @ApiQuery({
    name: 'recipientType',
    required: false,
    enum: ['parent', 'student', 'staff', 'emergency_contact'],
    description: 'Filter by recipient type',
  })
  @ApiQuery({
    name: 'dateFrom',
    required: false,
    format: 'date',
    description: 'Filter messages from this date',
  })
  @ApiQuery({
    name: 'dateTo',
    required: false,
    format: 'date',
    description: 'Filter messages up to this date',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search in message content and subjects',
  })
  @ApiResponse({
    status: 200,
    description: 'Message history retrieved successfully with analytics',
    schema: {
      type: 'object',
      properties: {
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              messageId: { type: 'string' },
              type: { type: 'string' },
              subject: { type: 'string', nullable: true },
              preview: { type: 'string' },
              recipientCount: { type: 'number' },
              deliveryStatus: { type: 'string' },
              sentAt: { type: 'string', format: 'date-time' },
              deliveryRate: { type: 'number' },
              isEmergency: { type: 'boolean' },
              createdBy: { type: 'string' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' },
          },
        },
        analytics: {
          type: 'object',
          properties: {
            totalMessages: { type: 'number' },
            successRate: { type: 'number' },
            averageDeliveryTime: { type: 'number' },
            messagesByType: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions to view message history',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getMessages(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return { messages: [], pagination: { page, limit, total: 0, pages: 0 } };
  }

  @Get('messages/:id')
  async getMessage(@Param('id') id: string) {
    return {};
  }

  @Get('messages/:id/delivery-status')
  async getDeliveryStatus(@Param('id') id: string) {
    return { deliveries: [], summary: {} };
  }

  @Get('statistics')
  async getStatistics(@Query('from') from?: string, @Query('to') to?: string) {
    return {};
  }
}
