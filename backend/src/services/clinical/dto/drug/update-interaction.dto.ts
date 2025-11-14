import { OmitType, PartialType } from '@nestjs/swagger';
import { AddInteractionDto } from './add-interaction.dto';

/**
 * Update Drug Interaction DTO
 * Used for updating existing drug interaction information
 * Omits drug1Id and drug2Id as they should not be changed
 */
export class UpdateInteractionDto extends PartialType(
  OmitType(AddInteractionDto, ['drug1Id', 'drug2Id'] as const),
) {}
