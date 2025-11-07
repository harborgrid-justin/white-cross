import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateClaimDto {
  @ApiProperty({ description: 'Incident ID' })
  @IsString()
  incidentId: string;

  @ApiProperty({ description: 'Student ID' })
  @IsString()
  studentId: string;
}

export class ExportClaimDto {
  @ApiProperty({ description: 'Claim ID' })
  @IsString()
  claimId: string;

  @ApiProperty({ enum: ['pdf', 'xml', 'edi'], description: 'Export format' })
  @IsEnum(['pdf', 'xml', 'edi'])
  format: 'pdf' | 'xml' | 'edi';
}

export class SubmitClaimDto {
  @ApiProperty({ description: 'Claim ID' })
  @IsString()
  claimId: string;
}

export class InsuranceClaimResponseDto {
  id: string;
  incidentId: string;
  studentId: string;
  claimNumber: string;
  insuranceProvider: string;
  claimAmount: number;
  status: 'draft' | 'submitted' | 'approved' | 'denied';
  submittedAt?: Date;
  documents: string[];
}
