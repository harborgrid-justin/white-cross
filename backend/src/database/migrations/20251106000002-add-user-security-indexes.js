'use strict';

/**
 * Migration: Add User Security Indexes
 *
 * Purpose: Add performance-critical partial indexes for user security features
 * including account lockouts, failed login tracking, password rotation monitoring,
 * and MFA (multi-factor authentication) status tracking.
 *
 * HIPAA Compliance: Enhances security monitoring capabilities for healthcare
 * system access. Fast security queries are critical for:
 * - Real-time intrusion detection
 * - Compliance reporting (access controls)
 * - Automated security response
 * - Audit trail performance
 *
 * Safety Features:
 * - Uses transactions for atomicity
 * - IF NOT EXISTS pattern for idempotency
 * - Partial indexes to minimize storage overhead
 * - Comprehensive rollback method
 *
 * Performance Impact: Low - partial indexes are small and fast to create
 * Estimated Duration: < 5 seconds for typical user tables (< 10k users)
 *
 * Index Strategy:
 * - Partial indexes for active security concerns only
 * - Optimizes security monitoring queries
 * - Minimal storage overhead (indexes only relevant records)
 */

module.exports = {
  /**
   * Add user security indexes
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION] Starting: Add user security indexes');

      // ============================================================
      // ACCOUNT LOCKOUT MONITORING
      // ============================================================

      console.log('[MIGRATION] Section 1: Account lockout monitoring');

      // Index 1: Active lockouts tracking
      // Query: "Find all currently locked user accounts"
      // Usage: Security dashboard, automated unlock workflows, compliance reporting
      const [lockoutIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_active_lockouts'`,
        { transaction }
      );

      if (lockoutIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_active_lockouts
           ON users ("lockoutUntil", "failedLoginAttempts", email, id)
           WHERE "lockoutUntil" > NOW() AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_active_lockouts');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_active_lockouts');
      }

      // Index 2: Failed login attempts monitoring
      // Query: "Find accounts with elevated failed login attempts (pre-lockout)"
      // Usage: Intrusion detection, proactive security alerts, brute force prevention
      const [failedLoginsIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_failed_login_monitoring'`,
        { transaction }
      );

      if (failedLoginsIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_failed_login_monitoring
           ON users ("failedLoginAttempts", "lastLogin", email, id)
           WHERE "failedLoginAttempts" >= 3 AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_failed_login_monitoring');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_failed_login_monitoring');
      }

      // ============================================================
      // PASSWORD ROTATION COMPLIANCE
      // ============================================================

      console.log('[MIGRATION] Section 2: Password rotation compliance');

      // Index 3: Password rotation enforcement
      // Query: "Find users requiring password change (90-day policy)"
      // Usage: Password policy enforcement, compliance reporting, automated reminders
      const [passwordRotationIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_password_rotation'`,
        { transaction }
      );

      if (passwordRotationIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_password_rotation
           ON users ("lastPasswordChange", "mustChangePassword", email, id, role)
           WHERE "isActive" = true AND "deletedAt" IS NULL
           AND (
             "lastPasswordChange" < NOW() - INTERVAL '90 days'
             OR "mustChangePassword" = true
           )`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_password_rotation');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_password_rotation');
      }

      // Index 4: Force password change tracking
      // Query: "Find users flagged for mandatory password change"
      // Usage: Administrative password resets, security incident response
      const [forcePasswordChangeIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_force_password_change'`,
        { transaction }
      );

      if (forcePasswordChangeIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_force_password_change
           ON users ("mustChangePassword", "isActive", email, id)
           WHERE "mustChangePassword" = true AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_force_password_change');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_force_password_change');
      }

      // ============================================================
      // MFA (MULTI-FACTOR AUTHENTICATION) TRACKING
      // ============================================================

      console.log('[MIGRATION] Section 3: MFA compliance tracking');

      // Index 5: MFA enrollment status
      // Query: "Find active users without MFA enabled"
      // Usage: MFA enrollment campaigns, security compliance reporting
      const [mfaNotEnabledIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_mfa_not_enabled'`,
        { transaction }
      );

      if (mfaNotEnabledIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_mfa_not_enabled
           ON users ("mfaEnabled", role, "createdAt", email, id)
           WHERE "mfaEnabled" = false AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_mfa_not_enabled');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_mfa_not_enabled');
      }

      // Index 6: Two-factor authentication enabled users
      // Query: "Find users with 2FA enabled (legacy field support)"
      // Usage: Backward compatibility, migration tracking
      const [twoFactorIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_two_factor_enabled'`,
        { transaction }
      );

      if (twoFactorIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_two_factor_enabled
           ON users ("twoFactorEnabled", "isActive", role)
           WHERE "twoFactorEnabled" = true AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_two_factor_enabled');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_two_factor_enabled');
      }

      // ============================================================
      // EMAIL VERIFICATION TRACKING
      // ============================================================

      console.log('[MIGRATION] Section 4: Email verification tracking');

      // Index 7: Unverified email accounts
      // Query: "Find active users with unverified email addresses"
      // Usage: Account activation workflows, email verification campaigns
      const [unverifiedEmailIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_unverified_email'`,
        { transaction }
      );

      if (unverifiedEmailIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_unverified_email
           ON users ("emailVerified", "createdAt", email, id)
           WHERE "emailVerified" = false AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_unverified_email');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_unverified_email');
      }

      // Index 8: Enhanced email verification tracking (new field)
      // Query: "Find users with unverified email using enhanced verification"
      // Usage: New email verification system, migration support
      const [isEmailVerifiedIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_is_email_verified'`,
        { transaction }
      );

      if (isEmailVerifiedIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_is_email_verified
           ON users ("isEmailVerified", "createdAt", email, id)
           WHERE "isEmailVerified" = false AND "isActive" = true AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_is_email_verified');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_is_email_verified');
      }

      // ============================================================
      // SECURITY TOKEN MANAGEMENT
      // ============================================================

      console.log('[MIGRATION] Section 5: Security token indexes');

      // Index 9: Password reset token lookup
      // Query: "Validate password reset tokens quickly"
      // Usage: Password reset workflows, token validation
      const [passwordResetTokenIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_password_reset_token'`,
        { transaction }
      );

      if (passwordResetTokenIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_password_reset_token
           ON users ("passwordResetToken", "passwordResetExpires")
           WHERE "passwordResetToken" IS NOT NULL
           AND "passwordResetExpires" > NOW()
           AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_password_reset_token');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_password_reset_token');
      }

      // Index 10: Email verification token lookup
      // Query: "Validate email verification tokens quickly"
      // Usage: Email verification workflows, token validation
      const [emailVerificationTokenIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_email_verification_token'`,
        { transaction }
      );

      if (emailVerificationTokenIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_email_verification_token
           ON users ("emailVerificationToken", "emailVerificationExpires")
           WHERE "emailVerificationToken" IS NOT NULL
           AND "emailVerificationExpires" > NOW()
           AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_email_verification_token');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_email_verification_token');
      }

      // ============================================================
      // OAUTH INTEGRATION TRACKING
      // ============================================================

      console.log('[MIGRATION] Section 6: OAuth integration indexes');

      // Index 11: OAuth provider lookup
      // Query: "Find users by OAuth provider and provider ID"
      // Usage: OAuth authentication, SSO integration
      const [oauthProviderIndexExists] = await queryInterface.sequelize.query(
        `SELECT indexname FROM pg_indexes
         WHERE tablename = 'users'
         AND indexname = 'idx_users_oauth_provider'`,
        { transaction }
      );

      if (oauthProviderIndexExists.length === 0) {
        await queryInterface.sequelize.query(
          `CREATE INDEX IF NOT EXISTS idx_users_oauth_provider
           ON users ("oauthProvider", "oauthProviderId", email)
           WHERE "oauthProvider" IS NOT NULL
           AND "oauthProviderId" IS NOT NULL
           AND "isActive" = true
           AND "deletedAt" IS NULL`,
          { transaction }
        );
        console.log('[MIGRATION] Created partial index: idx_users_oauth_provider');
      } else {
        console.log('[MIGRATION] Index already exists: idx_users_oauth_provider');
      }

      // Audit log entry for compliance
      console.log('[MIGRATION AUDIT] User security indexes added successfully');
      console.log('[MIGRATION AUDIT] Total indexes created/verified: 11');
      console.log('[MIGRATION AUDIT] Categories: Lockouts (2), Password Rotation (2), MFA (2), Email Verification (2), Tokens (2), OAuth (1)');
      console.log('[MIGRATION AUDIT] All indexes are partial indexes for optimal performance');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION] Completed: Add user security indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ERROR] Failed to add user security indexes:', error.message);
      throw error;
    }
  },

  /**
   * Remove user security indexes
   *
   * @param {QueryInterface} queryInterface - Sequelize query interface
   * @param {Sequelize} Sequelize - Sequelize instance
   * @returns {Promise<void>}
   */
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      console.log('[MIGRATION ROLLBACK] Starting: Remove user security indexes');

      // Array of all indexes to remove
      const indexesToRemove = [
        'idx_users_active_lockouts',
        'idx_users_failed_login_monitoring',
        'idx_users_password_rotation',
        'idx_users_force_password_change',
        'idx_users_mfa_not_enabled',
        'idx_users_two_factor_enabled',
        'idx_users_unverified_email',
        'idx_users_is_email_verified',
        'idx_users_password_reset_token',
        'idx_users_email_verification_token',
        'idx_users_oauth_provider'
      ];

      // Remove each index if it exists
      for (const indexName of indexesToRemove) {
        const [indexExists] = await queryInterface.sequelize.query(
          `SELECT indexname FROM pg_indexes
           WHERE tablename = 'users'
           AND indexname = '${indexName}'`,
          { transaction }
        );

        if (indexExists.length > 0) {
          await queryInterface.removeIndex('users', indexName, { transaction });
          console.log(`[MIGRATION ROLLBACK] Removed index: ${indexName}`);
        } else {
          console.log(`[MIGRATION ROLLBACK] Index does not exist: ${indexName}`);
        }
      }

      // Audit log entry for compliance
      console.log('[MIGRATION AUDIT] User security indexes removed');
      console.log('[MIGRATION AUDIT] Total indexes removed: 11');
      console.log('[MIGRATION AUDIT] Timestamp:', new Date().toISOString());

      await transaction.commit();
      console.log('[MIGRATION ROLLBACK] Completed: Remove user security indexes');

    } catch (error) {
      await transaction.rollback();
      console.error('[MIGRATION ROLLBACK ERROR] Failed to remove user security indexes:', error.message);
      throw error;
    }
  }
};
