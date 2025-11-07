import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignPdfDto {
  @ApiProperty({ description: 'Base64-encoded PDF buffer' })
  @IsString()
  @IsNotEmpty()
  pdfBuffer!: string;

  @ApiPropertyOptional({ description: 'Certificate data (base64)' })
  @IsString()
  @IsOptional()
  certificateData?: string;

  @ApiPropertyOptional({ description: 'Signature name' })
  @IsString()
  @IsOptional()
  signatureName?: string;

  @ApiPropertyOptional({ description: 'Signature reason' })
  @IsString()
  @IsOptional()
  signatureReason?: string;

  @ApiPropertyOptional({ description: 'Signature location' })
  @IsString()
  @IsOptional()
  signatureLocation?: string;
}
