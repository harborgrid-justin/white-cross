import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadEvidenceDto {
  @ApiProperty({ description: 'Incident ID' })
  @IsString()
  incidentId: string;

  @ApiProperty({ description: 'Base64 encoded file data' })
  @IsString()
  fileData: string;

  @ApiProperty({ enum: ['photo', 'video'], description: 'Type of evidence' })
  @IsEnum(['photo', 'video'])
  type: 'photo' | 'video';

  @ApiProperty({ description: 'User uploading the evidence' })
  @IsString()
  uploadedBy: string;
}

export class DeleteEvidenceDto {
  @ApiProperty({ description: 'Evidence ID' })
  @IsString()
  evidenceId: string;

  @ApiProperty({ description: 'User deleting the evidence' })
  @IsString()
  deletedBy: string;

  @ApiProperty({ description: 'Reason for deletion' })
  @IsString()
  reason: string;
}

export class EvidenceFileResponseDto {
  id: string;
  incidentId: string;
  type: 'photo' | 'video';
  filename: string;
  url: string;
  metadata: {
    fileSize: number;
    mimeType: string;
    duration?: number;
    dimensions?: { width: number; height: number };
  };
  uploadedBy: string;
  uploadedAt: Date;
  securityLevel: 'restricted' | 'confidential';
}
