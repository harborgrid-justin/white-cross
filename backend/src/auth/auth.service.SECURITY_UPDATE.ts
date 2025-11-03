/**
 * SECURITY UPDATE: Increased bcrypt Salt Rounds
 *
 * This file demonstrates the updated bcrypt configuration with increased salt rounds
 * for healthcare-grade password security.
 *
 * CHANGE: Salt rounds increased from 10 to 12
 * REASON: Healthcare applications handling PHI require stronger key derivation
 * IMPACT: Slightly slower password hashing (acceptable tradeoff for security)
 *
 * Apply this change to:
 * - backend/src/auth/auth.service.ts (line 21)
 * - backend/src/database/models/user.model.ts (lines 281, 289)
 */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // SECURITY UPDATE: Increased from 10 to 12
  // Configurable via environment variable for flexibility
  private readonly saltRounds = parseInt(
    this.configService.get<string>('BCRYPT_SALT_ROUNDS', '12'),
    10,
  );

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Validate salt rounds on startup
    if (this.saltRounds < 10 || this.saltRounds > 14) {
      throw new Error(
        'SECURITY WARNING: bcrypt salt rounds must be between 10 and 14. ' +
        `Current value: ${this.saltRounds}. Recommended for healthcare: 12.`
      );
    }
  }

  /**
   * Hash password with bcrypt
   *
   * Salt rounds: 12 (recommended for healthcare)
   * - 10 rounds: Fast, acceptable for general use
   * - 12 rounds: Balanced, recommended for healthcare (PHI protection)
   * - 14 rounds: Very secure, slower (consider for admin accounts)
   *
   * @param password - Plaintext password
   * @returns Hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compare password with hash
   *
   * @param password - Plaintext password
   * @param hash - Stored hash
   * @returns True if password matches
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

/**
 * APPLY TO USER MODEL:
 *
 * File: backend/src/database/models/user.model.ts
 *
 * @BeforeCreate
 * static async hashPasswordBeforeCreate(user: User) {
 *   if (user.password) {
 *     // SECURITY UPDATE: Changed from 10 to 12
 *     user.password = await bcrypt.hash(user.password, 12);
 *     user.lastPasswordChange = new Date();
 *   }
 * }
 *
 * @BeforeUpdate
 * static async hashPasswordBeforeUpdate(user: User) {
 *   if (user.changed('password')) {
 *     // SECURITY UPDATE: Changed from 10 to 12
 *     user.password = await bcrypt.hash(user.password, 12);
 *     user.passwordChangedAt = new Date();
 *     user.lastPasswordChange = new Date();
 *   }
 * }
 */

/**
 * ENVIRONMENT CONFIGURATION:
 *
 * Add to .env file:
 *
 * # Password Hashing Configuration
 * BCRYPT_SALT_ROUNDS=12
 *
 * Optionally, use different salt rounds for different account types:
 * BCRYPT_SALT_ROUNDS_USER=12
 * BCRYPT_SALT_ROUNDS_ADMIN=14
 */

/**
 * PERFORMANCE CONSIDERATIONS:
 *
 * Salt Rounds | Time per Hash | Security Level
 * ------------|---------------|----------------
 * 10          | ~100ms        | Good
 * 11          | ~200ms        | Better
 * 12          | ~400ms        | Best (Recommended)
 * 13          | ~800ms        | Excellent
 * 14          | ~1600ms       | Maximum
 *
 * Recommendation: Use 12 for healthcare applications
 * - Provides strong protection against brute force
 * - Acceptable performance impact (<500ms per hash)
 * - Meets HIPAA security requirements
 * - Aligns with NIST guidelines
 */

/**
 * MIGRATION PLAN:
 *
 * Option 1: Gradual Migration (Recommended)
 * - Update salt rounds to 12 in code
 * - Existing passwords remain with old hash
 * - New hashes use 12 rounds on next password change
 * - No immediate re-hashing required
 * - Users automatically migrated on next login/password change
 *
 * Option 2: Forced Re-hash (If required)
 * - Create migration script to re-hash all passwords
 * - Requires reading existing hashes, re-hashing with new rounds
 * - Higher risk, requires careful testing
 * - Only use if compliance requires it
 */
