import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CaptureStatementDto {
  @ApiProperty({ description: 'Incident ID' })
  @IsString()
  incidentId: string;

  @ApiProperty({ description: 'Name of witness' })
  @IsString()
  witnessName: string;

  @ApiProperty({
    enum: ['student', 'teacher', 'staff', 'other'],
    description: 'Role of witness',
  })
  @IsEnum(['student', 'teacher', 'staff', 'other'])
  witnessRole: 'student' | 'teacher' | 'staff' | 'other';

  @ApiProperty({ description: 'Statement text' })
  @IsString()
  statement: string;

  @ApiProperty({
    enum: ['typed', 'voice-to-text', 'handwritten-scan'],
    description: 'How statement was captured',
  })
  @IsEnum(['typed', 'voice-to-text', 'handwritten-scan'])
  captureMethod: 'typed' | 'voice-to-text' | 'handwritten-scan';

  @ApiPropertyOptional({ description: 'Digital signature' })
  @IsOptional()
  @IsString()
  signature?: string;
}

export class VerifyStatementDto {
  @ApiProperty({ description: 'Statement ID' })
  @IsString()
  statementId: string;

  @ApiProperty({ description: 'User verifying the statement' })
  @IsString()
  verifiedBy: string;
}

export class TranscribeVoiceStatementDto {
  @ApiProperty({ description: 'Base64 encoded audio data' })
  @IsString()
  audioData: string;
}

export class WitnessStatementResponseDto {
  id: string;
  incidentId: string;
  witnessName: string;
  witnessRole: 'student' | 'teacher' | 'staff' | 'other';
  statement: string;
  captureMethod: 'typed' | 'voice-to-text' | 'handwritten-scan';
  timestamp: Date;
  signature?: string;
  verified: boolean;
}
