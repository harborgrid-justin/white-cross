/**
 * @fileoverview Cache Module
 * @module shared/cache
 * @description NestJS module for caching functionality
 */

import { Module, Global } from '@nestjs/common';
import { CacheService } from './cache.service';

/**
 * @class CacheModule
 * @description Global module providing caching services across the application
 * @global
 */
@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}

export default CacheModule;
