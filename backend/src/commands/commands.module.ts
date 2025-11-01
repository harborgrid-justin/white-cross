import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeedHealthRecordsCommand } from './seed-health-records.command';
import { SeedDistrictsCommand } from './seed-districts.command';
import { SeedSchoolsCommand } from './seed-schools.command';
import { SeedStudentsCommand } from './seed-students.command';
import { QueryDataCommand } from './query-data.command';
import { HealthRecord } from '../database/models/health-record.model';
import { Student } from '../database/models/student.model';
import { District } from '../database/models/district.model';
import { School } from '../database/models/school.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HealthRecord,
      Student,
      District,
      School,
    ]),
  ],
  providers: [
    SeedHealthRecordsCommand,
    SeedDistrictsCommand,
    SeedSchoolsCommand,
    SeedStudentsCommand,
    QueryDataCommand,
  ],
})
export class CommandsModule {}
