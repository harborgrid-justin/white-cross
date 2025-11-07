import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '@/database';
import { HealthRecord } from '@/database';
import { School } from '@/database';
import { District } from '@/database';

@Command({
  name: 'query:data',
  description: 'Query database to check seeded data',
})
export class QueryDataCommand extends CommandRunner {
  constructor(
    @InjectModel(District)
    private districtModel: typeof District,
    @InjectModel(School)
    private schoolModel: typeof School,
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(HealthRecord)
    private healthRecordModel: typeof HealthRecord,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('📊 Database Query Report\n');

    try {
      const districtCount = await this.districtModel.count();
      const schoolCount = await this.schoolModel.count();
      const studentCount = await this.studentModel.count();
      const healthRecordCount = await this.healthRecordModel.count();

      console.log('Record Counts:');
      console.log(`  Districts: ${districtCount}`);
      console.log(`  Schools: ${schoolCount}`);
      console.log(`  Students: ${studentCount}`);
      console.log(`  Health Records: ${healthRecordCount}\n`);

      if (studentCount > 0) {
        const sampleStudents = await this.studentModel.findAll({
          limit: 3,
          attributes: ['id', 'studentNumber', 'firstName', 'lastName', 'grade'],
        });

        console.log('Sample Students:');
        sampleStudents.forEach((student) => {
          console.log(
            `  - ${student.studentNumber}: ${student.firstName} ${student.lastName} (Grade ${student.grade})`,
          );
        });
        console.log('');
      }

      if (healthRecordCount > 0) {
        const sampleRecords = await this.healthRecordModel.findAll({
          limit: 3,
          attributes: ['id', 'recordType', 'title', 'recordDate'],
        });

        console.log('Sample Health Records:');
        sampleRecords.forEach((record) => {
          console.log(
            `  - ${record.recordType}: ${record.title} (${new Date(record.recordDate).toLocaleDateString()})`,
          );
        });
        console.log('');
      }
    } catch (error) {
      console.error('❌ Error querying database:', error.message);
      throw error;
    }
  }
}
