/**
 * Data Transfer Object for allergy verification
 */
import { IsNotEmpty, IsUUID } from 'class-validator';

export class VerifyAllergyDto {
  /**
   * User ID of healthcare professional performing verification
   */
  @IsUUID()
  @IsNotEmpty()
  verifiedBy: string;
}
