import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AllergyController } from './allergy.controller';
import { AllergyService } from './allergy.service';
import { Allergy } from '../../database/models/allergy.model';
import { Student } from '../../database/models/student.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Allergy, Student]),
  ],
  controllers: [AllergyController],
  providers: [AllergyService],
  exports: [AllergyService],
})
export class AllergyModule {}
