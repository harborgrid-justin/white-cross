/**
 * Contact Query DTO
 * @description DTO for filtering and paginating contacts
 */
import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsString,
  IsInt,
  Min,
  Max,
  IsIn,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ContactType } from '../enums';

export class ContactQueryDto {
  @ApiPropertyOptional({
    enum: ContactType,
    description: 'Filter by contact type',
    isArray: true,
  })
  @IsOptional()
  @IsEnum(ContactType, { each: true })
  type?: ContactType | ContactType[];

  @ApiPropertyOptional({
    example: true,
    description: 'Filter by active status',
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filter by related entity UUID',
  })
  @IsOptional()
  @IsUUID()
  relationTo?: string;

  @ApiPropertyOptional({
    example: 'john',
    description: 'Search by name, email, or organization',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: 'Items per page',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    example: 'lastName',
    description: 'Field to order by',
    default: 'lastName',
  })
  @IsOptional()
  @IsString()
  orderBy?: string = 'lastName';

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
    example: 'ASC',
    description: 'Order direction',
    default: 'ASC',
  })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC' = 'ASC';
}
