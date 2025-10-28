/**
 * Update Contact DTO
 * @description DTO for updating an existing contact
 */
import { PartialType } from '@nestjs/swagger';
import { CreateContactDto } from './create-contact.dto';
import { IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateContactDto extends PartialType(CreateContactDto) {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID who updates this contact'
  })
  @IsOptional()
  @IsUUID()
  updatedBy?: string;
}
