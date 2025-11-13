import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BulkMessagingService } from '../bulk-messaging.service';
import { BulkMessageResponseDto, SendBulkMessageDto } from '../dto';

import { BaseController } from '../../../common/base';
@ApiTags('Bulk Messaging')
@Controller('enterprise-features/bulk-messages')
@ApiBearerAuth()
export class BulkMessagingController extends BaseController {
  constructor(private readonly bulkMessagingService: BulkMessagingService) {}

  @Post()
  @ApiOperation({ summary: 'Send bulk message' })
  @ApiResponse({
    status: 201,
    description: 'Bulk message sent',
    type: BulkMessageResponseDto,
  })
  sendBulkMessage(@Body() dto: SendBulkMessageDto) {
    return this.bulkMessagingService.sendBulkMessage(
      dto.subject,
      dto.body,
      dto.recipients,
      dto.channels,
    );
  }

  @Get(':messageId/tracking')
  @ApiOperation({ summary: 'Track bulk message delivery' })
  @ApiResponse({ status: 200, description: 'Delivery stats retrieved' })
  trackDelivery(@Param('messageId') messageId: string) {
    return this.bulkMessagingService.getDeliveryStats(messageId);
  }
}