import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for user statistics
 */
export class UserStatisticsDto {
  @ApiProperty({ description: 'Total number of users', example: 150 })
  total!: number;

  @ApiProperty({ description: 'Number of active users', example: 140 })
  active!: number;

  @ApiProperty({ description: 'Number of inactive users', example: 10 })
  inactive!: number;

  @ApiProperty({
    description: 'User count by role',
    example: { NURSE: 80, ADMIN: 5, SCHOOL_ADMIN: 40, VIEWER: 25 },
  })
  byRole!: Record<string, number>;

  @ApiProperty({
    description: 'Users logged in within last 30 days',
    example: 120,
  })
  recentLogins!: number;
}
