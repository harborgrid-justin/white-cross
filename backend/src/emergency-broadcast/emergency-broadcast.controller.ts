/**
 * LOC: EMERGENCY-BROADCAST-CONTROLLER-001
 * Emergency Broadcast System Controller
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmergencyBroadcastService } from './emergency-broadcast.service';
import { BaseController } from '@/common/base';
import {
  BroadcastStatusResponseDto,
  CancelBroadcastDto,
  CreateEmergencyBroadcastDto,
  EmergencyBroadcastResponseDto,
  EmergencyTemplatesResponseDto,
  RecordAcknowledgmentDto,
  SendBroadcastResponseDto,
  UpdateEmergencyBroadcastDto,
} from './dto';

@ApiTags('Emergency Broadcast')
@ApiBearerAuth()
@Controller('emergency-broadcast')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class EmergencyBroadcastController extends BaseController {
  private readonly logger = new Logger(EmergencyBroadcastController.name);

  constructor(
    private readonly emergencyBroadcastService: EmergencyBroadcastService,
  ) {}

  /**
   * Create a new emergency broadcast
   * POST /emergency-broadcast
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create emergency broadcast',
    description:
      'Creates a new emergency broadcast message for immediate or scheduled delivery',
  })
  @ApiBody({
    type: CreateEmergencyBroadcastDto,
    description: 'Emergency broadcast creation data',
  })
  @ApiResponse({
    status: 201,
    description: 'Emergency broadcast created successfully',
    type: EmergencyBroadcastResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data - validation error',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - emergency broadcast privileges required',
  })
  async createBroadcast(
    @Body() createDto: CreateEmergencyBroadcastDto,
  ): Promise<EmergencyBroadcastResponseDto> {
    this.logger.log('Creating emergency broadcast', {
      type: createDto.type,
      audience: createDto.audience,
    });
    return this.emergencyBroadcastService.createBroadcast(createDto);
  }

  /**
   * Update an existing emergency broadcast
   * PUT /emergency-broadcast/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update emergency broadcast',
    description: 'Updates an existing emergency broadcast before sending',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency broadcast UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({
    type: UpdateEmergencyBroadcastDto,
    description: 'Emergency broadcast update data',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency broadcast updated successfully',
    type: EmergencyBroadcastResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or broadcast already sent',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency broadcast not found',
  })
  async updateBroadcast(
    @Param('id') id: string,
    @Body() updateDto: UpdateEmergencyBroadcastDto,
  ): Promise<EmergencyBroadcastResponseDto> {
    this.logger.log('Updating emergency broadcast', { id });
    return this.emergencyBroadcastService.updateBroadcast(id, updateDto);
  }

  /**
   * Send an emergency broadcast
   * POST /emergency-broadcast/:id/send
   */
  @Post(':id/send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Send emergency broadcast',
    description: 'Immediately sends an emergency broadcast to all recipients',
  })
  @ApiParam({
    name: 'id',
    description: 'Emergency broadcast UUID',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Emergency broadcast sent successfully',
    type: SendBroadcastResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Broadcast already sent or invalid state',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - authentication required',
  })
  @ApiResponse({
    status: 404,
    description: 'Emergency broadcast not found',
  })
  async sendBroadcast(
    @Param('id') id: string,
  ): Promise<SendBroadcastResponseDto> {
    this.logger.log('Sending emergency broadcast', { id });
    return this.emergencyBroadcastService.sendBroadcast(id);
  }

  /**
   * Get broadcast status and delivery statistics
   * GET /emergency-broadcast/:id/status
   */
  @Get(':id/status')
  @HttpCode(HttpStatus.OK)
  async getBroadcastStatus(
    @Param('id') id: string,
  ): Promise<BroadcastStatusResponseDto> {
    this.logger.log('Getting broadcast status', { id });
    return this.emergencyBroadcastService.getBroadcastStatus(id);
  }

  /**
   * Cancel a pending broadcast
   * PUT /emergency-broadcast/:id/cancel
   */
  @Put(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancelBroadcast(
    @Param('id') id: string,
    @Body() cancelDto: CancelBroadcastDto,
  ): Promise<void> {
    this.logger.log('Cancelling emergency broadcast', {
      id,
      reason: cancelDto.reason,
    });
    return this.emergencyBroadcastService.cancelBroadcast(id, cancelDto.reason);
  }

  /**
   * Record acknowledgment from recipient
   * POST /emergency-broadcast/:id/acknowledge
   */
  @Post(':id/acknowledge')
  @HttpCode(HttpStatus.NO_CONTENT)
  async recordAcknowledgment(
    @Param('id') id: string,
    @Body() acknowledgmentDto: RecordAcknowledgmentDto,
  ): Promise<void> {
    this.logger.log('Recording acknowledgment', {
      id,
      recipientId: acknowledgmentDto.recipientId,
    });
    return this.emergencyBroadcastService.recordAcknowledgment(
      id,
      acknowledgmentDto.recipientId,
      acknowledgmentDto.acknowledgedAt || new Date(),
    );
  }

  /**
   * Get emergency broadcast templates
   * GET /emergency-broadcast/templates
   */
  @Get('templates')
  @HttpCode(HttpStatus.OK)
  async getTemplates(): Promise<EmergencyTemplatesResponseDto> {
    this.logger.log('Getting emergency broadcast templates');
    const templates = this.emergencyBroadcastService.getTemplates();
    return { templates };
  }
}
