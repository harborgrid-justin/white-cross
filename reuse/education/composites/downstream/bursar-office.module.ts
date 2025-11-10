import { Module, Logger } from '@nestjs/common';
import { BursarOfficeController } from './bursar-office-controller';
import { BursarOfficeControllersService } from './bursar-office-service';

/**
 * LOC: EDU-DOWN-BURSAR-MODULE-001
 * File: /reuse/education/composites/downstream/bursar-office.module.ts
 *
 * Purpose: Bursar Office Module - Dependency injection and module configuration
 */


@Module({
  controllers: [BursarOfficeController],
  providers: [
    BursarOfficeControllersService,
    Logger,
  ],
  exports: [BursarOfficeControllersService],
})
@Injectable()
export class BursarOfficeModule {}
