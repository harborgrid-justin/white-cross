import { Body, Controller, Get, Param, Post, Query, Req, Version } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/index';
import { CreateBroadcastDto } from '../dto/create-broadcast.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BroadcastService } from '../services/broadcast.service';

import { BaseController } from '@/common/base';
@ApiTags('Broadcasts')
@ApiBearerAuth()

@Controller('broadcasts')
export class BroadcastController extends BaseController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post()
  @ApiOperation({
    summary: 'Create broadcast message',
    description: 'Send broadcast message to targeted audience',
  })
  @ApiBody({ type: CreateBroadcastDto })
  @ApiResponse({
    status: 201,
    description: 'Broadcast created and sent successfully',
    schema: {
      example: {
        message: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          subject: 'School Emergency Alert',
          content: 'Due to severe weather...',
          priority: 'URGENT',
          category: 'EMERGENCY',
          recipientCount: 250,
          createdAt: '2025-10-28T10:00:00Z',
        },
        deliveryStatuses: [],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid audience or content' })
  async createBroadcast(@Body() dto: CreateBroadcastDto, @Req() req: AuthenticatedRequest) {
    const senderId = req.user?.id;
    return this.broadcastService.createBroadcast({ ...dto, senderId });
  }

  @Get()
  @ApiOperation({
    summary: 'List broadcast messages',
    description: 'Get paginated list of broadcast messages',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiResponse({
    status: 200,
    description: 'Broadcasts retrieved successfully',
  })
  async listBroadcasts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('category') category?: string,
    @Query('priority') priority?: string,
  ) {
    return this.broadcastService.listBroadcasts(page, limit, {
      category,
      priority,
    });
  }

  @Get('scheduled')
  @ApiOperation({
    summary: 'List scheduled broadcasts',
    description: "Get all scheduled broadcasts that haven't been sent yet",
  })
  @ApiResponse({
    status: 200,
    description: 'Scheduled broadcasts retrieved successfully',
  })
  async listScheduled() {
    return this.broadcastService.listScheduled();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get broadcast by ID',
    description: 'Retrieve detailed information about a broadcast',
  })
  @ApiParam({ name: 'id', description: 'Broadcast ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Broadcast retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Broadcast not found' })
  async getBroadcastById(@Param('id') id: string) {
    return this.broadcastService.getBroadcastById(id);
  }

  @Get(':id/delivery')
  @ApiOperation({
    summary: 'Get broadcast delivery report',
    description:
      'Get comprehensive delivery report with statistics by channel and recipient type',
  })
  @ApiParam({ name: 'id', description: 'Broadcast ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Delivery report retrieved successfully',
    schema: {
      example: {
        report: {
          messageId: '123e4567-e89b-12d3-a456-426614174000',
          summary: {
            total: 250,
            pending: 0,
            sent: 10,
            delivered: 240,
            failed: 0,
            bounced: 0,
          },
          byChannel: {
            EMAIL: { total: 200, delivered: 195, failed: 5, pending: 0 },
            SMS: { total: 50, delivered: 45, failed: 5, pending: 0 },
          },
          byRecipientType: {
            PARENT: { total: 150, delivered: 145, failed: 5, pending: 0 },
            EMERGENCY_CONTACT: {
              total: 100,
              delivered: 95,
              failed: 5,
              pending: 0,
            },
          },
        },
      },
    },
  })
  async getDeliveryReport(@Param('id') id: string) {
    return this.broadcastService.getDeliveryReport(id);
  }

  @Get(':id/recipients')
  @ApiOperation({
    summary: 'List broadcast recipients',
    description: 'Get paginated list of recipients for a broadcast',
  })
  @ApiParam({ name: 'id', description: 'Broadcast ID (UUID)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 50 })
  @ApiResponse({
    status: 200,
    description: 'Recipients retrieved successfully',
  })
  async getRecipients(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.broadcastService.getRecipients(id, page, limit);
  }

  @Post(':id/cancel')
  @ApiOperation({
    summary: 'Cancel scheduled broadcast',
    description: 'Cancel a broadcast that is scheduled but not yet sent',
  })
  @ApiParam({ name: 'id', description: 'Broadcast ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Broadcast cancelled successfully',
  })
  @ApiResponse({ status: 400, description: 'Cannot cancel sent broadcasts' })
  @ApiResponse({
    status: 403,
    description: 'Not authorized to cancel this broadcast',
  })
  async cancelBroadcast(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.broadcastService.cancelBroadcast(id, userId);
  }

  @Post('schedule')
  @ApiOperation({
    summary: 'Schedule broadcast for future delivery',
    description: 'Create a broadcast scheduled for future delivery',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        subject: { type: 'string', example: 'Scheduled Announcement' },
        body: { type: 'string', example: 'This is a scheduled message...' },
        recipientType: {
          type: 'string',
          enum: [
            'ALL_PARENTS',
            'SPECIFIC_USERS',
            'STUDENT_PARENTS',
            'GRADE_LEVEL',
            'CUSTOM_GROUP',
          ],
        },
        recipientIds: { type: 'array', items: { type: 'string' } },
        channels: {
          type: 'array',
          items: { type: 'string', enum: ['EMAIL', 'SMS', 'PUSH', 'PORTAL'] },
        },
        scheduledFor: {
          type: 'string',
          format: 'date-time',
          example: '2025-10-29T09:00:00Z',
        },
        priority: { type: 'string', enum: ['LOW', 'NORMAL', 'HIGH'] },
      },
      required: [
        'subject',
        'body',
        'recipientType',
        'channels',
        'scheduledFor',
      ],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Broadcast scheduled successfully',
  })
  async scheduleBroadcast(@Body() scheduleDto: Record<string, unknown>, @Req() req: AuthenticatedRequest) {
    const createdBy = req.user?.id;
    return this.broadcastService.scheduleBroadcast({
      ...scheduleDto,
      createdBy,
    });
  }
}
