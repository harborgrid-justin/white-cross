/**
 * @fileoverview Update Health Record DTO
 * @module health-record/dto/update-health-record.dto
 * @description DTO for updating existing health records
 */

import { PartialType } from '@nestjs/swagger';
import { CreateHealthRecordDto } from './create-health-record.dto';

/**
 * Update Health Record DTO
 *
 * Extends CreateHealthRecordDto with all fields optional
 * Uses NestJS PartialType utility for DRY principle
 */
export class UpdateHealthRecordDto extends PartialType(CreateHealthRecordDto) {}
