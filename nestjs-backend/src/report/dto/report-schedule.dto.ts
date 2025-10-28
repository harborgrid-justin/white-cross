import {
  IsEnum,
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType, OutputFormat, ScheduleFrequency } from '../constants/report.constants';

/**
 * DTO for creating/updating report schedules
 */
export class ReportScheduleDto {
  @ApiProperty({
    description: 'Name of the scheduled report',
  })
  @IsString()
  name: string;

  @ApiProperty({
    enum: ReportType,
    description: 'Type of report to generate',
  })
  @IsEnum(ReportType)
  reportType: ReportType;

  @ApiProperty({
    enum: ScheduleFrequency,
    description: 'Schedule frequency',
  })
  @IsEnum(ScheduleFrequency)
  frequency: ScheduleFrequency;

  @ApiPropertyOptional({
    description: 'Custom cron expression (required if frequency is CUSTOM)',
  })
  @ValidateIf((o) => o.frequency === ScheduleFrequency.CUSTOM)
  @IsString()
  cronExpression?: string;

  @ApiProperty({
    enum: OutputFormat,
    description: 'Output format for generated reports',
    default: OutputFormat.PDF,
  })
  @IsEnum(OutputFormat)
  outputFormat: OutputFormat = OutputFormat.PDF;

  @ApiProperty({
    type: [String],
    description: 'Email addresses to send reports to',
  })
  @IsArray()
  @IsEmail({}, { each: true })
  recipients: string[];

  @ApiPropertyOptional({
    description: 'Report parameters as JSON',
  })
  @IsOptional()
  parameters?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether the schedule is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
