/**
 * @fileoverview Base Queue Job DTO
 * @module infrastructure/queue/dtos/base
 * @description Base class for all queue job DTOs with common validation
 */

import { IsDateString, IsObject, IsOptional, IsString } from 'class-validator';
import { BaseQueueJob } from '../../interfaces';

/**
 * Base DTO class for all queue jobs
 * Provides common fields with validation decorators
 */
export abstract class BaseQueueJobDto implements BaseQueueJob {
  /**
   * Job creation timestamp
   */
  @IsDateString()
  createdAt: Date;

  /**
   * User who initiated the job
   */
  @IsString()
  @IsOptional()
  initiatedBy?: string;

  /**
   * Job identifier
   */
  @IsString()
  @IsOptional()
  jobId?: string;

  /**
   * Additional metadata
   */
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
