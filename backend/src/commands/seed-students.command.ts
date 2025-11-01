import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../database/models/student.model';
import { School } from '../database/models/school.model';
import { District } from '../database/models/district.model';
import { generateStudents } from '../database/seeds/students.seed';

@Command({
  name: 'seed:students',
  description: 'Seed students into the database',
})
export class SeedStudentsCommand extends CommandRunner {
  constructor(
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(School)
    private schoolModel: typeof School,
    @InjectModel(District)
    private districtModel: typeof District,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🚀 Students Seed Script\n');

    try {
      // Check if students already exist
      const existingCount = await this.studentModel.count();
      
      if (existingCount > 0) {
        console.log(`⚠️  Found ${existingCount} existing students in database`);
        console.log('❌ Skipping seed to avoid duplicates. Clear students table first if needed.\n');
        return;
      }

      // Get all schools
      const schools = await this.schoolModel.findAll({
        attributes: ['id', 'districtId'],
        where: { isActive: true },
      });

      if (schools.length === 0) {
        console.log('❌ No schools found in database. Please seed schools first.');
        console.log('   Run: npm run seed:schools\n');
        return;
      }

      const schoolIds = schools.map(s => s.id);
      const districtIds = schools.map(s => s.districtId);
      console.log(`✅ Found ${schoolIds.length} schools`);

      // Generate student data
      const studentsPerSchool = 20; // Create 20 students per school
      console.log(`📝 Generating ${studentsPerSchool} students per school (${schoolIds.length * studentsPerSchool} total)...`);
      const students = generateStudents(schoolIds, districtIds, studentsPerSchool);

      // Bulk insert students in batches to avoid memory issues
      const batchSize = 100;
      let totalCreated = 0;
      
      console.log('💾 Inserting students into database...');
      for (let i = 0; i < students.length; i += batchSize) {
        const batch = students.slice(i, i + batchSize);
        const created = await this.studentModel.bulkCreate(batch as any[], {
          validate: true,
          returning: true,
        });
        totalCreated += created.length;
        console.log(`   Inserted batch ${Math.floor(i / batchSize) + 1}: ${created.length} students (Total: ${totalCreated})`);
      }

      console.log(`✅ Successfully seeded ${totalCreated} students`);
      
      // Show sample students
      const sampleStudents = await this.studentModel.findAll({
        limit: 5,
        attributes: ['studentNumber', 'firstName', 'lastName', 'grade', 'gender'],
      });
      
      console.log('\nSample students:');
      sampleStudents.forEach((student) => {
        console.log(`  - ${student.studentNumber}: ${student.firstName} ${student.lastName} (Grade ${student.grade}, ${student.gender})`);
      });
      console.log('');
    } catch (error) {
      console.error('❌ Error seeding students:', error.message);
      throw error;
    }
  }
}
