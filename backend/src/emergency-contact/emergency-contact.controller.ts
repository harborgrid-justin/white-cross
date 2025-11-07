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
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergencyContactService } from './emergency-contact.service';
import {
  EmergencyContactCreateDto,
  EmergencyContactUpdateDto,
  EmergencyVerifyContactDto,
  NotificationDto,
} from './dto';

@ApiTags('Emergency Contacts')
@ApiBearerAuth()
@Controller('emergency-contact')
export class EmergencyContactController {
  constructor(
    private readonly emergencyContactService: EmergencyContactService,
  ) {}

  /**
   * Get all emergency contacts for a student
   * GET /emergency-contact/student/:studentId
   */
  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get student emergency contacts',
    description:
      'Retrieves all active emergency contacts for a specific student, ordered by priority',
  })
  @ApiParam({
    name: 'studentId',
    description: 'Student UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency contacts retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          studentId: { type: 'string', format: 'uuid' },
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          relationship: { type: 'string', example: 'Mother' },
          phoneNumber: { type: 'string', example: '+1-555-123-4567' },
          email: { type: 'string', example: 'jane.doe@example.com' },
          priority: {
            type: 'string',
            enum: ['PRIMARY', 'SECONDARY', 'EMERGENCY_ONLY'],
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getStudentEmergencyContacts(
    @Param('studentId', ParseUUIDPipe) studentId: string,
  ) {
    return this.emergencyContactService.getStudentEmergencyContacts(studentId);
  }

  /**
   * Get emergency contact by ID
   * GET /emergency-contact/:id
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get emergency contact by ID',
    description: 'Retrieves a single emergency contact record by UUID',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency Contact UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency contact retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid UUID format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency contact not found',
  })
  async getEmergencyContactById(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyContactService.getEmergencyContactById(id);
  }

  /**
   * Create new emergency contact
   * POST /emergency-contact
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create emergency contact',
    description:
      'Creates a new emergency contact with validation and primary contact enforcement',
  })
  @ApiResponse({
    status: 201,
    description: 'Emergency contact created successfully',
  })
  @ApiResponse({
    status: 400,
    description:
      'Invalid input data - validation errors or business rule violations',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createEmergencyContact(
    @Body() createEmergencyContactDto: EmergencyContactCreateDto,
  ) {
    return this.emergencyContactService.createEmergencyContact(
      createEmergencyContactDto,
    );
  }

  /**
   * Update emergency contact
   * PATCH /emergency-contact/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Update emergency contact',
    description:
      'Updates an existing emergency contact with validation and business rule enforcement',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency Contact UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency contact updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or business rule violation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency contact not found',
  })
  async updateEmergencyContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmergencyContactDto: EmergencyContactUpdateDto,
  ) {
    return this.emergencyContactService.updateEmergencyContact(
      id,
      updateEmergencyContactDto,
    );
  }

  /**
   * Delete emergency contact (soft delete)
   * DELETE /emergency-contact/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete emergency contact',
    description:
      'Soft deletes an emergency contact (marks as inactive). Cannot delete the only active primary contact.',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency Contact UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency contact deleted successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete - business rule violation',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency contact not found',
  })
  async deleteEmergencyContact(@Param('id', ParseUUIDPipe) id: string) {
    return this.emergencyContactService.deleteEmergencyContact(id);
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
