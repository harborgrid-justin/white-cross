
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../database/models/user.model';

async function unlockAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  try {
    const admin = await User.findOne({ where: { email: 'admin@whitecross.com' } });
    if (!admin) {
      console.error('Admin user not found.');
      process.exit(1);
    }
    admin.failedLoginAttempts = 0;
    admin.lockoutUntil = null;
    await admin.save();
    console.log('Admin user unlocked successfully.');
    await app.close();
    process.exit(0);
  } catch (err) {
    console.error('Error unlocking admin user:', err);
    await app.close();
    process.exit(1);
  }
}

unlockAdmin();
