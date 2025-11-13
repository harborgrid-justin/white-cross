import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthRecordAllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';
import { Allergy   } from '@/database/models';
import { Student   } from '@/database/models';
import { AuthModule } from '@/services/auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Allergy, Student]), AuthModule],
  controllers: [HealthRecordAllergyController],
  providers: [AllergyService],
  exports: [AllergyService],
})
export class AllergyModule {}
