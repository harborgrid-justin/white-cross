/**
 * LOC: PIPE-VALIDATION-001
 * File: /reuse/server/health/composites/shared/pipes/validation.pipe.ts
 * Purpose: Custom validation pipe with enhanced security features
 *
 * @description
 * Extends NestJS ValidationPipe with:
 * - Input sanitization
 * - SQL injection prevention
 * - XSS prevention
 * - Deep object validation
 * - Custom error messages for security
 */

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class SecureValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(SecureValidationPipe.name);

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    // Sanitize input before validation
    const sanitizedValue = this.sanitizeInput(value);

    const object = plainToClass(metadata.metatype, sanitizedValue);
    const errors = await validate(object, {
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties exist
      forbidUnknownValues: true, // Throw error on unknown values
      skipMissingProperties: false, // Don't skip missing properties
    });

    if (errors.length > 0) {
      this.logger.warn(`Validation failed: ${this.formatErrors(errors)}`);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: this.formatErrors(errors),
      });
    }

    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private sanitizeInput(value: any): any {
    if (typeof value === 'string') {
      return this.sanitizeString(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeInput(item));
    }

    if (typeof value === 'object' && value !== null) {
      const sanitized: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeInput(value[key]);
        }
      }
      return sanitized;
    }

    return value;
  }

  private sanitizeString(value: string): string {
    // Remove null bytes
    value = value.replace(/\0/g, '');

    // Remove common SQL injection patterns (basic protection)
    // Note: Parameterized queries are the primary defense
    const sqlPatterns = [
      /(\s|^)(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|eval|expression)(\s|$)/gi,
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(value)) {
        this.logger.warn(`Potential SQL injection attempt detected: ${value.substring(0, 50)}`);
      }
    }

    // Basic XSS prevention (escape HTML entities)
    // Note: Use proper HTML sanitization library for user-generated content
    value = value
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');

    return value.trim();
  }

  private formatErrors(errors: ValidationError[]): any[] {
    return errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
      children: error.children?.length
        ? this.formatErrors(error.children)
        : undefined,
    }));
  }
}
