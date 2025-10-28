import {
  IsString,
  IsEnum,
  IsObject,
  IsBoolean,
  IsOptional,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum SISPlatform {
  POWERSCHOOL = 'POWERSCHOOL',
  INFINITE_CAMPUS = 'INFINITE_CAMPUS',
  SKYWARD = 'SKYWARD',
  AERIES = 'AERIES',
  SCHOOLOGY = 'SCHOOLOGY',
  CUSTOM = 'CUSTOM',
}

export enum SyncSchedule {
  REALTIME = 'REALTIME',
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MANUAL = 'MANUAL',
}

export enum ConflictResolutionStrategy {
  KEEP_LOCAL = 'KEEP_LOCAL',
  KEEP_SIS = 'KEEP_SIS',
  MANUAL = 'MANUAL',
  NEWEST_WINS = 'NEWEST_WINS',
}

export class SyncEntitiesDto {
  @ApiProperty({ description: 'Sync students' })
  @IsBoolean()
  students: boolean;

  @ApiProperty({ description: 'Sync demographics' })
  @IsBoolean()
  demographics: boolean;

  @ApiProperty({ description: 'Sync enrollment' })
  @IsBoolean()
  enrollment: boolean;

  @ApiProperty({ description: 'Sync attendance' })
  @IsBoolean()
  attendance: boolean;

  @ApiProperty({ description: 'Sync grades' })
  @IsBoolean()
  grades: boolean;

  @ApiProperty({ description: 'Sync schedules' })
  @IsBoolean()
  schedules: boolean;

  @ApiProperty({ description: 'Sync contacts' })
  @IsBoolean()
  contacts: boolean;
}

export class CreateSISConfigurationDto {
  @ApiProperty({ description: 'School ID' })
  @IsString()
  schoolId: string;

  @ApiProperty({ enum: SISPlatform, description: 'SIS platform' })
  @IsEnum(SISPlatform)
  platform: SISPlatform;

  @ApiProperty({ description: 'API URL' })
  @IsString()
  apiUrl: string;

  @ApiPropertyOptional({ description: 'API version' })
  @IsOptional()
  @IsString()
  apiVersion?: string;

  @ApiPropertyOptional({ description: 'API key' })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiPropertyOptional({ description: 'Client ID for OAuth' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Client secret for OAuth' })
  @IsOptional()
  @IsString()
  clientSecret?: string;

  @ApiProperty({
    enum: ['PULL', 'PUSH', 'BIDIRECTIONAL'],
    description: 'Sync direction',
  })
  @IsString()
  syncDirection: 'PULL' | 'PUSH' | 'BIDIRECTIONAL';

  @ApiProperty({ enum: SyncSchedule, description: 'Sync schedule' })
  @IsEnum(SyncSchedule)
  syncSchedule: SyncSchedule;

  @ApiProperty({ description: 'Field mappings' })
  @IsObject()
  fieldMappings: Record<string, string>;

  @ApiProperty({ description: 'Entities to sync' })
  @ValidateNested()
  @Type(() => SyncEntitiesDto)
  syncEntities: SyncEntitiesDto;

  @ApiProperty({ description: 'Auto-create students' })
  @IsBoolean()
  autoCreateStudents: boolean;

  @ApiProperty({ description: 'Update existing only' })
  @IsBoolean()
  updateExistingOnly: boolean;

  @ApiProperty({
    enum: ConflictResolutionStrategy,
    description: 'Conflict resolution strategy',
  })
  @IsEnum(ConflictResolutionStrategy)
  conflictResolution: ConflictResolutionStrategy;
}
