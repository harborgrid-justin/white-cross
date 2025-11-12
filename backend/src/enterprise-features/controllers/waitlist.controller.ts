import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WaitlistManagementService } from '../waitlist-management.service';
import { AddToWaitlistDto, AutoFillFromWaitlistDto, WaitlistEntryResponseDto } from '../dto';

@ApiTags('Waitlist Management')
@Controller('enterprise-features/waitlist')
@ApiBearerAuth()
export class WaitlistController {
  constructor(
    private readonly waitlistService: WaitlistManagementService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Add student to waitlist',
    description:
      'Adds a student to the intelligent waitlist system with priority scoring based on medical urgency and appointment type.',
  })
  @ApiBody({ type: AddToWaitlistDto })
  @ApiResponse({
    status: 201,
    description: 'Student added to waitlist successfully',
    type: WaitlistEntryResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  async addToWaitlist(@Body() dto: AddToWaitlistDto) {
    return this.waitlistService.addToWaitlist(
      dto.studentId,
      dto.appointmentType,
      dto.priority,
    );
  }

  @Post('auto-fill')
  @ApiOperation({ summary: 'Auto-fill appointment from waitlist' })
  @ApiResponse({
    status: 200,
    description: 'Appointment auto-filled from waitlist',
  })
  async autoFillFromWaitlist(@Body() dto: AutoFillFromWaitlistDto) {
    return this.waitlistService.autoFillFromWaitlist(
      new Date(dto.appointmentSlot),
      dto.appointmentType,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get waitlist by priority' })
  @ApiResponse({
    status: 200,
    description: 'Waitlist retrieved by priority',
    type: [WaitlistEntryResponseDto],
  })
  async getWaitlistByPriority() {
    return this.waitlistService.getWaitlistByPriority();
  }

  @Get(':studentId')
  @ApiOperation({ summary: 'Get waitlist status for student' })
  @ApiResponse({ status: 200, description: 'Waitlist status retrieved' })
  async getWaitlistStatus(@Param('studentId') studentId: string) {
    return this.waitlistService.getWaitlistStatus(studentId);
  }
}