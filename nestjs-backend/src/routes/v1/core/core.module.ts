/**
 * Core Routes Module (v1)
 *
 * Provides v1 API routes for core functionality including authentication,
 * user management, access control, and health checks.
 */

import { Module } from '@nestjs/common';
import { AuthV1Controller } from './auth.controller';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthV1Controller],
})
export class CoreV1Module {}
