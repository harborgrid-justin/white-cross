/**
 * Migration: Add User Security Enhancements
 *
 * Adds comprehensive security fields to the users table for:
 * - Email verification workflow
 * - Password reset functionality
 * - Two-factor authentication support
 * - Account lockout protection
 * - Password change tracking
 * - HIPAA-compliant security controls
 *
 * These enhancements support healthcare compliance requirements
 * for secure authentication and audit trails.
 */

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Add phone number field (if not exists)
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'User phone number for contact and 2FA',
      }, { transaction });

      // Email verification fields
      await queryInterface.addColumn('users', 'emailVerified', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether email address has been verified',
      }, { transaction });

      await queryInterface.addColumn('users', 'emailVerificationToken', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Token for email verification',
      }, { transaction });

      await queryInterface.addColumn('users', 'emailVerificationExpires', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Expiration date for email verification token',
      }, { transaction });

      // Password reset fields
      await queryInterface.addColumn('users', 'passwordResetToken', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Token for password reset',
      }, { transaction });

      await queryInterface.addColumn('users', 'passwordResetExpires', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Expiration date for password reset token',
      }, { transaction });

      await queryInterface.addColumn('users', 'passwordChangedAt', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp when password was last changed (for token invalidation)',
      }, { transaction });

      // Two-factor authentication fields
      await queryInterface.addColumn('users', 'twoFactorEnabled', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Whether two-factor authentication is enabled',
      }, { transaction });

      await queryInterface.addColumn('users', 'twoFactorSecret', {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Secret key for TOTP-based 2FA',
      }, { transaction });

      // Account lockout fields
      await queryInterface.addColumn('users', 'failedLoginAttempts', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Number of consecutive failed login attempts',
      }, { transaction });

      await queryInterface.addColumn('users', 'lockoutUntil', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp until which account is locked',
      }, { transaction });

      // Password change tracking
      await queryInterface.addColumn('users', 'lastPasswordChange', {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time user changed their password (for 90-day policy)',
      }, { transaction });

      await queryInterface.addColumn('users', 'mustChangePassword', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'Flag to force password change on next login',
      }, { transaction });

      // Create indexes for performance and security
      await queryInterface.addIndex('users', ['emailVerificationToken'], {
        name: 'users_email_verification_token_idx',
        transaction,
      });

      await queryInterface.addIndex('users', ['passwordResetToken'], {
        name: 'users_password_reset_token_idx',
        transaction,
      });

      await queryInterface.addIndex('users', ['lockoutUntil'], {
        name: 'users_lockout_until_idx',
        transaction,
      });

      await queryInterface.addIndex('users', ['emailVerified'], {
        name: 'users_email_verified_idx',
        transaction,
      });

      await queryInterface.addIndex('users', ['twoFactorEnabled'], {
        name: 'users_two_factor_enabled_idx',
        transaction,
      });

      // Set lastPasswordChange for existing users to current timestamp
      await queryInterface.sequelize.query(
        `UPDATE users SET "lastPasswordChange" = NOW() WHERE "lastPasswordChange" IS NULL`,
        { transaction }
      );

      await transaction.commit();
      console.log('✓ User security enhancement fields added successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to add user security fields:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes
      await queryInterface.removeIndex('users', 'users_two_factor_enabled_idx', { transaction });
      await queryInterface.removeIndex('users', 'users_email_verified_idx', { transaction });
      await queryInterface.removeIndex('users', 'users_lockout_until_idx', { transaction });
      await queryInterface.removeIndex('users', 'users_password_reset_token_idx', { transaction });
      await queryInterface.removeIndex('users', 'users_email_verification_token_idx', { transaction });

      // Remove columns in reverse order
      await queryInterface.removeColumn('users', 'mustChangePassword', { transaction });
      await queryInterface.removeColumn('users', 'lastPasswordChange', { transaction });
      await queryInterface.removeColumn('users', 'lockoutUntil', { transaction });
      await queryInterface.removeColumn('users', 'failedLoginAttempts', { transaction });
      await queryInterface.removeColumn('users', 'twoFactorSecret', { transaction });
      await queryInterface.removeColumn('users', 'twoFactorEnabled', { transaction });
      await queryInterface.removeColumn('users', 'passwordChangedAt', { transaction });
      await queryInterface.removeColumn('users', 'passwordResetExpires', { transaction });
      await queryInterface.removeColumn('users', 'passwordResetToken', { transaction });
      await queryInterface.removeColumn('users', 'emailVerificationExpires', { transaction });
      await queryInterface.removeColumn('users', 'emailVerificationToken', { transaction });
      await queryInterface.removeColumn('users', 'emailVerified', { transaction });
      await queryInterface.removeColumn('users', 'phone', { transaction });

      await transaction.commit();
      console.log('✓ User security enhancement fields removed');
    } catch (error) {
      await transaction.rollback();
      console.error('✗ Failed to remove user security fields:', error);
      throw error;
    }
  }
};
