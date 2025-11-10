/**
 * LOC: EDU-DOWN-REGISTRAR-OFFICE-MODULE
 * File: registrar-office.module.ts
 * Purpose: Registrar Office Module - Dependency injection and module configuration
 */

import { Module, Logger } from '@nestjs/common';
import { RegistrarOfficeController } from './registrar-office-controller';
import { RegistrarOfficeService } from './registrar-office-service';

@Module({
  controllers: [RegistrarOfficeController],
  providers: [
    RegistrarOfficeService,
    Logger,
  ],
  exports: [RegistrarOfficeService],
})
export class RegistrarOfficeModule {}
