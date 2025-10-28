/**
 * Routes Module
 *
 * Top-level module for all API routes. Supports versioning with separate
 * modules for each API version (v1, v2, etc.).
 */

import { Module } from '@nestjs/common';
import { V1RoutesModule } from './v1/v1-routes.module';

@Module({
  imports: [
    V1RoutesModule,
    // Add v2 and other versions here as needed
    // V2RoutesModule,
  ],
})
export class RoutesModule {}
