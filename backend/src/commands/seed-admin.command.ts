import { Command, CommandRunner } from 'nest-commander';
import { seedAdminUser } from '@/database/seeds';

@Command({
  name: 'seed:admin',
  description: 'Seed the default admin user into the database',
})
export class SeedAdminCommand extends CommandRunner {
  async run(): Promise<void> {
    console.log('🚀 Admin User Seed Script\n');
    try {
      await seedAdminUser();
      console.log('✅ Admin user seeded (or already exists)');
    } catch (error) {
      console.error('❌ Error seeding admin user:', error.message);
      throw error;
    }
  }
}
