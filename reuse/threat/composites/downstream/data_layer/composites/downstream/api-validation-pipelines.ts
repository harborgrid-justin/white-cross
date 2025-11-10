/**
 * LOC: VALPIPE001
 * File: api-validation-pipelines.ts
 * Purpose: NestJS validation pipes for request validation
 */
import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException, Logger } from "@nestjs/common";
import { ValidationOperationsService } from "../validation-operations-kit";

@Injectable()
export class ApiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ApiValidationPipe.name);
  
  constructor(private readonly validationService: ValidationOperationsService) {}
  
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException("Validation failed: No data provided");
    }
    
    // Perform validation based on metadata type
    if (metadata.type === "body") {
      return this.validateBody(value);
    } else if (metadata.type === "param") {
      return this.validateParam(value, metadata.data || "id");
    } else if (metadata.type === "query") {
      return this.validateQuery(value);
    }
    
    return value;
  }
  
  private async validateBody(body: any): Promise<any> {
    // Validate required fields
    if (typeof body === "object") {
      for (const [key, value] of Object.entries(body)) {
        const result = this.validationService.validateRequired(value, key);
        if (!result.valid) {
          throw new BadRequestException(`Validation failed for field: ${key}`);
        }
      }
    }
    return body;
  }
  
  private validateParam(param: string, paramName: string): string {
    const result = this.validationService.validateRequired(param, paramName);
    if (!result.valid) {
      throw new BadRequestException(`Invalid parameter: ${paramName}`);
    }
    return param;
  }
  
  private validateQuery(query: any): any {
    // Query validation logic
    return query;
  }
}

export { ApiValidationPipe };
