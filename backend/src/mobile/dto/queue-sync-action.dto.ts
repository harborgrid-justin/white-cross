import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsObject,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SyncActionType, SyncEntityType, SyncPriority } from '../enums';

/**
 * DTO for queueing a sync action
 */
export class QueueSyncActionDto {
  @ApiProperty({ description: 'Device identifier' })
  @IsString()
  @IsNotEmpty()
  deviceId!: string;

  @ApiProperty({
    description: 'Sync action type',
    enum: SyncActionType,
  })
  @IsEnum(SyncActionType)
  actionType!: SyncActionType;

  @ApiProperty({
    description: 'Entity type being synced',
    enum: SyncEntityType,
  })
  @IsEnum(SyncEntityType)
  entityType!: SyncEntityType;

  @ApiProperty({ description: 'Entity identifier' })
  @IsString()
  @IsNotEmpty()
  entityId!: string;

  @ApiProperty({ description: 'Entity data' })
  @IsObject()
  data: any;

  @ApiProperty({
    description: 'Sync priority',
    enum: SyncPriority,
    required: false,
    default: SyncPriority.NORMAL,
  })
  @IsEnum(SyncPriority)
  @IsOptional()
  priority?: SyncPriority;
}
