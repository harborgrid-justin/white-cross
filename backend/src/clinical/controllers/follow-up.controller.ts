import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FollowUpService } from '../services/follow-up.service';
import { ScheduleFollowUpDto } from '../dto/follow-up/schedule-follow-up.dto';
import { UpdateFollowUpDto } from '../dto/follow-up/update-follow-up.dto';
import { CompleteFollowUpDto } from '../dto/follow-up/complete-follow-up.dto';
import { FollowUpFiltersDto } from '../dto/follow-up/follow-up-filters.dto';

@ApiTags('Clinical - Follow-up Appointments')
@ApiBearerAuth()
@Controller('clinical/follow-ups')
export class FollowUpController {
  constructor(private readonly followUpService: FollowUpService) {}

  @Post()
  @ApiOperation({ summary: 'Schedule follow-up appointment' })
  async schedule(@Body() scheduleDto: ScheduleFollowUpDto) {
    return this.followUpService.schedule(scheduleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Query follow-up appointments' })
  async findAll(@Query() filters: FollowUpFiltersDto) {
    return this.followUpService.findAll(filters);
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get pending follow-ups' })
  async findPending() {
    return this.followUpService.findPending();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get follow-ups for a student' })
  async findByStudent(@Param('studentId') studentId: string) {
    return this.followUpService.findByStudent(studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get follow-up by ID' })
  async findOne(@Param('id') id: string) {
    return this.followUpService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update follow-up' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateFollowUpDto) {
    return this.followUpService.update(id, updateDto);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm follow-up' })
  async confirm(@Param('id') id: string) {
    return this.followUpService.confirm(id);
  }

  @Post(':id/complete')
  @ApiOperation({ summary: 'Complete follow-up' })
  async complete(
    @Param('id') id: string,
    @Body() completeDto: CompleteFollowUpDto,
  ) {
    return this.followUpService.complete(id, completeDto);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel follow-up' })
  async cancel(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.followUpService.cancel(id, body.reason);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete follow-up' })
  async remove(@Param('id') id: string) {
    await this.followUpService.remove(id);
  }
}
