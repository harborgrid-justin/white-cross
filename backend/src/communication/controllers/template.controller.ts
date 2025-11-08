import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Req } from '@nestjs/common';
import { AuthenticatedRequest } from '../types/index';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TemplateService } from '../services/template.service';
import { CreateTemplateDto, UpdateTemplateDto } from '../dto/create-template.dto';

@ApiTags('Message Templates')
@ApiBearerAuth()
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({
    summary: 'Create message template',
    description: 'Create a reusable message template with variables',
  })
  @ApiBody({ type: CreateTemplateDto })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
    schema: {
      example: {
        template: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Appointment Reminder',
          subject: 'Appointment for {{studentName}}',
          content: 'Dear {{parentName}}, reminder for {{studentName}}...',
          type: 'EMAIL',
          category: 'APPOINTMENT_REMINDER',
          variables: ['studentName', 'parentName', 'date', 'time'],
          isActive: true,
          createdAt: '2025-10-28T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid template data' })
  async createTemplate(@Body() dto: CreateTemplateDto, @Req() req: AuthenticatedRequest) {
    const createdById = req.user?.id;
    return this.templateService.createTemplate({ ...dto, createdById });
  }

  @Get()
  @ApiOperation({
    summary: 'List message templates',
    description: 'Get filtered list of message templates',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['EMAIL', 'SMS', 'PUSH_NOTIFICATION', 'VOICE'],
  })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, example: true })
  @ApiResponse({
    status: 200,
    description: 'Templates retrieved successfully',
    schema: {
      example: {
        templates: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Appointment Reminder',
            type: 'EMAIL',
            category: 'APPOINTMENT_REMINDER',
            isActive: true,
          },
        ],
      },
    },
  })
  async listTemplates(
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ) {
    return this.templateService.getTemplates(type, category, isActive);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get template by ID',
    description: 'Retrieve detailed information about a template',
  })
  @ApiParam({ name: 'id', description: 'Template ID (UUID)' })
  @ApiResponse({
    status: 200,
    description: 'Template retrieved successfully',
    schema: {
      example: {
        template: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Appointment Reminder',
          subject: 'Appointment for {{studentName}}',
          content: 'Full template content...',
          type: 'EMAIL',
          category: 'APPOINTMENT_REMINDER',
          variables: ['studentName', 'parentName', 'date', 'time'],
          isActive: true,
          createdBy: {
            id: '456e7890-e89b-12d3-a456-426614174000',
            firstName: 'John',
            lastName: 'Doe',
          },
          createdAt: '2025-10-28T10:00:00Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async getTemplateById(@Param('id') id: string) {
    return this.templateService.getTemplateById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update message template',
    description: 'Update an existing message template',
  })
  @ApiParam({ name: 'id', description: 'Template ID (UUID)' })
  @ApiBody({ type: UpdateTemplateDto })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async updateTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateDto,
  ) {
    return this.templateService.updateTemplate(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete message template',
    description: 'Permanently delete a message template',
  })
  @ApiParam({ name: 'id', description: 'Template ID (UUID)' })
  @ApiResponse({
    status: 204,
    description: 'Template deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Template not found' })
  async deleteTemplate(@Param('id') id: string) {
    await this.templateService.deleteTemplate(id);
  }
}
