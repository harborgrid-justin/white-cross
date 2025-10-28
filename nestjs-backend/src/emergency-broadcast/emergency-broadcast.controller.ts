/**
 * LOC: EMERGENCY-BROADCAST-CONTROLLER-001
 * Emergency Broadcast System Controller
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  Logger,
} from '@nestjs/common';
import { EmergencyBroadcastService } from './emergency-broadcast.service';
import {
  CreateEmergencyBroadcastDto,
  UpdateEmergencyBroadcastDto,
  EmergencyBroadcastResponseDto,
  SendBroadcastResponseDto,
  BroadcastStatusResponseDto,
  CancelBroadcastDto,
  RecordAcknowledgmentDto,
  EmergencyTemplatesResponseDto,
} from './dto';

@Controller('emergency-broadcast')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class EmergencyBroadcastController {
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
