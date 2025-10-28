import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommunicationService } from '../services/communication.service';
import { CreateMessageTemplateDto, UpdateMessageTemplateDto, CreateMessageDto, BroadcastMessageDto, EmergencyAlertDto } from '../dto';

@Controller('communication')
export class CommunicationController {
  constructor(private readonly communicationService: CommunicationService) {}

  @Post('templates')
  async createTemplate(@Body() dto: CreateMessageTemplateDto) {
    return this.communicationService.createMessageTemplate(dto);
  }

  @Get('templates')
  async getTemplates(@Query('type') type?: string, @Query('category') category?: string) {
    return [];
  }

  @Put('templates/:id')
  async updateTemplate(@Param('id') id: string, @Body() dto: UpdateMessageTemplateDto) {
    return { success: true };
  }

  @Delete('templates/:id')
  async deleteTemplate(@Param('id') id: string) {
    return { success: true };
  }

  @Post('messages')
  async sendMessage(@Body() dto: CreateMessageDto) {
    return this.communicationService.sendMessage(dto);
  }

  @Post('broadcast')
  async sendBroadcast(@Body() dto: BroadcastMessageDto) {
    return this.communicationService.sendBroadcastMessage(dto);
  }

  @Post('emergency-alert')
  async sendEmergencyAlert(@Body() dto: EmergencyAlertDto) {
    return this.communicationService.sendEmergencyAlert(dto);
  }

  @Get('messages')
  async getMessages(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
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
