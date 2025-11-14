import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for signing a clinical note
 */
export class SignNoteDto {
  @ApiProperty({
    description: 'Signature timestamp',
    example: '2025-10-28T10:00:00Z',
  })
  @Type(() => Date)
  @IsDate()
  signedAt: Date;
}
