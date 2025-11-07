import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HealthRecordAllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';
import { Allergy } from '../../database/models/allergy.model';
import { Student } from '../../database/models/student.model';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([Allergy, Student]), AuthModule],
  controllers: [HealthRecordAllergyController],
  providers: [AllergyService],
  exports: [AllergyService],
})
export class AllergyModule {}
