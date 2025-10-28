import { Module } from '@nestjs/common';
import { AllergyService } from './allergy.service';

@Module({
  providers: [AllergyService]
})
export class AllergyModule {}
