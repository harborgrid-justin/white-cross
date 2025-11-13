import { ApiProperty } from '@nestjs/swagger';
import { AuditLog } from '../entities/audit-log.entity';

class PaginationMeta {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

/**
 * DTO for paginated audit log responses
 */
export class PaginatedAuditLogsDto {
  @ApiProperty({ type: [AuditLog], description: 'Array of audit logs' })
  data: AuditLog[];

  @ApiProperty({ type: PaginationMeta, description: 'Pagination metadata' })
  pagination: PaginationMeta;
}
