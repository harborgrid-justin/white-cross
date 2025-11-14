import { Body, Controller, Get, Param, Post, Query, UseGuards, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { NotificationService } from '../services/notification.service';
import { SendNotificationDto } from '../dto';

import { BaseController } from '@/common/base';
/**
 * Notification Controller
 * Handles push notification operations
 */
@ApiTags('mobile-notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)

@Controller('mobile/notifications')
export class NotificationController extends BaseController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @ApiOperation({ summary: 'Send push notification to users' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  async sendNotification(
    @CurrentUser('id') userId: string,
    @Body() dto: SendNotificationDto,
  ) {
    return this.notificationService.sendNotification(userId, dto);
  }

  @Post(':id/track')
  @ApiOperation({ summary: 'Track notification interaction' })
  @ApiResponse({ status: 200, description: 'Interaction tracked' })
  async trackInteraction(
    @Param('id') notificationId: string,
    @Body('action') action: 'CLICKED' | 'DISMISSED',
  ) {
    return this.notificationService.trackInteraction(notificationId, action);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get notification analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.notificationService.getAnalytics({
      start: new Date(startDate),
      end: new Date(endDate),
    });
  }
}
