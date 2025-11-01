import { Command, CommandRunner } from 'nest-commander';
import { InjectModel } from '@nestjs/sequelize';
import { District } from '../database/models/district.model';
import { generateDistricts } from '../database/seeds/districts.seed';

@Command({
  name: 'seed:districts',
  description: 'Seed districts into the database',
})
export class SeedDistrictsCommand extends CommandRunner {
  constructor(
    @InjectModel(District)
    private districtModel: typeof District,
  ) {
    super();
  }

  async run(): Promise<void> {
    console.log('🚀 Districts Seed Script\n');

    try {
      // Check if districts already exist
      const existingCount = await this.districtModel.count();
      
      if (existingCount > 0) {
        console.log(`⚠️  Found ${existingCount} existing districts in database`);
        console.log('❌ Skipping seed to avoid duplicates. Clear districts table first if needed.\n');
        return;
      }

      // Generate district data
      const districtCount = 5; // Create 5 districts
      console.log(`📝 Generating ${districtCount} districts...`);
      const districts = generateDistricts(districtCount);

      // Bulk insert districts
      console.log('💾 Inserting districts into database...');
      const createdDistricts = await this.districtModel.bulkCreate(districts as any[], {
        validate: true,
        returning: true,
      });

      console.log(`✅ Successfully seeded ${createdDistricts.length} districts`);
      console.log('\nSample districts:');
      createdDistricts.slice(0, 3).forEach((district) => {
        console.log(`  - ${district.name} (${district.code})`);
      });
      console.log('');
    } catch (error) {
      console.error('❌ Error seeding districts:', error.message);
      throw error;
    }
  }
}
