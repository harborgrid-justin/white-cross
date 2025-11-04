import { QueryInterface, DataTypes } from 'sequelize';

/**
 * Migration: Add MFA, OAuth, and Email Verification fields to users table
 *
 * Adds fields for:
 * - Multi-Factor Authentication (MFA/2FA)
 * - OAuth provider integration
 * - Enhanced email verification tracking
 */
export default {
  async up(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Check if columns already exist before adding
      const tableDescription = await queryInterface.describeTable('users');

      // Add MFA fields
      if (!tableDescription.mfaEnabled) {
        await queryInterface.addColumn(
          'users',
          'mfaEnabled',
          {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether multi-factor authentication is enabled',
          },
          { transaction }
        );
      }

      if (!tableDescription.mfaSecret) {
        await queryInterface.addColumn(
          'users',
          'mfaSecret',
          {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'TOTP secret for MFA (encrypted)',
          },
          { transaction }
        );
      }

      if (!tableDescription.mfaBackupCodes) {
        await queryInterface.addColumn(
          'users',
          'mfaBackupCodes',
          {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'JSON array of hashed backup codes for MFA recovery',
          },
          { transaction }
        );
      }

      if (!tableDescription.mfaEnabledAt) {
        await queryInterface.addColumn(
          'users',
          'mfaEnabledAt',
          {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when MFA was enabled',
          },
          { transaction }
        );
      }

      // Add OAuth fields
      if (!tableDescription.oauthProvider) {
        await queryInterface.addColumn(
          'users',
          'oauthProvider',
          {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'OAuth provider (google, microsoft, etc.)',
          },
          { transaction }
        );
      }

      if (!tableDescription.oauthProviderId) {
        await queryInterface.addColumn(
          'users',
          'oauthProviderId',
          {
            type: DataTypes.STRING(255),
            allowNull: true,
            comment: 'User ID from OAuth provider',
          },
          { transaction }
        );
      }

      if (!tableDescription.profilePictureUrl) {
        await queryInterface.addColumn(
          'users',
          'profilePictureUrl',
          {
            type: DataTypes.STRING(500),
            allowNull: true,
            comment: 'URL to user profile picture',
          },
          { transaction }
        );
      }

      // Add enhanced email verification fields
      if (!tableDescription.isEmailVerified) {
        await queryInterface.addColumn(
          'users',
          'isEmailVerified',
          {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: 'Whether email address has been verified',
          },
          { transaction }
        );
      }

      if (!tableDescription.emailVerifiedAt) {
        await queryInterface.addColumn(
          'users',
          'emailVerifiedAt',
          {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Timestamp when email was verified',
          },
          { transaction }
        );
      }

      // Add indexes for new fields
      await queryInterface.addIndex('users', ['mfaEnabled'], {
        name: 'idx_users_mfa_enabled',
        transaction,
      });

      await queryInterface.addIndex('users', ['oauthProvider', 'oauthProviderId'], {
        name: 'idx_users_oauth_provider_id',
        transaction,
      });

      await queryInterface.addIndex('users', ['isEmailVerified'], {
        name: 'idx_users_email_verified',
        transaction,
      });

      await transaction.commit();
      console.log('Successfully added MFA, OAuth, and email verification fields to users table');
    } catch (error) {
      await transaction.rollback();
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface: QueryInterface): Promise<void> {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Remove indexes
      await queryInterface.removeIndex('users', 'idx_users_mfa_enabled', { transaction });
      await queryInterface.removeIndex('users', 'idx_users_oauth_provider_id', { transaction });
      await queryInterface.removeIndex('users', 'idx_users_email_verified', { transaction });

      // Remove MFA fields
      await queryInterface.removeColumn('users', 'mfaEnabled', { transaction });
      await queryInterface.removeColumn('users', 'mfaSecret', { transaction });
      await queryInterface.removeColumn('users', 'mfaBackupCodes', { transaction });
      await queryInterface.removeColumn('users', 'mfaEnabledAt', { transaction });

      // Remove OAuth fields
      await queryInterface.removeColumn('users', 'oauthProvider', { transaction });
      await queryInterface.removeColumn('users', 'oauthProviderId', { transaction });
      await queryInterface.removeColumn('users', 'profilePictureUrl', { transaction });

      // Remove email verification fields
      await queryInterface.removeColumn('users', 'isEmailVerified', { transaction });
      await queryInterface.removeColumn('users', 'emailVerifiedAt', { transaction });

      await transaction.commit();
      console.log('Successfully removed MFA, OAuth, and email verification fields from users table');
    } catch (error) {
      await transaction.rollback();
      console.error('Migration rollback failed:', error);
      throw error;
    }
  },
};
