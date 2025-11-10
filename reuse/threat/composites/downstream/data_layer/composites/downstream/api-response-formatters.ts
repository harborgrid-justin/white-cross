/**
 * LOC: APIFORMAT001
 * File: api-response-formatters.ts
 * Purpose: Standardized API response formatting and transformation
 */
import { Injectable, Logger } from "@nestjs/common";
import { TransformationOperationsService } from "../transformation-operations-kit";
import { DtoOperationsService } from "../dto-operations-kit";

@Injectable()
export class ApiResponseFormatterService {
  private readonly logger = new Logger(ApiResponseFormatterService.name);
  
  constructor(
    private readonly transformService: TransformationOperationsService,
    private readonly dtoService: DtoOperationsService,
  ) {}
  
  formatSuccess(data: any, metadata?: any): any {
    return {
      success: true,
      data,
      metadata: metadata || { timestamp: new Date().toISOString() },
    };
  }
  
  formatError(error: Error, code: string = "INTERNAL_ERROR"): any {
    return {
      success: false,
      error: {
        code,
        message: error.message,
        timestamp: new Date().toISOString(),
      },
    };
  }
  
  formatPaginated(data: any[], total: number, page: number, pageSize: number): any {
    return this.formatSuccess(data, {
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
      timestamp: new Date().toISOString(),
    });
  }
  
  async transformToDto(data: any, dtoClass: any): Promise<any> {
    return this.dtoService.transformToDto(data, dtoClass);
  }
}

export { ApiResponseFormatterService };
