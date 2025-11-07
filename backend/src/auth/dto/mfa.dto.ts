import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

/**
 * MFA setup response DTO
 */
export class MfaSetupResponseDto {
  @ApiProperty({
    description: 'Secret key for TOTP configuration',
    example: 'JBSWY3DPEHPK3PXP',
  })
  secret: string;

  @ApiProperty({
    description: 'QR code as data URL for scanning with authenticator app',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
  })
  qrCode: string;

  @ApiProperty({
    description: 'Backup codes for account recovery',
    example: ['12345678', '87654321', '11223344'],
    type: [String],
  })
  backupCodes: string[];

  @ApiProperty({
    description: 'Manual entry key for authenticator apps',
    example: 'JBSW Y3DP EHPK 3PXP',
  })
  manualEntryKey: string;
}

/**
 * MFA verification DTO
 */
export class MfaVerifyDto {
  @ApiProperty({
    description: 'Six-digit TOTP code from authenticator app',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;

  @ApiProperty({
    description: 'Whether this is a backup code',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isBackupCode?: boolean;
}

/**
 * MFA enable DTO
 */
export class MfaEnableDto {
  @ApiProperty({
    description: 'Six-digit TOTP code to verify setup',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    description: 'Secret key from setup process',
    example: 'JBSWY3DPEHPK3PXP',
  })
  @IsString()
  @IsNotEmpty()
  secret: string;
}

/**
 * MFA disable DTO
 */
export class MfaDisableDto {
  @ApiProperty({
    description: 'Current password for security verification',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Six-digit TOTP code from authenticator app',
    example: '123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(6, 6)
  code?: string;
}

/**
 * MFA status response DTO
 */
export class MfaStatusDto {
  @ApiProperty({
    description: 'Whether MFA is enabled for the user',
    example: true,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Whether backup codes are available',
    example: true,
  })
  hasBackupCodes: boolean;

  @ApiProperty({
    description: 'Number of remaining backup codes',
    example: 8,
  })
  backupCodesRemaining: number;

  @ApiProperty({
    description: 'Date when MFA was enabled',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  enabledAt?: Date;
}

/**
 * MFA regenerate backup codes DTO
 */
export class MfaRegenerateBackupCodesDto {
  @ApiProperty({
    description: 'Current password for security verification',
    example: 'SecurePass123!',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Six-digit TOTP code from authenticator app',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}
