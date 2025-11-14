import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

/**
 * DTO for user responses
 * Excludes sensitive fields like password and tokens
 */
@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ description: 'User ID', example: 'uuid' })
  id!: string;

  @Expose()
  @ApiProperty({ description: 'Email address', example: 'nurse@school.edu' })
  email!: string;

  @Expose()
  @ApiProperty({ description: 'First name', example: 'Jane' })
  firstName!: string;

  @Expose()
  @ApiProperty({ description: 'Last name', example: 'Doe' })
  lastName!: string;

  @Expose()
  @ApiProperty({ description: 'User role', enum: UserRole })
  role!: UserRole;

  @Expose()
  @ApiProperty({ description: 'Active status', example: true })
  isActive!: boolean;

  @Expose()
  @ApiPropertyOptional({ description: 'Last login timestamp' })
  lastLogin?: Date;

  @Expose()
  @ApiPropertyOptional({ description: 'School ID' })
  schoolId?: string;

  @Expose()
  @ApiPropertyOptional({ description: 'District ID' })
  districtId?: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Phone number' })
  phone?: string;

  @Expose()
  @ApiProperty({ description: 'Email verified status', example: false })
  emailVerified!: boolean;

  @Expose()
  @ApiProperty({ description: '2FA enabled status', example: false })
  twoFactorEnabled!: boolean;

  @Expose()
  @ApiProperty({ description: 'Failed login attempts', example: 0 })
  failedLoginAttempts!: number;

  @Expose()
  @ApiPropertyOptional({ description: 'Lockout expiration' })
  lockoutUntil?: Date;

  @Expose()
  @ApiPropertyOptional({ description: 'Last password change' })
  lastPasswordChange?: Date;

  @Expose()
  @ApiProperty({ description: 'Must change password flag', example: false })
  mustChangePassword!: boolean;

  @Expose()
  @ApiProperty({ description: 'Created timestamp' })
  createdAt!: Date;

  @Expose()
  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt!: Date;

  @Expose()
  @ApiPropertyOptional({ description: 'Activity counts' })
  _count?: {
    nurseManagedStudents?: number;
    appointments?: number;
    incidentReports?: number;
    medicationLogs?: number;
    inventoryTransactions?: number;
  };
}

/**
 * DTO for paginated user list response
 */
export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  users!: UserResponseDto[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: { total: 100, page: 1, limit: 20, pages: 5 },
  })
  pagination!: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
