/**
 * Update Emergency Contact DTO
 * @description DTO for updating an existing emergency contact
 */
import { OmitType, PartialType } from '@nestjs/swagger';
import { ContactCreateEmergencyDto } from './create-emergency-contact.dto';

export class ContactUpdateEmergencyDto extends PartialType(
  OmitType(ContactCreateEmergencyDto, ['studentId'] as const),
) {}
