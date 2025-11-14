/**
 * @fileoverview Update Allergy DTO
 * @module health-record/allergy/dto
 * @description Data Transfer Object for updating allergy records
 * All fields are optional for partial updates
 */

import { PartialType } from '@nestjs/swagger';
import { HealthRecordCreateAllergyDto } from './create-allergy.dto';

/**
 * Update Allergy DTO
 *
 * Extends HealthRecordCreateAllergyDto with all fields optional.
 * This allows partial updates to allergy records.
 *
 * @example
 * ```typescript
 * const updateDto: UpdateAllergyDto = {
 *   severity: AllergySeverity.LIFE_THREATENING,
 *   notes: 'Updated after recent severe reaction'
 * };
 * ```
 */
export class UpdateAllergyDto extends PartialType(HealthRecordCreateAllergyDto) {}
