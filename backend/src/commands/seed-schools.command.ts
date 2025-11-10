import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { District, School } from '@/database';
import { generateSchools } from '@/database/seeds';

@Command({
  name: 'seed:schools',
  description: 'Seed schools into the database',
})
export class SeedSchoolsCommand extends CommandRunner {
  constructor(
    @InjectModel(School)
    private schoolModel: typeof School,
    @InjectModel(District)
    private districtModel: typeof District,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🚀 Schools Seed Script\n');

    try {
      // Check if schools already exist
      const existingCount = await this.schoolModel.count();

      if (existingCount > 0) {
        console.log(`⚠️  Found ${existingCount} existing schools in database`);
        console.log(
          '❌ Skipping seed to avoid duplicates. Clear schools table first if needed.\n',
        );
        return;
      }

      // Get all districts
      const districts = await this.districtModel.findAll({
        attributes: ['id'],
        where: { isActive: true },
      });

      if (districts.length === 0) {
        console.log(
          '❌ No districts found in database. Please seed districts first.',
        );
        console.log('   Run: npm run seed:districts\n');
        return;
      }

      const districtIds = districts.map((d) => d.id);
      console.log(`✅ Found ${districtIds.length} districts`);

      // Generate school data
      const schoolsPerDistrict = 3; // Create 3 schools per district
      console.log(
        `📝 Generating ${schoolsPerDistrict} schools per district (${districtIds.length * schoolsPerDistrict} total)...`,
      );
      const schools = generateSchools(districtIds, schoolsPerDistrict);

      // Bulk insert schools
      console.log('💾 Inserting schools into database...');
      const createdSchools = await this.schoolModel.bulkCreate(
        schools as any[],
        {
          validate: true,
          returning: true,
        },
      );

      console.log(`✅ Successfully seeded ${createdSchools.length} schools`);
      console.log('\nSample schools:');
      createdSchools.slice(0, 5).forEach((school) => {
        console.log(
          `  - ${school.name} (${school.code}) - ${school.totalEnrollment} students`,
        );
      });
      console.log('');
    } catch (error) {
      console.error('❌ Error seeding schools:', error.message);
      throw error;
    }
  }
}
