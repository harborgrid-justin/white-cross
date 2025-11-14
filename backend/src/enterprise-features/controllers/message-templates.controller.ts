import { Body, Controller, Get, Param, Post, Version } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageTemplateLibraryService } from '../message-template-library.service';
import { CreateMessageTemplateDto, MessageTemplateResponseDto, RenderTemplateDto } from '../dto';

import { BaseController } from '@/common/base';
@ApiTags('Message Templates')

@Controller('enterprise-features/message-templates')
@ApiBearerAuth()
export class MessageTemplatesController extends BaseController {
  constructor(private readonly messageTemplateService: MessageTemplateLibraryService) {
    super();}

  @Post()
  @ApiOperation({ summary: 'Create message template' })
  @ApiResponse({
    status: 201,
    description: 'Template created',
    type: MessageTemplateResponseDto,
  })
  createTemplate(@Body() dto: CreateMessageTemplateDto) {
    return this.messageTemplateService.createMessageTemplate(
      dto.name,
      dto.category,
      dto.subject,
      dto.body,
      dto.variables,
      dto.language,
      dto.createdBy,
    );
  }

  @Post(':templateId/render')
  @ApiOperation({ summary: 'Render message template' })
  @ApiResponse({ status: 200, description: 'Template rendered' })
  renderTemplate(@Param('templateId') templateId: string, @Body() dto: RenderTemplateDto) {
    return this.messageTemplateService.renderMessageTemplate(templateId, dto.variables);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get templates by category' })
  @ApiResponse({
    status: 200,
    description: 'Templates retrieved',
    type: [MessageTemplateResponseDto],
  })
  getTemplatesByCategory(@Param('category') category: string) {
    return this.messageTemplateService.getMessageTemplatesByCategory(category);
  }
}