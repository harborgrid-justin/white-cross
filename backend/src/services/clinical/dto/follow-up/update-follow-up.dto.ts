import { PartialType } from '@nestjs/swagger';
import { ScheduleFollowUpDto } from './schedule-follow-up.dto';

/**
 * DTO for updating a follow-up appointment
 * All fields are optional for partial updates
 */
export class UpdateFollowUpDto extends PartialType(ScheduleFollowUpDto) {}
