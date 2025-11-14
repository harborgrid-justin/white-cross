/**
 * Import Health Records DTO
 * Defines the structure for importing health records data
 */

import { IsArray, IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HealthRecordCreateDto } from './create-health-record.dto';

export class ImportHealthRecordsDto {
  /**
   * Array of health records to import
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HealthRecordCreateDto)
  healthRecords: HealthRecordCreateDto[];

  /**
   * Optional metadata for the import operation
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
