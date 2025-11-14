// Simple CLI login script for admin user
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { User } from '../database/models/user.model';
import * as bcrypt from 'bcrypt';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  try {
    const email = process.argv[2] || 'admin@whitecross.com';
    const password = process.argv[3] || 'Admin!234';
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log(JSON.stringify({ success: false, error: 'User not found' }));
      process.exit(1);
    }
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      console.log(JSON.stringify({ success: false, error: 'Account locked', lockoutUntil: user.lockoutUntil }));
      process.exit(1);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      console.log(JSON.stringify({ success: false, error: 'Invalid password' }));
      process.exit(1);
    }
    console.log(JSON.stringify({ success: true, user: { id: user.id, email: user.email, role: user.role } }));
    process.exit(0);
  } catch (err) {
    console.log(JSON.stringify({ success: false, error: err.message }));
    process.exit(1);
  } finally {
    await app.close();
  }
}

main();
