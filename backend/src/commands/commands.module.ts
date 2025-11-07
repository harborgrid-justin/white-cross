import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SeedHealthRecordsCommand } from './seed-health-records.command';
import { SeedDistrictsCommand } from './seed-districts.command';
import { SeedSchoolsCommand } from './seed-schools.command';
import { SeedStudentsCommand } from './seed-students.command';
import { SeedIncidentsCommand } from './seed-incidents.command';
import { QueryDataCommand } from './query-data.command';
import { HealthRecord } from '@/database';
import { Student } from '@/database';
import { District } from '@/database';
import { School } from '@/database';
import { IncidentReport } from '@/database';
import { User } from '@/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      HealthRecord,
      Student,
      District,
      School,
      IncidentReport,
      User,
    ]),
  ],
  providers: [
    SeedHealthRecordsCommand,
    SeedDistrictsCommand,
    SeedSchoolsCommand,
    SeedStudentsCommand,
    SeedIncidentsCommand,
    QueryDataCommand,
  ],
})
export class CommandsModule {}
