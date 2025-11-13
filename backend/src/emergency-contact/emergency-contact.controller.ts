/**
 * Emergency Contact Controller
 *
 * REST API endpoints for emergency contact management.
 * Provides CRUD operations, notification sending, contact verification, and statistics.
 *
 * @controller EmergencyContactController
 * @route /emergency-contact
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { EmergencyContactService } from './emergency-contact.service';
import { EmergencyContactCreateDto } from './dto/create-emergency-contact.dto';
import { EmergencyContactUpdateDto } from './dto/update-emergency-contact.dto';
import { EmergencyVerifyContactDto } from './dto/verify-contact.dto';
import { NotificationDto } from './dto/notification.dto';
import { BaseController } from '../../common/base';
import { 
  ControllerUtilities, 
  ApiTagsAndAuth,
  ApiResponseWrapper 
} from '../common/shared/controller-utilities';

@ApiTagsAndAuth(['Emergency Contacts'])
@Controller('emergency-contact')
export class EmergencyContactController extends BaseController {
  private readonly logger = ControllerUtilities.createControllerLogger('EmergencyContactController');

  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  /**
   * Get all emergency contacts for a student
   * GET /emergency-contact/student/:studentId
   */
  @Get('student/:studentId')
  async getStudentEmergencyContacts(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<any[]>> {
    return await ControllerUtilities.executeEndpoint(
      () => this.emergencyContactService.getStudentEmergencyContacts(studentId),
      this.logger,
      'get student emergency contacts',
      req,
    );
  }

  /**
   * Get emergency contact by ID
   * GET /emergency-contact/:id
   */
  @Get(':id')
  async getEmergencyContactById(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<any>> {
    ControllerUtilities.validateUuidParam(id);
    return await ControllerUtilities.executeEndpoint(
      () => this.emergencyContactService.getEmergencyContactById(id),
      this.logger,
      'get emergency contact by ID',
      req,
    );
  }

  /**
   * Create new emergency contact
   * POST /emergency-contact
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createEmergencyContact(
    @Body() createEmergencyContactDto: EmergencyContactCreateDto,
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<any>> {
    return await ControllerUtilities.executeEndpoint(
      () => this.emergencyContactService.createEmergencyContact(createEmergencyContactDto),
      this.logger,
      'create emergency contact',
      req,
    );
  }

  /**
   * Update emergency contact
   * PATCH /emergency-contact/:id
   */
  @Patch(':id')
  async updateEmergencyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmergencyContactDto: EmergencyContactUpdateDto,
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<any>> {
    ControllerUtilities.validateUuidParam(id);
    return await ControllerUtilities.executeEndpoint(
      () => this.emergencyContactService.updateEmergencyContact(id, updateEmergencyContactDto),
      this.logger,
      'update emergency contact',
      req,
    );
  }

  /**
   * Delete emergency contact (soft delete)
   * DELETE /emergency-contact/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteEmergencyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<ApiResponseWrapper<any>> {
    ControllerUtilities.validateUuidParam(id);
    return await ControllerUtilities.executeEndpoint(
      () => this.emergencyContactService.deleteEmergencyContact(id),
      this.logger,
      'delete emergency contact',
      req,
    );
  }

  /**
   * Send emergency notification to all student contacts
   * POST /emergency-contact/notification/student/:studentId
   */
  @Post('notification/student/:studentId')
  @ApiOperation({
    summary: 'Send emergency notification to all contacts',
    description:
      'Sends emergency notification to all active contacts for a student via specified channels',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          contactId: { type: 'string', format: 'uuid' },
          contact: {
            type: 'object',
            properties: {
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              phoneNumber: { type: 'string' },
              email: { type: 'string' },
            },
          },
          channels: {
            type: 'object',
            properties: {
              sms: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  messageId: { type: 'string' },
                },
              },
              email: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  messageId: { type: 'string' },
                },
              },
              voice: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  callId: { type: 'string' },
                },
              },
            },
          },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found or no emergency contacts',
  })
  async sendEmergencyNotification(
    @Param('studentId', ParseUUIDPipe) studentId: string,
    @Body() notificationDto: NotificationDto,
  ) {
    return this.emergencyContactService.sendEmergencyNotification(
      studentId,
      notificationDto,
    );
  }

  /**
   * Send notification to specific contact
   * POST /emergency-contact/notification/contact/:contactId
   */
  @Post('notification/contact/:contactId')
  @ApiOperation({
    summary: 'Send notification to specific contact',
    description:
      'Sends notification to a specific emergency contact via specified channels',
  })
  @ApiParam({
    name: 'contactId',
    description: 'Emergency Contact UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification sent successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Contact is not active',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency contact not found',
  })
  async sendContactNotification(
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() notificationDto: NotificationDto,
  ) {
    return this.emergencyContactService.sendContactNotification(
      contactId,
      notificationDto,
    );
  }

  /**
   * Verify emergency contact
   * POST /emergency-contact/:id/verify
   */
  @Post(':id/verify')
  @ApiOperation({
    summary: 'Verify emergency contact',
    description:
      'Sends verification code to emergency contact via specified method (SMS, email, or voice)',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency Contact UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Verification code sent successfully',
    schema: {
      type: 'object',
      properties: {
        verificationCode: {
          type: 'string',
          example: '123456',
          description:
            'For testing only - should not be returned in production',
        },
        method: { type: 'string', enum: ['sms', 'email', 'voice'] },
        messageId: { type: 'string', example: 'sms_1234567890' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid verification method or contact information missing',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency contact not found',
  })
  async verifyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() verifyContactDto: EmergencyVerifyContactDto,
  ) {
    return this.emergencyContactService.verifyContact(
      id,
      verifyContactDto.verificationMethod,
    );
  }

  /**
   * Get emergency contact statistics
   * GET /emergency-contact/statistics/all
   */
  @Get('statistics/all')
  @ApiOperation({
    summary: 'Get emergency contact statistics',
    description:
      'Retrieves aggregated statistics about emergency contacts (counts by priority, students without contacts)',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalContacts: { type: 'number', example: 450 },
        studentsWithoutContacts: { type: 'number', example: 12 },
        byPriority: {
          type: 'object',
          properties: {
            PRIMARY: { type: 'number', example: 300 },
            SECONDARY: { type: 'number', example: 120 },
            EMERGENCY_ONLY: { type: 'number', example: 30 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getContactStatistics() {
    return this.emergencyContactService.getContactStatistics();
  }
}
