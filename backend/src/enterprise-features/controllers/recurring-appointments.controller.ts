import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecurringAppointmentsService } from '../recurring-appointments.service';
import { CreateRecurringTemplateDto, RecurringTemplateResponseDto } from '../dto';

import { BaseController } from '../../common/base';
@ApiTags('Recurring Appointments')
@Controller('enterprise-features/recurring-appointments')
@ApiBearerAuth()
export class RecurringAppointmentsController extends BaseController {
  constructor(
    private readonly recurringAppointmentsService: RecurringAppointmentsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create recurring appointment template' })
  @ApiResponse({
    status: 201,
    description: 'Recurring template created',
    type: RecurringTemplateResponseDto,
  })
  createRecurringTemplate(@Body() dto: CreateRecurringTemplateDto) {
    return this.recurringAppointmentsService.createRecurringTemplate({
      studentId: dto.studentId,
      appointmentType: dto.appointmentType,
      frequency: dto.frequency,
      dayOfWeek: dto.dayOfWeek,
      timeOfDay: dto.timeOfDay,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdBy: dto.createdBy,
    });
  }

  @Delete(':templateId')
  @ApiOperation({ summary: 'Cancel recurring appointment series' })
  @ApiResponse({
    status: 200,
    description: 'Recurring series cancelled successfully',
  })
  @HttpCode(HttpStatus.OK)
  cancelRecurringSeries(@Param('templateId') templateId: string) {
    return this.recurringAppointmentsService.cancelRecurringSeries(
      templateId,
      'system',
      'API cancellation',
    );
  }
}