/**
 * LOC: EDU-DOWN-LIBRARY-MANAGEMENT-MODULE
 * File: library-management.module.ts
 * Purpose: Library Management Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { LibraryManagementController } from './library-management-controller';
import { LibraryManagementService } from './library-management-service';

@Module({
  controllers: [LibraryManagementController],
  providers: [
    LibraryManagementService,
    Logger,
  ],
  exports: [LibraryManagementService],
})
export class LibraryManagementModule {}
