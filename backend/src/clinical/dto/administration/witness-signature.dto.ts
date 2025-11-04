import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Request Witness Signature DTO
 * Used to request witness verification for controlled substance administration
 */
export class RequestWitnessSignatureDto {
  @ApiProperty({
    description: 'User ID of the witness',
    example: 'aa0e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  witnessId: string;
}

/**
 * Submit Witness Signature DTO
 * Used to submit witness signature after witnessing administration
 */
export class SubmitWitnessSignatureDto {
  @ApiProperty({
    description: 'Digital signature of witness (base64 encoded image)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANS...',
  })
  @IsString()
  signature: string;
}
