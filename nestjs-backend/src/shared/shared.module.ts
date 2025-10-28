import { Module, Global } from '@nestjs/common';

/**
 * Shared Module
 * Provides common utilities, constants, types, and validation across the application
 * Marked as Global to avoid repeated imports
 */
@Global()
@Module({
  exports: [],
})
export class SharedModule {}
