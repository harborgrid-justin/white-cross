/**
 * LOC: EDU-DOWN-COMMUNICATION-CTRL-008
 * File: /reuse/education/composites/downstream/communication-controller.ts
 *
 * Purpose: Communication REST Controller - Production-grade HTTP endpoints
 * Handles student communications, notifications, messaging, and announcements
 *
 * Upstream: CommunicationService, StudentCommunicationComposite
 * Downstream: REST API clients, Messaging systems, Notification services
 * Dependencies: NestJS 10.x, Swagger/OpenAPI, class-validator
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  ParseUUIDPipe,
  ParseIntPipe,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { CommunicationService } from './communication-service';

// Guard and Interceptor imports
// import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
// import { RolesGuard } from '@/common/guards/roles.guard';
// import { LoggingInterceptor } from '@/common/interceptors/logging.interceptor';
// import { Roles } from '@/common/decorators/roles.decorator';

/**
 * Communication Controller
 * Provides REST API endpoints for communication operations
 */
@ApiTags('Communication')
@Controller('api/v1/communication')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard, RolesGuard)
// @UseInterceptors(LoggingInterceptor)
export class CommunicationController {
  private readonly logger = new Logger(CommunicationController.name);

  constructor(private readonly communicationService: CommunicationService) {}

  /**
   * Get all messages
   */
  @Get('messages')
  @ApiOperation({
    summary: 'Get messages',
    description: 'Retrieve paginated list of messages',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'recipientId', required: false, type: String })
  @ApiOkResponse({
    description: 'Messages retrieved successfully',
  })
  async findMessages(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('recipientId') recipientId?: string,
  ) {
    return this.communicationService.findMessages({
      page,
      limit,
      recipientId,
    });
  }

  /**
   * Get message by ID
   */
  @Get('messages/:messageId')
  @ApiOperation({
    summary: 'Get message by ID',
    description: 'Retrieve a specific message',
  })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  @ApiOkResponse({ description: 'Message found' })
  @ApiNotFoundResponse({ description: 'Message not found' })
  async findMessage(@Param('messageId', ParseUUIDPipe) messageId: string) {
    return this.communicationService.findMessage(messageId);
  }

