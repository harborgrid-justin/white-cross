/**
 * LOC: EDU-DOWN-BURSAR-MODULE-001
 * File: /reuse/education/composites/downstream/bursar-office.module.ts
 *
 * Purpose: Bursar Office Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { BursarOfficeController } from './bursar-office-controller';
import { BursarOfficeControllersService } from './bursar-office-service';

@Module({
  controllers: [BursarOfficeController],
  providers: [
    BursarOfficeControllersService,
    Logger,
  ],
  exports: [BursarOfficeControllersService],
})
export class BursarOfficeModule {}
