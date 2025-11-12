import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReminderSchedulerService } from '../reminder-scheduler.service';
import { CustomizeReminderPreferencesDto, ReminderScheduleResponseDto, ScheduleRemindersDto } from '../dto';

@ApiTags('Appointment Reminders')
@Controller('enterprise-features/reminders')
@ApiBearerAuth()
export class RemindersController {
  constructor(
    private readonly reminderService: ReminderSchedulerService,
  ) {}

  @Post('schedule')
  @ApiOperation({ summary: 'Schedule reminders for appointment' })
  @ApiResponse({
    status: 201,
    description: 'Reminders scheduled',
    type: ReminderScheduleResponseDto,
  })
  scheduleReminders(@Body() dto: ScheduleRemindersDto) {
    return this.reminderService.scheduleReminders(dto.appointmentId);
  }

  @Post('send-due')
  @ApiOperation({ summary: 'Send all due reminders' })
  @ApiResponse({ status: 200, description: 'Due reminders sent' })
  sendDueReminders() {
    return this.reminderService.sendDueReminders();
  }

  @Put('preferences/:studentId')
  @ApiOperation({ summary: 'Customize reminder preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated' })
  customizeReminderPreferences(
    @Param('studentId') studentId: string,
    @Body() dto: CustomizeReminderPreferencesDto,
  ) {
    return this.reminderService.updatePreferences(studentId, dto.preferences);
  }
}