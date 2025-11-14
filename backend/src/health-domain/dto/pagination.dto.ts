import { PaginationDto as SharedPaginationDto } from '../../common/dto/pagination.dto';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

// Use the shared pagination DTO
export { SharedPaginationDto as PaginationDto };

export class PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export class PaginatedResponse<T> {
  records?: T[];
  items?: T[];
  data?: T[];
  pagination: PaginationInfo;
}
