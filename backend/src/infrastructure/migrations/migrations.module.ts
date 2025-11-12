/**
 * Migrations Module
 *
 * Provides migration version control and dependency management services
 */

import { Module } from '@nestjs/common';
import { MigrationVersionControlService } from './migration-version-control.service';

@Module({
  providers: [MigrationVersionControlService],
  exports: [MigrationVersionControlService],
})
export class MigrationsModule {}