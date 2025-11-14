/**
 * Admin User Seeder
 * Adds a default admin user to the database (idempotent)
 *
 * Usage: Run as part of the main seed script
 *
 * CRITICAL: Never expose plaintext passwords. Password is hashed using bcrypt.
 */

import { User } from '../models/user.model';
import { UserRole } from '../types/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function seedAdminUser() {
  const adminEmail = 'admin@whitecross.com';
  const adminPassword = 'Admin!234'; // Change in production
  const existing = await User.findOne({ where: { email: adminEmail } });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await User.create({
    email: adminEmail,
    password: hashedPassword,
    firstName: 'System',
    lastName: 'Administrator',
    role: UserRole.ADMIN,
    isActive: true,
    emailVerified: true,
    isEmailVerified: true,
  });
}
