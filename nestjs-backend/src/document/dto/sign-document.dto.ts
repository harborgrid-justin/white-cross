import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIP } from 'class-validator';

export class SignDocumentDto {
  @ApiProperty({ description: 'ID of document being signed' })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ description: 'User ID of the signer' })
  @IsString()
  @IsNotEmpty()
  signedBy: string;

  @ApiProperty({ description: 'Role of signer' })
  @IsString()
  @IsNotEmpty()
  signedByRole: string;

  @ApiPropertyOptional({ description: 'Base64-encoded signature image' })
  @IsString()
  @IsOptional()
  signatureData?: string;

  @ApiPropertyOptional({ description: 'IP address of signer' })
  @IsIP()
  @IsOptional()
  ipAddress?: string;
}
