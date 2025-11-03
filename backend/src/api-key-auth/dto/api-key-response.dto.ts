import { ApiProperty } from '@nestjs/swagger';

export class ApiKeyResponseDto {
  @ApiProperty({
    description: 'API key in plaintext (only shown once during creation)',
    example: 'wc_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
  })
  apiKey?: string;

  @ApiProperty({
    description: 'API key ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'API key name',
    example: 'SIS Integration - Production',
  })
  name: string;

  @ApiProperty({
    description: 'API key prefix (first 12 characters)',
    example: 'wc_live_a1b2',
  })
  keyPrefix: string;

  @ApiProperty({
    description: 'API key scopes',
    example: ['students:read', 'health-records:read'],
  })
  scopes?: string[];

  @ApiProperty({
    description: 'API key expiration date',
    example: '2026-01-01T00:00:00.000Z',
  })
  expiresAt?: Date;

  @ApiProperty({
    description: 'API key creation date',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;
}
