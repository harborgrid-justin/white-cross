import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VitalsService } from './vitals.service';
import { HealthRecord   } from "../../database/models";
import { Student   } from "../../database/models";

@Module({
  imports: [SequelizeModule.forFeature([HealthRecord, Student])],
  providers: [VitalsService],
  exports: [VitalsService],
})
export class VitalsModule {}
