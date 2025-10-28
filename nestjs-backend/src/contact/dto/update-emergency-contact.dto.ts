/**
 * Update Emergency Contact DTO
 * @description DTO for updating an existing emergency contact
 */
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateEmergencyContactDto } from './create-emergency-contact.dto';

export class UpdateEmergencyContactDto extends PartialType(
  OmitType(CreateEmergencyContactDto, ['studentId'] as const)
) {}
