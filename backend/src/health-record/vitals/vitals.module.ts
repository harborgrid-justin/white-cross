import { Module } from '@nestjs/common';
import { VitalsService } from './vitals.service';

@Module({
  providers: [VitalsService]
})
export class VitalsModule {}