  /**
   * Send message
   */
  @Post('messages/send')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send message',
    description: 'Send a new message to student or group',
  })
  @ApiBody({
    description: 'Message data',
    schema: {
      properties: {
        senderId: { type: 'string' },
        recipientIds: { type: 'array', items: { type: 'string' } },
        subject: { type: 'string' },
        body: { type: 'string' },
        priority: { type: 'string', enum: ['low', 'normal', 'high'] },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Message sent successfully' })
  @ApiBadRequestResponse({ description: 'Invalid message data' })
  async sendMessage(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    messageData: any,
  ) {
    this.logger.log(`Sending message from ${messageData.senderId}`);
    return this.communicationService.sendMessage(messageData);
  }

  /**
   * Update message
   */
  @Put('messages/:messageId')
  @ApiOperation({
    summary: 'Update message',
    description: 'Update an existing message (draft only)',
  })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  @ApiOkResponse({ description: 'Message updated successfully' })
  async updateMessage(
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateMessageDto: any,
  ) {
    this.logger.log(`Updating message: ${messageId}`);
    return this.communicationService.updateMessage(messageId, updateMessageDto);
  }

  /**
   * Delete message
   */
  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete message',
    description: 'Delete a message',
  })
  @ApiParam({ name: 'messageId', description: 'Message UUID' })
  @ApiOkResponse({ description: 'Message deleted successfully' })
  async deleteMessage(@Param('messageId', ParseUUIDPipe) messageId: string) {
    this.logger.log(`Deleting message: ${messageId}`);
    return this.communicationService.deleteMessage(messageId);
  }

  /**
   * Get announcements
   */
  @Get('announcements')
  @ApiOperation({
    summary: 'Get announcements',
    description: 'Retrieve paginated list of announcements',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiOkResponse({
    description: 'Announcements retrieved successfully',
  })
  async findAnnouncements(
    @Query('page', new ParseIntPipe({ optional: true })) page: number = 1,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number = 20,
    @Query('category') category?: string,
  ) {
    return this.communicationService.findAnnouncements({
      page,
      limit,
      category,
    });
  }

  /**
   * Create announcement
   */
  @Post('announcements')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create announcement',
    description: 'Create a new announcement',
  })
  @ApiBody({
    description: 'Announcement data',
    schema: {
      properties: {
        title: { type: 'string' },
        body: { type: 'string' },
        category: { type: 'string' },
        targetAudience: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Announcement created successfully' })
  async createAnnouncement(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    announcementData: any,
  ) {
    this.logger.log(`Creating announcement: ${announcementData.title}`);
    return this.communicationService.createAnnouncement(announcementData);
  }

  /**
   * Update announcement
   */
  @Put('announcements/:announcementId')
  @ApiOperation({
    summary: 'Update announcement',
    description: 'Update an existing announcement',
  })
  @ApiParam({ name: 'announcementId', description: 'Announcement UUID' })
  @ApiOkResponse({ description: 'Announcement updated successfully' })
  async updateAnnouncement(
    @Param('announcementId', ParseUUIDPipe) announcementId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    updateAnnouncementDto: any,
  ) {
    this.logger.log(`Updating announcement: ${announcementId}`);
    return this.communicationService.updateAnnouncement(announcementId, updateAnnouncementDto);
  }

  /**
   * Delete announcement
   */
  @Delete('announcements/:announcementId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete announcement',
    description: 'Delete an announcement',
  })
  @ApiParam({ name: 'announcementId', description: 'Announcement UUID' })
  @ApiOkResponse({ description: 'Announcement deleted successfully' })
  async deleteAnnouncement(@Param('announcementId', ParseUUIDPipe) announcementId: string) {
    this.logger.log(`Deleting announcement: ${announcementId}`);
    return this.communicationService.deleteAnnouncement(announcementId);
  }

  /**
   * Publish announcement
   */
  @Patch('announcements/:announcementId/publish')
  @ApiOperation({
    summary: 'Publish announcement',
    description: 'Publish announcement to target audience',
  })
  @ApiParam({ name: 'announcementId', description: 'Announcement UUID' })
  @ApiOkResponse({ description: 'Announcement published successfully' })
  async publishAnnouncement(@Param('announcementId', ParseUUIDPipe) announcementId: string) {
    return this.communicationService.publishAnnouncement(announcementId);
  }

  /**
   * Get user notifications
   */
  @Get('notifications')
  @ApiOperation({
    summary: 'Get notifications',
    description: 'Retrieve user notifications',
  })
  @ApiQuery({ name: 'unread', required: false, type: Boolean })
  @ApiOkResponse({
    description: 'Notifications retrieved successfully',
  })
  async getNotifications(
    @Query('unread') unread?: boolean,
  ) {
    return this.communicationService.getNotifications({ unread });
  }

  /**
   * Mark notification as read
   */
  @Patch('notifications/:notificationId/read')
  @ApiOperation({
    summary: 'Mark as read',
    description: 'Mark notification as read',
  })
  @ApiParam({ name: 'notificationId', description: 'Notification UUID' })
  @ApiOkResponse({ description: 'Notification marked as read' })
  async markAsRead(@Param('notificationId', ParseUUIDPipe) notificationId: string) {
    return this.communicationService.markAsRead(notificationId);
  }

  /**
   * Get email templates
   */
  @Get('email-templates')
  @ApiOperation({
    summary: 'Get email templates',
    description: 'Retrieve email templates',
  })
  @ApiOkResponse({
    description: 'Email templates retrieved',
  })
  async getEmailTemplates() {
    return this.communicationService.getEmailTemplates();
  }

  /**
   * Create email template
   */
  @Post('email-templates')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create email template',
    description: 'Create a new email template',
  })
  @ApiBody({
    description: 'Template data',
    schema: {
      properties: {
        name: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string' },
        category: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Template created successfully' })
  async createEmailTemplate(@Body() templateData: any) {
    return this.communicationService.createEmailTemplate(templateData);
  }

  /**
   * Send bulk notification
   */
  @Post('bulk-notification')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Send bulk notification',
    description: 'Send notification to multiple recipients',
  })
  @ApiBody({
    description: 'Bulk notification data',
    schema: {
      properties: {
        recipientIds: { type: 'array' },
        subject: { type: 'string' },
        body: { type: 'string' },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Bulk notification started' })
  async sendBulkNotification(@Body() bulkData: any) {
    this.logger.log(`Sending bulk notification to ${bulkData.recipientIds.length} recipients`);
    return this.communicationService.sendBulkNotification(bulkData);
  }

  /**
   * Get notification preferences
   */
  @Get('preferences/:userId')
  @ApiOperation({
    summary: 'Get notification preferences',
    description: 'Retrieve user notification preferences',
  })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiOkResponse({ description: 'Preferences retrieved' })
  async getPreferences(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.communicationService.getPreferences(userId);
  }

  /**
   * Update notification preferences
   */
  @Put('preferences/:userId')
  @ApiOperation({
    summary: 'Update notification preferences',
    description: 'Update user notification preferences',
  })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiOkResponse({ description: 'Preferences updated' })
  async updatePreferences(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() preferences: any,
  ) {
    return this.communicationService.updatePreferences(userId, preferences);
  }
}
