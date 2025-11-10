/**
 * WebSocket Validation Pipe
 *
 * Validates and transforms WebSocket message payloads using class-validator decorators.
 * Provides structured error responses for invalid WebSocket messages.
 *
 * Key Features:
 * - Automatic DTO validation using class-validator
 * - Automatic transformation using class-transformer
 * - Detailed validation error messages
 * - HIPAA-compliant error handling (no PHI in errors)
 * - Type-safe message payloads
 *
 * Usage:
 * ```typescript
 * @UsePipes(new WsValidationPipe())
 * @SubscribeMessage('message:send')
 * handleMessage(@MessageBody() dto: SendMessageDto) {
 *   // dto is validated and transformed
 * }
 * ```
 *
 * @class WsValidationPipe
 */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class WsValidationPipe implements PipeTransform<any> {
  /**
   * Transforms and validates the incoming value
   *
   * @param value - The incoming message payload
   * @param metadata - Argument metadata containing type information
   * @returns The validated and transformed DTO instance
   * @throws WsException if validation fails
   */
  async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    // Skip validation if no metatype or if it's a native type
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    // Transform plain object to class instance
    const object = plainToClass(metadata.metatype, value);

    // Validate the object
    const errors = await validate(object, {
      whitelist: true, // Strip non-whitelisted properties
      forbidNonWhitelisted: true, // Reject non-whitelisted properties
      forbidUnknownValues: true, // Reject unknown values
      validationError: {
        target: false, // Don't expose the target object
        value: false, // Don't expose the invalid value (could contain PHI)
      },
    });

    if (errors.length > 0) {
      throw new WsException({
        type: 'VALIDATION_ERROR',
        message: 'Message validation failed',
        details: this.formatErrors(errors),
      });
    }

    return object;
  }

  /**
   * Checks if a metatype should be validated
   *
   * @param metatype - The metatype to check
   * @returns True if validation is needed
   */
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  /**
   * Formats validation errors into a user-friendly structure
   * HIPAA-compliant: does not expose sensitive values
   *
   * @param errors - Array of validation errors
   * @returns Formatted error messages
   */
  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }

      // Handle nested validation errors
      if (error.children && error.children.length > 0) {
        return this.formatErrors(error.children);
      }

      return [`${error.property} failed validation`];
    });
  }
}
