import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddToWaitlistDto {
  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'Type of appointment requested' })
  @IsString()
  appointmentType: string;

  @ApiProperty({ enum: ['routine', 'urgent'], description: 'Priority level' })
  @IsEnum(['routine', 'urgent'])
  priority: 'routine' | 'urgent';

  @ApiPropertyOptional({ description: 'Requested appointment date' })
  @IsOptional()
  @IsDateString()
  requestedDate?: string;
}

export class AutoFillFromWaitlistDto {
  @ApiProperty({ description: 'Available appointment slot' })
  @IsDateString()
  appointmentSlot: string;

  @ApiProperty({ description: 'Type of appointment' })
  @IsString()
  appointmentType: string;
}

export class WaitlistEntryResponseDto {
  id: string;
  studentId: string;
  appointmentType: string;
  priority: 'routine' | 'urgent';
  requestedDate?: Date;
  addedAt: Date;
  status: 'waiting' | 'contacted' | 'scheduled' | 'cancelled';
}
